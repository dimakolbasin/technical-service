import type { z } from "zod";
import type { LocaleCode } from "../analytics/enums";
import type { RouteKeyByComponent } from "../routes";
import type {
  contactCardSchema,
  contactItemSchema,
  contactsPageSchema,
  ctaBlockSchema,
  faqBlockSchema,
  homeSchema,
  linkBlockSchema,
  linkItemSchema,
  listBlockSchema,
  priceItemSchema,
  priceSectionSchema,
  priceValueSchema,
  pricesPageSchema,
  privacyPageSchema,
  searchPhrasesSchema,
  serviceDetailSchema,
  servicesPageSchema,
  textSectionSchema,
} from "./schemas";
import type { uiLanguages } from "./locales";

export type TextSection = z.infer<typeof textSectionSchema>;
export type PriceValue = z.infer<typeof priceValueSchema>;
export type PriceItem = z.infer<typeof priceItemSchema>;
export type PriceSection = z.infer<typeof priceSectionSchema>;
export type FaqBlock = z.infer<typeof faqBlockSchema>;
export type ListBlock = z.infer<typeof listBlockSchema>;
export type LinkItem = z.infer<typeof linkItemSchema>;
export type LinkBlock = z.infer<typeof linkBlockSchema>;
export type SearchPhrases = z.infer<typeof searchPhrasesSchema>;
export type ContactItem = z.infer<typeof contactItemSchema>;
export type ContactCard = z.infer<typeof contactCardSchema>;
export type CtaBlock = z.infer<typeof ctaBlockSchema>;
export type ServiceDetailContent = z.infer<typeof serviceDetailSchema>;
export type ServicesPageContent = z.infer<typeof servicesPageSchema>;
export type PricesPageContent = z.infer<typeof pricesPageSchema>;
export type ContactsPageContent = z.infer<typeof contactsPageSchema>;
export type PrivacyPageContent = z.infer<typeof privacyPageSchema>;
export type HomeContent = z.infer<typeof homeSchema>;
export type PageContent =
  | ServiceDetailContent
  | ServicesPageContent
  | PricesPageContent
  | ContactsPageContent
  | PrivacyPageContent;

export type PageByRoute = {
  services: ServicesPageContent;
  prices: PricesPageContent;
  contacts: ContactsPageContent;
  privacy: PrivacyPageContent;
} & {
  [Key in RouteKeyByComponent<"detail">]: ServiceDetailContent;
};

export type TrustSignal = NonNullable<
  ContactsPageContent["trustSignals"]
>[number];
export type Locale = `${LocaleCode}`;
export type UiLanguage = (typeof uiLanguages)[number];
export type { RouteKey } from "../routes";
export type Language = UiLanguage & {
  home: HomeContent;
  pages: PageByRoute;
};
