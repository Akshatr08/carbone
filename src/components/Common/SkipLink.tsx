/**
 * WCAG 2.4.1 — visible-on-focus skip-to-main link.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-charcoal focus:px-3 focus:py-2 focus:text-sm focus:text-charcoal-foreground focus:outline-none focus:ring-2 focus:ring-gold"
    >
      Skip to main content
    </a>
  );
}
