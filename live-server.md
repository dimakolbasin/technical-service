# Live-server разработка

## Установка зависимостей
```bash
yarn
```

## Режим разработки (watch + live-server)
```bash
yarn dev
```
- Eleventy пересобирает шаблоны в `dist/`.
- `live-server` отдаёт `dist/` и делает авто‑reload.
- По умолчанию адрес: `http://127.0.0.1:8080`.
Если видите `Cannot GET /`, дождитесь первой сборки Eleventy или перезапустите `yarn dev` — сервер стартует после появления `dist/index.html`.

## Однократная сборка
```bash
yarn build
```
Сборка сначала очищает `dist/`.

## Очистка dist
```bash
yarn clean
```

## Отдать уже собранный `dist/`
```bash
yarn serve
```

## Что править
- Шаблоны и страницы: `src/`
- Переводы/контент: `src/_data/i18n.json`
- Стили: `src/styles.css`
- Статика: `src/assets/`

## Перед деплоем
Обновите `src/_data/site.json` → поле `baseUrl` на реальный домен, чтобы корректно генерировались `hreflang`.
