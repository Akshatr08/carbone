import { describe, it, expect } from "vitest";
import { z } from "zod";

// Re-creating the schema from ecobot.functions.ts to test it directly
// since the server function itself requires a TanStack context
const schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z
          .string()
          .trim()
          .min(1)
          .max(4000)
          .refine((s) => !/\p{Cc}/u.test(s), {
            message: "Contains invalid control characters",
          }),
      }),
    )
    .min(1)
    .max(40),
});

describe("EcoBot Payload Schema", () => {
  it("accepts valid messages", () => {
    const input = {
      messages: [{ role: "user", content: "How do I reduce emissions?" }],
    };
    expect(schema.parse(input)).toEqual(input);
  });

  it("rejects empty messages array", () => {
    expect(() => schema.parse({ messages: [] })).toThrow();
  });

  it("rejects > 40 messages", () => {
    const messages = Array(41).fill({ role: "user", content: "hi" });
    expect(() => schema.parse({ messages })).toThrow();
  });

  it("rejects messages longer than 4000 chars", () => {
    const input = {
      messages: [{ role: "user", content: "a".repeat(4001) }],
    };
    expect(() => schema.parse(input)).toThrow();
  });

  it("rejects messages with control characters", () => {
    const input = {
      messages: [{ role: "user", content: "hello \x00 world" }],
    };
    expect(() => schema.parse(input)).toThrow();
  });
});
