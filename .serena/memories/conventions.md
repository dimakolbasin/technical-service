# Conventions

- Follow repository `AGENTS.md`: Ponytail minimalism, codebase-memory first for discovery, Serena for symbol-aware work.
- Keep page components grouped by route domain under `src/components/pages/<domain>`; only genuinely reusable UI belongs in `shared`.
- Separate `types.ts`, enums, rules, factories, and runtime/browser behavior when a domain warrants layers; do not add speculative abstractions.
- Constants use UPPER_SNAKE_CASE and are grouped by short `/** ... */` semantic comments.
- User-facing strings belong in RU/EN/KA JSON, not component fallbacks. Required content is enforced by TypeScript/content schemas; truly optional UI is conditionally rendered.
- Analytics markup is generated with typed `ga.*` build-time factories; do not hand-write `data-ga-*` attributes or change GA4 wire names/payloads.
- Preserve routes, HTML semantics, CSS classes, visual output, and accessibility unless explicitly changing them.
- Keep source CSS readable; only `dist/assets/styles.css` is minified during production build.