import type { RouteKey } from "../content";
import { routes } from "../routes";
import { ContactMethod, ContentType, TrackingLocation } from "./enums";

export const pageTypeByRoute = Object.fromEntries(
  Object.entries(routes).map(([key, route]) => [key, route.pageType]),
) as { [Key in RouteKey]: (typeof routes)[Key]["pageType"] };

const ALL_CONTACT_METHODS = [
  ContactMethod.Call,
  ContactMethod.Email,
  ContactMethod.Facebook,
  ContactMethod.Telegram,
  ContactMethod.Viber,
  ContactMethod.WhatsApp,
] as const;

export const contactRules = {
  [TrackingLocation.HeaderPhone]: [ContactMethod.Call],
  [TrackingLocation.HomeHero]: [
    ContactMethod.Call,
    ContactMethod.Facebook,
    ContactMethod.Telegram,
    ContactMethod.Viber,
    ContactMethod.WhatsApp,
  ],
  [TrackingLocation.HomeServiceStandard]: [ContactMethod.Call],
  [TrackingLocation.PageCta]: [
    ContactMethod.Call,
    ContactMethod.Telegram,
    ContactMethod.Viber,
    ContactMethod.WhatsApp,
  ],
  [TrackingLocation.FooterActions]: [
    ContactMethod.Call,
    ContactMethod.WhatsApp,
  ],
  [TrackingLocation.FooterContactGrid]: [ContactMethod.Call],
  [TrackingLocation.CtaBar]: [
    ContactMethod.Call,
    ContactMethod.Telegram,
    ContactMethod.Viber,
    ContactMethod.WhatsApp,
  ],
  [TrackingLocation.CtaDock]: [
    ContactMethod.Call,
    ContactMethod.Telegram,
    ContactMethod.Viber,
    ContactMethod.WhatsApp,
  ],
  [TrackingLocation.ContactsNap]: [ContactMethod.Call, ContactMethod.Email],
  [TrackingLocation.ContactsCards]: ALL_CONTACT_METHODS,
  [TrackingLocation.PricesContactCard]: ALL_CONTACT_METHODS,
  [TrackingLocation.FooterLegal]: [ContactMethod.Email],
  [TrackingLocation.FooterSocial]: [
    ContactMethod.Facebook,
    ContactMethod.Telegram,
    ContactMethod.Viber,
    ContactMethod.WhatsApp,
  ],
  [TrackingLocation.ContactsCta]: [
    ContactMethod.Facebook,
    ContactMethod.Telegram,
    ContactMethod.Viber,
    ContactMethod.WhatsApp,
  ],
} as const satisfies Partial<
  Record<TrackingLocation, readonly ContactMethod[]>
>;

export const contentRules = {
  [ContentType.ContactQuickLink]: {
    locations: [TrackingLocation.ContactsQuickLinks],
    destination: "required",
  },
  [ContentType.GuideCard]: {
    locations: [TrackingLocation.HomeGuides, TrackingLocation.ServicesGuides],
    destination: "required",
  },
  [ContentType.MapLink]: {
    locations: [TrackingLocation.ContactsMap],
    destination: "forbidden",
  },
  [ContentType.RelatedLink]: {
    locations: [TrackingLocation.PageRelated],
    destination: "required",
  },
  [ContentType.ReviewLink]: {
    locations: [TrackingLocation.HomeReviews],
    destination: "forbidden",
  },
  [ContentType.SearchPhrase]: {
    locations: [TrackingLocation.PageSearchPhrases],
    destination: "required",
  },
  [ContentType.SectionCta]: {
    locations: [
      TrackingLocation.HomeServices,
      TrackingLocation.HomeServiceStandard,
    ],
    destination: "required",
  },
  [ContentType.ServiceCard]: {
    locations: [TrackingLocation.HomeServices],
    destination: "required",
  },
  [ContentType.ServiceFocusCard]: {
    locations: [
      TrackingLocation.ServicesFocus,
      TrackingLocation.PricesServiceFocus,
    ],
    destination: "required",
  },
} as const satisfies Record<
  ContentType,
  {
    locations: readonly TrackingLocation[];
    destination: "required" | "forbidden";
  }
>;
