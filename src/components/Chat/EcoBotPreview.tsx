import { Link } from "@tanstack/react-router";
import { Leaf, ChevronRight, Send } from "lucide-react";
import { useState } from "react";

export function EcoBotPreview() {
  const [draft, setDraft] = useState("");
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 pb-3">
        <span
          className="grid h-7 w-7 place-items-center rounded-full bg-charcoal text-gold"
          aria-hidden
        >
          <Leaf className="h-3.5 w-3.5" />
        </span>
        <p className="text-sm font-medium">EcoBot</p>
        <span className="ml-auto text-[11px] text-muted-foreground">AI carbon advisor</span>
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="max-w-[80%] rounded-lg bg-surface-hover px-3 py-2 text-sm">
          Hi! I noticed transport is your biggest source this month. Want a quick tip?
        </div>
        <div className="ml-auto max-w-[80%] rounded-lg bg-charcoal px-3 py-2 text-sm text-charcoal-foreground">
          Yes, what should I try first?
        </div>
        <div className="max-w-[80%] rounded-lg bg-surface-hover px-3 py-2 text-sm">
          Try replacing 2 weekly car commutes with metro — saves ~0.5 t/yr.
        </div>
      </div>
      <form
        className="mt-3 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label htmlFor="preview-msg" className="sr-only">
          Ask EcoBot
        </label>
        <input
          id="preview-msg"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask EcoBot…"
          className="h-9 flex-1 rounded-md bg-input px-3 text-sm outline-none focus:ring-1 focus:ring-gold"
        />
        <Link
          to="/chat"
          aria-label="Open full chat"
          className="grid h-9 w-9 place-items-center rounded-md bg-gold text-gold-foreground hover:opacity-90"
        >
          <Send className="h-4 w-4" />
        </Link>
      </form>
      <Link
        to="/chat"
        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-gold hover:underline"
      >
        Open full chat <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
