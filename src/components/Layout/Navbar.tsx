import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Plus } from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/tracker", label: "Track" },
  { to: "/insights", label: "Insights" },
  { to: "/actions", label: "Actions" },
  { to: "/chat", label: "EcoBot" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="carbone home">
      <span className="grid h-8 w-8 place-items-center rounded-md bg-charcoal font-serif text-lg text-gold">
        C
      </span>
      <span className="font-serif text-xl tracking-tight">
        carbo<span className="text-gold">ne</span>
      </span>
    </Link>
  );
}

export function Navbar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (p: string) => (p === "/" ? pathname === "/" : pathname.startsWith(p));

  return (
    <header className="sticky top-0 z-40 hairline-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-md hover:bg-surface-hover lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Logo />
        </div>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={[
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                isActive(item.to)
                  ? "font-medium text-gold"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/tracker"
          className="inline-flex items-center gap-1.5 rounded-md bg-charcoal px-3 py-2 text-sm font-medium text-charcoal-foreground hover:opacity-90"
          aria-label="Log a new activity"
        >
          <Plus className="h-4 w-4" /> Log Activity
        </Link>
      </div>

      {mobileOpen && (
        <nav className="hairline-t bg-background md:hidden" aria-label="Mobile">
          <ul className="flex flex-col p-2">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={[
                    "block rounded-md px-3 py-2 text-sm",
                    isActive(item.to)
                      ? "bg-accent font-medium text-gold"
                      : "text-foreground hover:bg-surface-hover",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
