# Task completion

Run, in order:

1. `npm run format`
2. `npm test`
3. `npm run test:e2e` for UI, CSS, layout, content, analytics, or other browser-visible changes
4. `git diff --check`

Expected invariants:
- 67 generated HTML routes and semantic-baseline parity (except intentional baseline updates).
- 16 Playwright tests pass when browser tests apply.
- No broken local links.
- JavaScript remains within 3,800 bytes; current verification reports the actual maximum.
- Production CSS minification runs as part of `npm run build`.
- Working tree contains no generated `dist`, `.astro`, Playwright report, or test-result files.