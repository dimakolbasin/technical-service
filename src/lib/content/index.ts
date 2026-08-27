import { getCollection } from "astro:content";
import { routeKeys, routes, type RouteKey } from "../routes";
import { LANGUAGE_ORDER, uiLanguages } from "./locales";
import {
  contactsPageSchema,
  homeSchema,
  pricesPageSchema,
  privacyPageSchema,
  serviceDetailSchema,
  servicesPageSchema,
} from "./schemas";
import type { Language, PageByRoute, UiLanguage } from "./types";

export { LANGUAGE_ORDER, localeCodes, uiLanguages } from "./locales";
export { routeKeys } from "../routes";
export type * from "./types";

const ENTRY_JSON_EXT_PATTERN = /\.json$/;

function pageKeyFromEntryId(id: string): string {
  const pageKey = id.split("/").at(-2);
  if (!pageKey) throw new Error(`Invalid content path: ${id}`);
  return pageKey;
}

export function getOrderedLanguages(): UiLanguage[] {
  return LANGUAGE_ORDER.map((code) =>
    uiLanguages.find((item) => item.code === code),
  ).filter((item): item is UiLanguage => Boolean(item));
}

const referencePathKeys = [...routeKeys].sort();
for (const language of uiLanguages) {
  const pathKeys = Object.keys(language.paths).sort();
  if (pathKeys.join("\0") !== referencePathKeys.join("\0")) {
    throw new Error(`Locale ${language.code} has a different route set`);
  }
}

let cache: Promise<Language[]> | undefined;

export function loadLanguages(): Promise<Language[]> {
  cache ||= getCollection("pages").then((entries) =>
    uiLanguages.map((ui) => {
      const localized = Object.fromEntries(
        entries
          .map(
            (entry) =>
              [
                entry.id.replace(ENTRY_JSON_EXT_PATTERN, ""),
                entry.data,
              ] as const,
          )
          .filter(([id]) => id.endsWith(`/${ui.code}`))
          .map(([id, data]) => [pageKeyFromEntryId(id), data]),
      );
      const contentKeys = Object.keys(localized).sort();
      if (contentKeys.join("\0") !== referencePathKeys.join("\0")) {
        throw new Error(
          `Locale ${ui.code} content does not match its route set`,
        );
      }
      const { home: rawHome, ...rawPages } = localized;
      const home = homeSchema.parse(rawHome);
      const pages = Object.fromEntries(
        Object.entries(rawPages).map(([key, page]) => {
          const routeKey = key as RouteKey;
          const schema =
            routes[routeKey].component === "services"
              ? servicesPageSchema
              : routes[routeKey].component === "prices"
                ? pricesPageSchema
                : routes[routeKey].component === "contacts"
                  ? contactsPageSchema
                  : routes[routeKey].component === "privacy"
                    ? privacyPageSchema
                    : serviceDetailSchema;
          return [key, schema.parse(page)];
        }),
      ) as Language["pages"];
      return { ...ui, home, pages };
    }),
  );
  return cache;
}

export function getPage<Key extends keyof PageByRoute>(
  language: Language,
  pageKey: Key,
): PageByRoute[Key] {
  const page = language.pages[pageKey];
  if (!page)
    throw new Error(`Missing page ${pageKey} for locale ${language.code}`);
  return page;
}

export async function getStaticPages() {
  const languages = await loadLanguages();
  return languages.flatMap((language) =>
    routeKeys.map((pageKey) => ({
      language,
      pageKey,
      path: language.paths[pageKey],
    })),
  );
}
