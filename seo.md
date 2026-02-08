# SEO: текущие настройки и статусы

Ниже зафиксированы настройки и статусы, как на скриншотах.

## Cloudflare

### DNS records для `tech-fix.ge`
- `CNAME` `batumi` → `technical-service.pages.dev` (Proxy: Proxied, TTL: Auto)
- `CNAME` `tech-fix.ge` → `batumi.tech-fix.ge` (Proxy: Proxied, TTL: Auto)
- `TXT` `batumi` → `yandex-verification: 8fac3…` (DNS only, TTL: Auto)
- `TXT` `tech-fix.ge` → `google-site-verification=…` (DNS only, TTL: 1 hr)

### Nameservers
- `desire.ns.cloudflare.com`
- `kareem.ns.cloudflare.com`

### Redirect rule
- Название: `Root → batumi`
- Условие (custom filter): `http.host eq "tech-fix.ge"`
- Редирект: `https://batumi.tech-fix.ge` + путь запроса  
  Expression: `concat("https://batumi.tech-fix.ge", http.request.uri.path)`
- Код: `301`
- Preserve query string: включено
- Порядок: `First`

## Google Search Console

### Свойства
В Google Search Console добавлены две разные сущности:
- `https://batumi.tech-fix.ge/` (URL‑свойство)
- `tech-fix.ge` (доменное свойство)

### Статусы (по скриншотам)
- Данные обрабатываются, просьба повторить попытку примерно через день (в блоках "Эффективность", "Индексирование", "Качество").
- В доменном свойстве зафиксировано `0` кликов за период (график с датами 04.02.2026–06.02.2026).
- В блоке HTTPS: отмечено `1` запись HTTPS, `1` не HTTPS (по сводке качества).

## Яндекс Вебмастер

### Свойство
- `https://batumi.tech-fix.ge`

### Статусы (по скриншотам)
- Диагностика: `1` ошибка, `2` рекомендации.
- Дубли заголовков и описаний: большого количества дублей не найдено.
- Клики в поиске: `0` (график без кликов).
- ИКС: недостаточно данных для определения.
- Обновления поиска: данные до `7 февраля 2026`.
- История обхода: данные появятся в ближайшее время.

## Технические SEO-настройки

### Middleware (Cloudflare Pages)

### Файл
- `functions/_middleware.js`

### Назначение
- Нормализует языковые корни `/ru`, `/en`, `/ka` в `/ru/`, `/en/`, `/ka/` (301).
- Для корня `/`:
  - Поисковые боты (Google, Yandex и др.) получают `200` и реальную страницу `/` без редиректа.
  - Пользователи перенаправляются на язык по `preferred_lang` cookie или по `Accept-Language` (302).
- Устанавливает cookie `preferred_lang` и корректные заголовки `Cache-Control` и `Vary` для языкового редиректа.
