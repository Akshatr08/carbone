/**
 * Strip obvious PII (email, phone, 12-digit Aadhaar-like, 10-digit PAN-ish)
 * before sending user text to a third-party model. Best-effort only.
 */
const EMAIL = /[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}/g;
const PHONE = /(?:\+?\d{1,3}[\s-]?)?\(?\d{3,5}\)?[\s-]?\d{3,5}[\s-]?\d{2,5}/g;
const AADHAAR = /\b\d{4}\s?\d{4}\s?\d{4}\b/g;
const PAN = /\b[A-Z]{5}\d{4}[A-Z]\b/g;

export function scrubPII(input: string): string {
  return input
    .replace(EMAIL, "[email]")
    .replace(AADHAAR, "[id]")
    .replace(PAN, "[id]")
    .replace(PHONE, "[phone]");
}
