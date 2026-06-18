import { useEffect, useRef, useState, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Leaf, Send } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ecoBotReply } from "@/lib/ecobot.functions";
import { usePrefersReducedMotion } from "@/utils/motion";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED = [
  "How can I reduce transport emissions?",
  "Is an EV worth it in India?",
  "What's my biggest carbon source?",
  "Give me a weekly eco challenge",
  "How does my diet affect CO₂?",
];

const INITIAL: Msg[] = [
  {
    role: "assistant",
    content:
      "Hi! I'm EcoBot — your personal carbon advisor. Ask me anything about reducing your footprint, India-specific tips, or how to read your dashboard.",
  },
];

const MAX_LEN = 2000;

export function EcoBot() {
  const [messages, setMessages] = useLocalStorage<Msg[]>("carbone.chat", INITIAL);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const callBot = useServerFn(ecoBotReply);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [messages, pending, reducedMotion]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim().slice(0, MAX_LEN);
      if (!content || pending) return;
      const next = [...messages, { role: "user" as const, content }];
      setMessages(next);
      setDraft("");
      setPending(true);
      try {
        const res = await callBot({ data: { messages: next.slice(-20) } });
        setMessages([...next, { role: "assistant" as const, content: res.reply }]);
      } catch (e) {
        setMessages([
          ...next,
          {
            role: "assistant" as const,
            content: `Sorry — something broke: ${(e as Error).message}`,
          },
        ]);
      } finally {
        setPending(false);
      }
    },
    [messages, pending, setMessages, callBot],
  );

  return (
    <div className="grid h-[calc(100dvh-9rem)] grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-xl bg-surface p-5 hairline lg:flex lg:flex-col">
        <div className="flex items-center gap-3">
          <span
            className="grid h-10 w-10 place-items-center rounded-full bg-charcoal text-gold"
            aria-hidden
          >
            <Leaf className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium">EcoBot</p>
            <p className="text-[11px] text-muted-foreground">AI carbon advisor</p>
          </div>
        </div>
        <div className="hairline-t my-4" />
        <p className="mb-2 text-[11px] uppercase tracking-wider text-hint">Try asking</p>
        <ul className="space-y-1.5" aria-label="Suggested questions">
          {SUGGESTED.map((q) => (
            <li key={q}>
              <button
                type="button"
                onClick={() => send(q)}
                className="w-full rounded-md bg-accent px-3 py-1.5 text-left text-xs hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                {q}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-4">
          <span className="inline-block rounded-md bg-accent px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            Powered by Gemini
          </span>
        </div>
      </aside>

      <section className="flex min-h-0 flex-col rounded-xl bg-surface hairline">
        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto p-5"
          aria-live="polite"
          aria-atomic="false"
          aria-relevant="additions"
          role="log"
          aria-label="Chat history"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={[
                "max-w-[80%] rounded-lg px-3.5 py-2.5 text-sm whitespace-pre-wrap leading-relaxed",
                m.role === "user"
                  ? "ml-auto bg-charcoal text-charcoal-foreground"
                  : "bg-surface-hover text-foreground",
              ].join(" ")}
            >
              {m.content}
            </div>
          ))}
          {pending && (
            <div
              className="bg-surface-hover inline-flex items-center gap-1 rounded-lg px-3.5 py-3"
              role="status"
              aria-label="EcoBot is thinking"
            >
              <Dot reduced={reducedMotion} />
              <Dot reduced={reducedMotion} delay={150} />
              <Dot reduced={reducedMotion} delay={300} />
            </div>
          )}
        </div>

        <form
          className="hairline-t flex items-center gap-2 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
        >
          <label htmlFor="chat-input" className="sr-only">
            Message EcoBot
          </label>
          <input
            id="chat-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, MAX_LEN))}
            placeholder="Ask EcoBot about your footprint…"
            disabled={pending}
            maxLength={MAX_LEN}
            className="h-10 flex-1 rounded-md bg-input px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={pending || !draft.trim()}
            aria-label="Send message"
            className="grid h-10 w-10 place-items-center rounded-md bg-gold text-gold-foreground hover:opacity-90 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </section>
    </div>
  );
}

function Dot({ delay = 0, reduced = false }: { delay?: number; reduced?: boolean }) {
  return (
    <span
      className={[
        "inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground",
        reduced ? "" : "animate-pulse",
      ].join(" ")}
      style={reduced ? undefined : { animationDelay: `${delay}ms` }}
      aria-hidden="true"
    />
  );
}
