# technical-service

Статический многоязычный сайт на Astro 7. В браузер не загружается UI-фреймворк: компоненты рендерятся в HTML во время сборки, а интерактивность остаётся на небольшом TypeScript.

## Команды

```bash
npm install
npm run dev
npm test
npm run test:e2e
```

`npm test` выполняет TypeScript/Astro-проверку, статическую сборку, проверку всех маршрутов и сравнение с семантическим baseline прежнего Eleventy-сайта.

## Структура

- `src/components` — повторно используемые UI-блоки и архетипы страниц;
- `src/layouts/BaseLayout.astro` — общий HTML layout, SEO и JSON-LD;
- `src/content/pages/<page-key>/<locale>.json` — контент конкретной страницы;
- `src/content/locales/<locale>.json` — общие UI-переводы и маршруты;
- `src/content.config.ts` — Zod-схема контента;
- `src/scripts` — типизированные analytics и UI-сценарии;
- `public` — assets с неизменными публичными URL;
- `tests/eleventy-semantic-baseline.json` — контрольные hashes прежнего сайта;
- `tests/e2e` — визуальные, функциональные и accessibility-проверки.

Новая страница должна быть добавлена во все три локали и в `paths` каждого UI-каталога. Несовпадение route/content sets останавливает сборку.
