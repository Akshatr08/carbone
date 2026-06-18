import { createFileRoute } from "@tanstack/react-router";
import { EcoBot } from "@/components/Chat/EcoBot";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "EcoBot · carbone" },
      {
        name: "description",
        content:
          "Chat with EcoBot, your AI carbon advisor, for India-specific, actionable footprint advice.",
      },
    ],
    links: [{ rel: "preconnect", href: "https://generativelanguage.googleapis.com" }],
  }),
  component: ChatPage,
});

function ChatPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="eyebrow">EcoBot</p>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl">Talk to your carbon advisor</h1>
      </header>
      <EcoBot />
    </div>
  );
}
