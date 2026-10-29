import type { APIRoute } from "astro";
import { PageType } from "../lib/analytics/enums";
import { loadLanguages } from "../lib/content";
import { routeKeys, routes } from "../lib/routes";
import { formatGeorgianPhone, site } from "../lib/site";

const EXCLUDED_KEYS = new Set<string>(["privacy"]);
const AREA_LINE =
  "Центр / Старый Батуми, Химшиашвили, Новый бульвар, Бони, район Аэропорта, Гонио";

type AnyPage = {
  title?: string;
  description?: string;
  sections?: { title?: string; items?: unknown[] }[];
};

// Канонический источник цен — раздел «Примерные цены» страницы /prices/.
// Ключевые слова строки прайса -> ключ маршрута услуги.
const PRICE_ROW_MAP: [RegExp, string[]][] = [
  [/стиральной|посудомоечной/i, ["washing-machines", "dishwashers"]],
  [/варочной/i, ["hobs"]],
  [/духового/i, ["ovens"]],
  [/холодильника/i, ["refrigerators"]],
  [/сушильной/i, ["dryers"]],
  [/котла/i, ["gas-boilers"]],
  [/обслуживание кондиционера/i, ["ac-repair"]],
];

const SERVICE_DESC: Record<string, string> = {
  "washing-machines": "слив, отжим, протечки, подшипники, модуль управления",
  dishwashers: "не сливает, не греет, протечки, плохо моет",
  hobs: "газовые и электрические конфорки, электроподжиг",
  ovens: "нагрев, термостат, плата, вентилятор",
  "ac-repair": "слабое охлаждение, протечки, заправка, электрика",
  "ac-cleaning": "фильтры, дренаж, дезинфекция",
  refrigerators: "не морозит, No Frost, компрессор, фреон",
  dryers: "долго сушит, нагрев, конденсат",
  "gas-boilers":
    "не зажигается, давление, теплообменник, колонки и водонагреватели",
};

export const GET: APIRoute = async () => {
  const languages = await loadLanguages();
  const byCode = (code: string) => languages.find((l) => l.code === code);
  const ru = byCode("ru") ?? languages[0];
  const en = byCode("en");
  const ka = byCode("ka");
  const pagesOf = (lang: typeof ru | undefined) =>
    (lang?.pages ?? {}) as Record<string, AnyPage>;
  const ruPages = pagesOf(ru);

  // Цены: берём строки из «Примерных цен» страницы /prices/ — тот же
  // источник, что видит человек. Никаких отдельных цифр в llms.txt.
  const priceRows: Record<string, string> = {};
  const pricesPage = ruPages["prices"];
  const sections = pricesPage?.sections ?? [];
  const example = sections.find((s) => /примерн/i.test(s.title ?? ""));
  for (const item of example?.items ?? []) {
    const it = item as { label?: string; value?: string };
    if (!it.label || !it.value) continue;
    if (/диагност/i.test(it.label)) continue; // диагностика идёт в шапку
    for (const [re, keys] of PRICE_ROW_MAP) {
      if (re.test(it.label)) {
        for (const key of keys) priceRows[key] = it.value;
        break;
      }
    }
  }
  // У ремонта кондиционера цена после диагностики; у чистки — из секции
  // «Кондиционеры»: частичная чистка 60 ₾ дешевле обслуживания от 70 ₾.
  const acSection = sections.find((s) => /кондиционер/i.test(s.title ?? ""));
  let partial = "";
  for (const item of acSection?.items ?? []) {
    const it = item as { label?: string; value?: string };
    if (it.label && /частичная чистка/i.test(it.label) && it.value) {
      partial = it.value;
      break;
    }
  }
  if (priceRows["ac-repair"]) {
    priceRows["ac-cleaning"] = partial
      ? `частичная чистка от ${partial.replace(/^от /, "")}; обслуживание ${priceRows["ac-repair"]}`
      : priceRows["ac-repair"];
    priceRows["ac-repair"] = "цена после диагностики";
  }

  const phone = `+995 ${formatGeorgianPhone(site.phone)}`;
  const phoneDigits = site.phone.replace(/\D/g, "");
  const u = (path: string) => site.baseUrl + path;

  const serviceLines = routeKeys
    .filter(
      (key) =>
        routes[key].pageType === PageType.Service && !EXCLUDED_KEYS.has(key),
    )
    .map((key) => {
      // SEO-заголовки иногда содержат «— цены от N ₾»: срезаем, чтобы в
      // llms.txt не было двух разных цен в одной строке (канон — страница цен).
      const rawTitle = ruPages[key]?.title ?? key;
      const title = rawTitle
        .replace(/\s*[—|–-]\s*цены[^|]*$/i, "")
        .replace(/\s*\|\s*$/, "");
      const desc = SERVICE_DESC[key] ?? "";
      const price = priceRows[key] ? `; цены: ${priceRows[key]}` : "";
      return `- [${title}](${u(ru.paths[key])}): ${desc}${price}`;
    });

  const articleLines = routeKeys
    .filter((key) => routes[key].pageType === PageType.Article)
    .map((key) => {
      const d = (ruPages[key]?.description ?? "").split(/[.!?]/)[0];
      return `- [${ruPages[key]?.title ?? key}](${u(ru.paths[key])}): ${d.toLowerCase()}.`;
    });

  const body = `# ${site.name} — вызов мастера по ремонту бытовой техники в Батуми (Грузия)

> Выездной ремонт бытовой техники в Батуми и Гонио: стиральные и посудомоечные
> машины, холодильники, сушильные машины, духовки, варочные панели, кондиционеры,
> газовые котлы, колонки и водонагреватели. Ежедневно 9:00–20:00.
> Диагностика 20 ₾ (при отказе от ремонта). Цены зависят от типа техники:
> отдельные виды работ — от 40 ₾; окончательная стоимость — после диагностики,
> запчасти оплачиваются отдельно, гарантия на работу и запчасти.
> Зона выезда: ${AREA_LINE}.
> Телефон: ${phone} (звонки, WhatsApp, Viber, Telegram).
> Обслуживаем на русском, английском и грузинском.

## Основное

- [Главная](${u(ru.paths["home"])}): о сервисе, преимущества, зона выезда.
- [Все услуги](${u(ru.paths["services"])}): полный перечень услуг.
- [Цены](${u(ru.paths["prices"])}): актуальный прайс по всем видам работ.
- [Контакты](${u(ru.paths["contacts"])}): телефон, мессенджеры, часы, адрес.

## Услуги (рус)

${serviceLines.join("\n")}

## Типовые проблемы

- Машина не сливает воду, течёт, не греет или плохо моет.
- Холодильник не морозит или охлаждает слабо.
- Кондиционер не охлаждает, течёт или давно не чистился.
- Газовый котёл или колонка не включается, не зажигается, тухнет.

## Статьи

${articleLines.join("\n")}

## ქართული

> Tech Fix — საყოფაცხოვრებო ტექნიკის რემონტი ბათუმში და გონიოში. ხელოსანი ბათუმში
> გამოძახებით: სარეცხი და ჭურჭლის მანქანები, მაცივრები, კონდიციონერები, გაზის ქვაბები.
> ყოველდღე 9:00–20:00. დიაგნოსტიკა 20 ₾ (რემონტზე უარის შემთხვევაში). გარანტია. ფასები — ფასების გვერდზე.
> ტელეფონი: ${phone}.

- [მომსახურება და ფასები](${u(ka!.paths["services"])})
- [ჭურჭლის სარეცხი მანქანების რემონტი](${u(ka!.paths["dishwashers"])})
- [მაცივარი არ აციებს — რემონტი](${u(ka!.paths["refrigerator-not-cooling"])})
- [გაზის ქვაბი არ ინთება](${u(ka!.paths["gas-boiler-not-igniting"])})
- [კონტაქტი](${u(ka!.paths["contacts"])})

## English

> Tech Fix — on-site home appliance repair in Batumi, Georgia. Certified
> technician, same-day visits. Daily 9:00–20:00.
> Diagnostics 20 GEL (charged only if the repair is declined). Warranty. Prices vary by appliance (from 40 GEL). Batumi + Gonio.

- [Services & prices](${u(en!.paths["services"])})
- [Dishwasher repair](${u(en!.paths["dishwashers"])})
- [Gas boiler not igniting](${u(en!.paths["gas-boiler-not-igniting"])})
- [Contacts](${u(en!.paths["contacts"])})

## Контакты / Contacts

- Телефон / Phone: ${phone}
- WhatsApp: https://wa.me/${phoneDigits}
- Telegram: ${site.telegram}
- Сайт / Website: ${site.baseUrl}

## Языковые версии / Languages

- [English — главная](${u(en!.paths["home"])})
- [ქართული — მთავარი](${u(ka!.paths["home"])})
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
