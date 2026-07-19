# Security Policy

## Threat model

carbone is a personal CO₂ tracker. The threat surface is small but deliberate:

| Asset             | Threat                                      | Mitigation                                                                  |
| ----------------- | ------------------------------------------- | --------------------------------------------------------------------------- |
| `GEMINI_API_KEY`  | Leak to browser, log capture                | Server-only `process.env`, never `VITE_`, never logged                      |
| EcoBot endpoint   | Abuse / cost burn                           | In-memory **rate limit** 20 req/min/IP + 24h response cache                 |
| EcoBot response   | Memory exhaustion / hanging requests        | 10s fetch timeout + 2MB Content-Length guard payload size                   |
| User chat payload | Sending PII to a third-party model          | `scrubPII()` strips emails, phones, Aadhaar, PAN before egress              |
| Tracker form      | Garbage / XSS in stored activities          | Zod-validated client input with strict length/range caps                    |
| Rendered UI       | XSS via user-generated content              | React escaping + `sanitizeInput()` defense-in-depth HTML entity encoding    |
| App headers       | Clickjacking, MIME sniffing, mixed content  | CSP + X-Frame-Options DENY + nosniff + HSTS via `securityHeadersMiddleware` |
| LocalStorage      | Data exfil via other scripts on same origin | Only non-sensitive activity logs stored client-side                         |

## Header policy (set by `src/start.ts`)

- `Content-Security-Policy` — `default-src 'self'`, allowlisted Google Fonts + Gemini API
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

## Input validation

- All EcoBot messages: max 4000 chars, reject ASCII control bytes via Zod schema.
- All tracker fields: Zod schemas with `min/max/coerce.number` per category.
- Server validates with `inputValidator(z…)` — never trust the client validator alone.
- Rendered user strings run through `sanitizeInput()` where necessary.

## Rate limiting

`src/lib/rate-limit.ts` provides a sliding-window LRU keyed by client IP. Default: 20 req/minute, evicts after `MAX_KEYS=5000`. For multi-region scale, swap the in-memory map for KV/Upstash.

## Disclosure

Open an issue at <https://github.com/your-org/carbone/issues> tagged `security`. We respond within 5 working days.
