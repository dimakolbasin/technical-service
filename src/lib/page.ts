import type { Language, PageContent, RouteKey } from "./content";
import { PageType, pageTypeByRoute } from "./analytics";
import { routes } from "./routes";
import type { FaqBlock, ServiceDetailContent } from "./content/types";
import { whatsappNumber } from "./site";

const DEFAULT_CURRENCY = "GEL";
const DEFAULT_LOCALITY = "Batumi";
const DEFAULT_OFFER_AVAILABILITY = "https://schema.org/InStock";

const LEADING_SLASH_PATTERN = /^\//;
const TRAILING_SLASH_PATTERN = /\/$/;

export function trimSlashes(path: string): string {
  return path
    .replace(LEADING_SLASH_PATTERN, "")
    .replace(TRAILING_SLASH_PATTERN, "");
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const BUSINESS_OPENING_HOURS = {
  opens: "09:00",
  closes: "20:00",
} as const;

export function pageType(pageKey: RouteKey | false): PageType {
  return pageKey ? pageTypeByRoute[pageKey] : PageType.Error;
}

type Offer = Record<string, unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toOffer(item: unknown, pageUrl: string): Offer | null {
  if (!isRecord(item) || !isRecord(item.schemaPrice)) return null;
  const schemaPrice = item.schemaPrice;
  if (!schemaPrice || typeof schemaPrice.minPrice === "undefined") return null;
  const currency =
    typeof schemaPrice.currency === "string"
      ? schemaPrice.currency
      : DEFAULT_CURRENCY;
  const priceSpecification: Record<string, unknown> = {
    "@type": "PriceSpecification",
    priceCurrency: currency,
    minPrice: schemaPrice.minPrice,
  };
  if (typeof schemaPrice.maxPrice !== "undefined") {
    priceSpecification.maxPrice = schemaPrice.maxPrice;
  }
  return {
    "@type": "Offer",
    name: item.label,
    url: pageUrl,
    priceCurrency: currency,
    price: schemaPrice.price ?? schemaPrice.minPrice,
    priceSpecification,
    availability: DEFAULT_OFFER_AVAILABILITY,
  };
}

function collectOffers(node: unknown, pageUrl: string): Offer[] {
  if (!isRecord(node)) return [];
  return [
    ...(Array.isArray(node.items)
      ? node.items
          .map((item) => toOffer(item, pageUrl))
          .filter((offer): offer is Offer => Boolean(offer))
      : []),
    ...(Array.isArray(node.groups)
      ? node.groups.flatMap((group) => collectOffers(group, pageUrl))
      : []),
  ];
}

export function buildSchemas(args: {
  language: Language;
  pageKey: RouteKey;
  page: PageContent | null;
  title: string;
  description: string;
  site: import("./site").SiteConfig;
}): Record<string, unknown>[] {
  const { language, pageKey, page, title, description, site } = args;
  const pageUrl = site.baseUrl + language.paths[pageKey];
  const homeUrl = site.baseUrl + language.paths.home;
  const areaServed = language.areasList?.length
    ? language.areasList
    : DEFAULT_LOCALITY;
  const localBusinessId = `${site.baseUrl}/#localbusiness`;
  const sameAs = [
    site.telegram,
    `https://wa.me/${whatsappNumber}`,
    site.facebook,
    site.googleMaps,
    site.googleBusinessProfile,
  ].filter(Boolean);
  const pageFaq: FaqBlock | undefined =
    pageKey === "home"
      ? language.home.faq
      : page && routes[pageKey].component === "detail"
        ? (page as ServiceDetailContent).faq
        : undefined;
  const pagePrice = page && "price" in page ? page.price : undefined;
  const pageSections = page && "sections" in page ? page.sections : [];
  const pageOffers = [
    ...collectOffers(pagePrice, pageUrl),
    ...(Array.isArray(pageSections)
      ? pageSections.flatMap((section) => collectOffers(section, pageUrl))
      : []),
  ];
  const isService = routes[pageKey].pageType === PageType.Service;
  const isArticle = routes[pageKey].pageType === PageType.Article;

  return [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": localBusinessId,
      name: site.name,
      url: homeUrl,
      telephone: site.phone,
      description: language.home.metaDescription,
      image: `${site.baseUrl}/assets/icons/meta-pic.webp`,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.street,
        postalCode: site.address.postalCode,
        addressLocality: site.address.locality,
        addressRegion: site.address.region,
        addressCountry: site.address.country,
      },
      areaServed,
      hasMap: site.googleMaps ? [site.googleMaps] : undefined,
      priceRange: site.priceRange,
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [...DAYS_OF_WEEK],
          opens: BUSINESS_OPENING_HOURS.opens,
          closes: BUSINESS_OPENING_HOURS.closes,
        },
      ],
      sameAs,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: language.nav.find((item) => item.key === "home")!.label,
          item: homeUrl,
        },
        ...(pageKey === "home"
          ? []
          : [{ "@type": "ListItem", position: 2, name: title, item: pageUrl }]),
      ],
    },
    isService
      ? {
          "@context": "https://schema.org",
          "@type": "Service",
          name: title,
          serviceType: title,
          provider: {
            "@type": "LocalBusiness",
            "@id": localBusinessId,
            name: site.name,
          },
          areaServed,
          url: pageUrl,
          description,
          offers: pageOffers.length ? pageOffers : undefined,
        }
      : null,
    isArticle
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          mainEntityOfPage: pageUrl,
          headline: page?.heading || title,
          description,
          datePublished: page?.datePublished,
          dateModified: page?.dateModified,
          inLanguage: language.code,
          image: `${site.baseUrl}/assets/icons/meta-pic.webp`,
          author: {
            "@type": "Organization",
            "@id": localBusinessId,
            name: site.name,
          },
          publisher: {
            "@type": "Organization",
            "@id": localBusinessId,
            name: site.name,
          },
        }
      : null,
    !isService && pageOffers.length
      ? {
          "@context": "https://schema.org",
          "@type": "OfferCatalog",
          name: title,
          url: pageUrl,
          itemListElement: pageOffers,
        }
      : null,
    pageFaq?.items?.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: pageFaq.items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }
      : null,
  ].filter(Boolean) as Record<string, unknown>[];
}
