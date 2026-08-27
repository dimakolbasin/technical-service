# Project core

- Static multilingual service website built with Astro; 67 generated routes across RU (root), EN, and KA.
- Route entrypoints live in `src/pages`; page UI lives in `src/components/pages`, shared UI in `src/components/shared`, shell UI in `src/components/layout`, and the document shell in `src/layouts/BaseLayout.astro`.
- Content is JSON: route content under `src/content/pages`, shared UI translations under `src/content/locales`; schemas and accessors live in `src/lib/content`.
- Site-wide constants/config live in `src/lib/site`; routing helpers in `src/lib/routes.ts` and `src/lib/page.ts`.
- Analytics is split between build-time typed contracts/factories in `src/lib/analytics` and browser tracking in `src/scripts/analytics`.
- Static assets are served from `public/assets`; production CSS is minified after Astro build without changing its public URL.
- Architecture/toolchain: `mem:tech_stack`. Code conventions: `mem:conventions`. Common commands: `mem:suggested_commands`. Required completion checks: `mem:task_completion`.