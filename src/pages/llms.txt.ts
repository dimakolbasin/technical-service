import type { APIRoute } from "astro";
import { PageType } from "../lib/analytics/enums";
import { loadLanguages } from "../lib/content";
import { routeKeys, routes } from "../lib/routes";
import { formatGeorgianPhone, site } from "../lib/site";

const EXCLUDED_KEYS = new Set<string>(["privacy"]);
const AREA_LINE =
  "Центр / Старый Батуми, Химшиашвили, Новый бульвар, Бони, район Аэропорта, Гонио";

type AnyPage = { title?: string; description?: string };

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
  const byCode = (code: string) => languages.find((l) => l.code === code);
  const ru = byCode("ru") ?? languages[0];
  const en = byCode("en");
  const ka = byCode("ka");
  const pagesOf = (lang: typeof ru | undefined) =>
    (lang?.pages ?? {}) as Record<string, AnyPage>;
  const ruPages = pagesOf(ru);
  const enPages = pagesOf(en);
  const kaPages = pagesOf(ka);

  const phone = `+995 ${formatGeorgianPhone(site.phone)}`;
  const phoneDigits = site.phone.replace(/\D/g, "");

  // цена уже в SEO-заголовке — не дублируем
  const priceSuffix = (
    title: string | undefined,
    price: number | null,
    hasPriceRe: RegExp,
    tpl: string,
  ) =>
    price && !hasPriceRe.test(String(title ?? ""))
      ? tpl.replace("%d", String(price))
      : "";

  const ruServiceLines = routeKeys
    .filter(
      (key) =>
        routes[key].pageType === PageType.Service && !EXCLUDED_KEYS.has(key),
    )
    .map((key) => {
      const page = ruPages[key] ?? {};
      const price = minPrice(ruPages[key]);
      const suffix = priceSuffix(
        page.title,
        price,
        /цен|₾/i,
        " — цены от %d ₾",
      );
      return `- ${page.title ?? key}${suffix} — ${site.baseUrl}${ru.paths[key]}`;
    });

  const kaServiceLines = routeKeys
    .filter(
      (key) =>
        routes[key].pageType === PageType.Service && !EXCLUDED_KEYS.has(key),
    )
    .map((key) => {
      const page = kaPages[key] ?? {};
      const price = minPrice(kaPages[key]) ?? minPrice(ruPages[key]);
      const suffix = priceSuffix(
        page.title,
        price,
        /ფას|₾/i,
        " — ფასები %d ₾-დან",
      );
      return `- ${page.title ?? key}${suffix} — ${site.baseUrl}${ka?.paths[key] ?? ""}`;
    });

  const enServiceLines = routeKeys
    .filter(
      (key) =>
        routes[key].pageType === PageType.Service && !EXCLUDED_KEYS.has(key),
    )
    .map((key) => {
      const page = enPages[key] ?? {};
      const price = minPrice(enPages[key]) ?? minPrice(ruPages[key]);
      const suffix = priceSuffix(
        page.title,
        price,
        /price|GEL|from \d/i,
        " — prices from %d GEL",
      );
      return `- ${page.title ?? key}${suffix} — ${site.baseUrl}${en?.paths[key] ?? ""}`;
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

  const body = `# ${site.name} — ремонт бытовой техники в Батуми (Грузия)

> Выездной мастер: стиральные, посудомоечные и сушильные машины, холодильники,
> духовые шкафы, варочные панели, кондиционеры, газовые котлы, колонки и
> водонагреватели. Ежедневно 9:00–20:00 без выходных. Диагностика 20 ₾,
> ремонт от 70 ₾, гарантия на работы и запчасти. Зона выезда: ${AREA_LINE}.
> Телефон: ${phone} (звонки, WhatsApp, Viber, Telegram). Языки: русский, английский, грузинский.

## Услуги (с ценами)

${ruServiceLines.join("\n")}

## Как понять, что пора звонить

- Стиральная или посудомоечная машина не сливает воду, течёт или не греет.
- Холодильник не морозит или охлаждает слабо.
- Кондиционер не охлаждает, течёт или требует чистки после сезона.
- Газовый котёл или колонка не включается, не зажигается, тухнет или падает давление.

## Зона выезда

${AREA_LINE}. Работа за пределами города (Гонио) — по договорённости.

## ქართული (Georgian)

> Tech Fix — საყოფაცხოვრებო ტექნიკის რემონტი ბათუმში. გასვლა ადგილზე:
> სარეცხი და ჭურჭლის მანქანები, საშრობები, მაცივარები, ღუმელები, კონდიციონერები,
> გაზის ქვაბები და კოლონკები. ყოველდღე 9:00–20:00. დიაგნოსტიკა 20 ₾,
> რემონტი 70 ₾-დან, გარანტია. მომსახურების ზონა: ბათუმი და გონიო.
> ტელეფონი: ${phone} (ზარი, WhatsApp, Viber, Telegram).

### მომსახურება

${kaServiceLines.join("\n")}

### როდის დავურეკოთ ოსტატს

- ჭურჭლის სარეცხი მანქანა არ ცლის წყალს, ჟონავს ან არ აცხელებს.
- მაცივარი არ აციებს ან სუსტად აცივებს.
- კონდიციონერი ცუდად აგრილებს, ჟონავს ან საჭიროებს გაწმენდას.
- გაზის ქვაბი არ ირთვება, არ ინთება ან წნევა ეცემა.

### გასვლის ზონა

ბათუმი: ცენტრი, ხიმშიაშვილი, ახალი ბულვარი, ბონი, აეროპორტის ზონა; გონიო — შეთანხმებით.

## English

> Tech Fix is an on-home appliance repair service in Batumi, Georgia: washing
> machines, dishwashers, dryers, refrigerators, ovens, hobs, air conditioners,
> gas boilers and water heaters. Daily 9:00–20:00. Diagnostics 20 GEL, repair
> from 70 GEL, warranty on parts and labor. Service area: Batumi districts + Gonio.
> Phone: ${phone} (calls, WhatsApp, Viber, Telegram). We speak English.

### Services

${enServiceLines.join("\n")}

### When to call

- Washer or dishwasher not draining, leaking or not heating.
- Refrigerator not cooling or cooling weakly.
- Air conditioner cooling poorly, leaking or due for a cleaning.
- Gas boiler or water heater won't start, won't ignite, locks out or loses pressure.

## Контакты / Contacts

- Телефон / Phone: ${phone}
- WhatsApp: https://wa.me/${phoneDigits}
- Telegram: ${site.telegram}
- Сайт / Website: ${site.baseUrl}

## Страницы / Pages (RU · EN · KA)

${pageLines.join("\n")}
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
