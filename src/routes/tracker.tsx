import { createFileRoute } from "@tanstack/react-router";
import { ActivityForm } from "@/components/Tracker/ActivityForm";
import { ActivityLog } from "@/components/Tracker/ActivityLog";

export const Route = createFileRoute("/tracker")({
  head: () => ({
    meta: [
      { title: "Track · carbone" },
      {
        name: "description",
        content: "Log transport, home energy, food and shopping to see your live CO₂ footprint.",
      },
    ],
  }),
  component: Tracker,
});

function Tracker() {
  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Tracker</p>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl">Log a new activity</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Each entry is calculated using India-aware emission factors.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <ActivityForm />
        <ActivityLog />
      </div>
    </div>
  );
}
