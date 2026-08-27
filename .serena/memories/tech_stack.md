# Tech stack

- Node.js >=22.12.0; Cloudflare deployment currently uses Node 22.16.0 and npm 10.9.2.
- npm with committed `package-lock.json`.
- Astro 7 static output; TypeScript 6; Zod-backed Astro content schemas.
- Prettier with Astro plugin for formatting.
- Playwright plus axe-core for desktop/mobile visual, accessibility, interaction, and analytics checks.
- esbuild is used only by `scripts/minify-css.mjs` to minify copied production CSS.
- No runtime UI framework or hydration layer; preserve the static-first output and small JavaScript budget.