import type { APIRoute } from "astro";
import { PageType } from "../lib/analytics/enums";
import { loadLanguages } from "../lib/content";
import { routeKeys, routes } from "../lib/routes";
import { formatGeorgianPhone, site } from "../lib/site";

const EXCLUDED_KEYS = new Set<string>(["privacy"]);
const AREA_LINE =
  "Центр / Старый Батуми, Химшиашвили, Новый бульвар, Бони, район Аэропорта, Гонио";

function minPrice(page: unknown): number | null {
  const price = (page as { price?: { groups?: unknown[]; items?: unknown[] } })
    .price;
  if (!price) return null;
  const groups = Array.isArray(price.groups) ? price.groups : [];
  const flat = Array.isArray(price.items) ? price.items : [];
  const items = [
    ...groups.flatMap((g) =>
      Array.isArray((g as { items?: unknown[] }).items)
        ? (g as { items: unknown[] }).items
        : [],
    ),
    ...flat,
  ] as { schemaPrice?: { minPrice?: number } }[];
  const prices = items
    .map((i) => i?.schemaPrice?.minPrice)
    .filter((v): v is number => typeof v === "number");
  return prices.length ? Math.min(...prices) : null;
}

export const GET: APIRoute = async () => {
  const languages = await loadLanguages();
  const ru = languages.find((l) => l.code === "ru") ?? languages[0];
  const en = languages.find((l) => l.code === "en");
  const ka = languages.find((l) => l.code === "ka");
  const ruPages = ru.pages as Record<
    string,
    { title?: string; description?: string }
  >;

  const serviceLines = routeKeys
    .filter(
      (key) =>
        routes[key].pageType === PageType.Service && !EXCLUDED_KEYS.has(key),
    )
    .map((key) => {
      const page = ruPages[key] ?? {};
      const price = minPrice(ruPages[key]);
      // title уже может содержать цену (SEO-заголовки) — не дублируем
      const priceSuffix =
        price && !/цен|₾|GEL/i.test(String(page.title ?? ""))
          ? ` — цены от ${price} ₾`
          : "";
      return `- ${page.title ?? key}${priceSuffix} — ${site.baseUrl}${ru.paths[key]}`;
    });

  const pageLines = routeKeys
    .filter((key) => !EXCLUDED_KEYS.has(key))
    .map((key) => {
      const page = ruPages[key] ?? {};
      const title =
        key === "home"
          ? "Ремонт бытовой техники в Батуми | Tech Fix"
          : (page.title ?? key);
      const alt = [
        en ? `${site.baseUrl}${en.paths[key]} (EN)` : null,
        ka ? `${site.baseUrl}${ka.paths[key]} (KA)` : null,
      ]
        .filter(Boolean)
        .join(", ");
      return `- ${site.baseUrl}${ru.paths[key]} — ${title}${page.description ? `. ${page.description}` : ""}${alt ? ` Другие языки: ${alt}` : ""}`;
    });

  const phone = `+995 ${formatGeorgianPhone(site.phone)}`;
  const body = `# ${site.name} — ремонт бытовой техники в Батуми (Грузия)

> Выездной мастер: стиральные, посудомоечные и сушильные машины, холодильники,
> духовые шкафы, варочные панели, кондиционеры, газовые котлы, колонки и
> водонагреватели. Ежедневно 9:00–20:00 без выходных. Диагностика 20 ₾,
> ремонт от 70 ₾, гарантия на работы и запчасти. Зона выезда: ${AREA_LINE}.
> Телефон: ${phone} (звонки, WhatsApp, Viber, Telegram). Языки: русский, английский, грузинский.

## Услуги (с ценами)

${serviceLines.join("\n")}

## Как понять, что пора звонить

- Стиральная или посудомоечная машина не сливает воду, течёт или не греет.
- Холодильник не морозит или охлаждает слабо.
- Кондиционер не охлаждает, течёт или требует чистки после сезона.
- Газовый котёл или колонка не включается, не зажигается, тухнет или падает давление.

## Зона выезда

${AREA_LINE}. Работа за пределами города (Гонио) — по договорённости.

## Контакты

- Телефон: ${phone}
- WhatsApp: https://wa.me/${site.phone.replace(/\D/g, "")}
- Telegram: ${site.telegram}
- Сайт: ${site.baseUrl}

## Страницы

${pageLines.join("\n")}
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
