# Contributing

## Setup

Ensure you have **Node.js 22+** installed.

```bash
npm install
cp .env.example .env   # add GEMINI_API_KEY for EcoBot
npm run dev
```

## Scripts

| Script                  | Purpose                                          |
| ----------------------- | ------------------------------------------------ |
| `npm run dev`           | Start dev server                                 |
| `npm run build`         | Production build                                 |
| `npm run lint`          | ESLint (strict, no-explicit-any, no-unused-vars) |
| `npm run format`        | Prettier                                         |
| `npm run test`          | Vitest one-shot                                  |
| `npm run test:watch`    | Vitest watch                                     |
| `npm run test:coverage` | Coverage report (thresholds in vitest.config.ts) |

## Conventions

- **No hex literals in components** — pull from `src/utils/chartTokens.ts` or design tokens in `src/styles.css`.
- **No raw numbers in UI** — use `formatNumber` / `formatKg` / `formatINR` from `src/utils/format.ts`.
- **All user input** goes through a Zod schema before reaching the store or a server fn.
- **All icon-only buttons** carry an `aria-label`.
- **All interactive primitives** have a `focus-visible:ring-2 focus-visible:ring-gold`.
- **Reduced motion** — wrap any animation in a `usePrefersReducedMotion()` check.
- **Server secrets** never carry the `VITE_` prefix and are read inside `.handler()`.

## Pull request checklist

- [ ] `npm run lint` clean
- [ ] `npm run test` green (incl. coverage thresholds)
- [ ] No new `console.log` in app code
- [ ] No raw hex / random colors in components
- [ ] Charts have `role="img"` + descriptive `aria-label`
- [ ] New routes set their own `head()` metadata
