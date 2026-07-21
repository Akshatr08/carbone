import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";
import { checkRateLimit } from "./rate-limit";
import { scrubPII } from "./pii-scrub";

const SYSTEM_PROMPT = `You are EcoBot, a friendly and knowledgeable carbon footprint advisor.
Help users in India understand their environmental impact.
Give specific, actionable, data-backed advice. Reference Indian context — electricity grid emission factor 0.82 kgCO2/kWh, India average footprint 1.9t/year.
Be encouraging, concise, and practical. Never use jargon without explaining it.
Keep answers under 180 words. Use short paragraphs and bullets when listing actions.`;

// Reject dangerous control chars to deter prompt-injection via hidden bytes.
// Allow \t (tab), \n (newline), \r (carriage return) — these appear in AI replies
// stored in localStorage and re-sent as conversation history.
const SafeText = z
  .string()
  .min(1)
  .max(2000)
  .regex(/^[^\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+$/u, "Text contains control characters");

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: SafeText,
});

const InputSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(40),
});

interface GeminiPart {
  text: string;
}
interface GeminiContent {
  role: "user" | "model";
  parts: GeminiPart[];
}

// Tiny in-memory response cache: hashed history → reply, 24h TTL.
const CACHE = new Map<string, { reply: string; expiresAt: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000;
const CACHE_MAX = 500;

async function hashKey(s: string): Promise<string> {
  const buf = new TextEncoder().encode(s);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Server fn that proxies chat to Google Gemini.
 * Adds rate limiting, PII scrubbing, response caching, and graceful
 * fallback when the key is missing.
 */
export const ecoBotReply = createServerFn({ method: "POST" })
  .validator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    // 1. Rate limit by IP (best-effort; falls back to a shared bucket).
    let ip = "anon";
    try {
      ip = getRequestIP({ xForwardedFor: true }) ?? "anon";
    } catch {
      /* outside request context (tests) */
    }
    const rl = checkRateLimit(`ecobot:${ip}`, 20, 60_000);
    if (!rl.ok) {
      return {
        ok: false as const,
        reply: `Whoa, slow down 🌿 — try again in ${rl.retryAfterSeconds}s.`,
      };
    }

    // 2. Scrub PII from every message.
    const cleaned = data.messages.map((m) => ({
      ...m,
      content: scrubPII(m.content),
    }));

    // 3. Response cache (24h, keyed by hashed history).
    const cacheKey = await hashKey(JSON.stringify(cleaned));
    const cached = CACHE.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return { ok: true as const, reply: cached.reply, cached: true };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        ok: false as const,
        reply:
          "EcoBot needs a Gemini API key to chat. Add `GEMINI_API_KEY` in project secrets — I'll be ready as soon as you do. In the meantime: your single biggest lever in India is usually electricity (grid factor 0.82 kgCO₂/kWh). Set your AC to 26 °C and switch to LEDs for a quick win.",
      };
    }

    const messagesPayload = [
      { role: "system", content: SYSTEM_PROMPT },
      ...cleaned.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://carbone.vercel.app",
          "X-Title": "Carbone",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: messagesPayload,
          temperature: 0.7,
          max_tokens: 600,
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        return {
          ok: false as const,
          reply: `EcoBot ran into a temporary issue (${response.status}). Please try again in a moment.`,
        };
      }

      // Defense-in-depth: Reject abnormally large responses to prevent memory exhaustion
      const contentLength = response.headers.get("Content-Length");
      if (contentLength && parseInt(contentLength, 10) > 1024 * 1024 * 2) {
        // 2MB limit
        throw new Error("Response payload too large");
      }

      const json = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const reply =
        json.choices?.[0]?.message?.content?.trim() ?? "Hmm, I didn't get that. Could you rephrase?";

      // Cache + bound size
      if (CACHE.size >= CACHE_MAX) {
        const firstKey = CACHE.keys().next().value;
        if (firstKey) CACHE.delete(firstKey);
      }
      CACHE.set(cacheKey, { reply, expiresAt: Date.now() + CACHE_TTL });

      return { ok: true as const, reply };
    } catch (e) {
      return {
        ok: false as const,
        reply: "EcoBot couldn't reach the AI service. Please try again shortly.",
      };
    }
  });
