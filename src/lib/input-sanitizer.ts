/**
 * A utility to sanitize user input to prevent XSS.
 * This provides defense-in-depth on top of React's automatic escaping.
 */
export function sanitizeInput(input: string | undefined | null): string {
  if (!input) return "";

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}
