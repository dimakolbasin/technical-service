import {
  AnalyticsEventName,
  type AnalyticsEvent,
  ContactMethod,
  ContentType,
  FaqScope,
  ga,
  LocaleCode,
  PageType,
  TrackingLocation,
} from "../../src/lib/analytics";

const homeContext = {
  page_key: "home",
  page_type: PageType.Core,
  page_language: LocaleCode.Ru,
} as const;

const validContact = {
  name: AnalyticsEventName.ContactClick,
  params: {
    ...homeContext,
    contact_method: ContactMethod.Call,
    cta_location: TrackingLocation.HomeHero,
  },
} satisfies AnalyticsEvent;

const validContent = {
  name: AnalyticsEventName.SelectContent,
  params: {
    ...homeContext,
    content_type: ContentType.ServiceCard,
    cta_location: TrackingLocation.HomeServices,
    destination_key: "washing-machines",
  },
} satisfies AnalyticsEvent;

ga.contact(ContactMethod.Call, TrackingLocation.HomeHero);
ga.content(
  ContentType.ServiceCard,
  TrackingLocation.HomeServices,
  "washing-machines",
);
ga.content(ContentType.ReviewLink, TrackingLocation.HomeReviews);
ga.language(LocaleCode.Ru, LocaleCode.En, TrackingLocation.Header);
ga.faq(FaqScope.Home, 1);

// @ts-expect-error calls are not tracked from the reviews location
ga.contact(ContactMethod.Call, TrackingLocation.HomeReviews);
// @ts-expect-error service cards require a destination route
ga.content(ContentType.ServiceCard, TrackingLocation.HomeServices);
// @ts-expect-error review links must not contain a destination route
ga.content(ContentType.ReviewLink, TrackingLocation.HomeReviews, "home");
// @ts-expect-error a language switch must change the language
ga.language(LocaleCode.Ru, LocaleCode.Ru, TrackingLocation.Header);
// @ts-expect-error FAQ indexes must be positive integers
ga.faq(FaqScope.Home, 0);

const mixedEvent: AnalyticsEvent = {
  name: AnalyticsEventName.ContactClick,
  // @ts-expect-error contact events cannot contain content-selection fields
  params: {
    ...homeContext,
    contact_method: ContactMethod.Call,
    cta_location: TrackingLocation.HomeHero,
    content_type: ContentType.ServiceCard,
  },
};

const invalidContactLocation: AnalyticsEvent = {
  name: AnalyticsEventName.ContactClick,
  // @ts-expect-error calls are not tracked from the reviews location
  params: {
    ...homeContext,
    contact_method: ContactMethod.Call,
    cta_location: TrackingLocation.HomeReviews,
  },
};

const missingDestination: AnalyticsEvent = {
  name: AnalyticsEventName.SelectContent,
  // @ts-expect-error service cards require a destination route
  params: {
    ...homeContext,
    content_type: ContentType.ServiceCard,
    cta_location: TrackingLocation.HomeServices,
  },
};

const forbiddenDestination: AnalyticsEvent = {
  name: AnalyticsEventName.SelectContent,
  params: {
    ...homeContext,
    content_type: ContentType.ReviewLink,
    cta_location: TrackingLocation.HomeReviews,
    // @ts-expect-error review links must not contain a destination route
    destination_key: "home",
  },
};

const invalidPageType: AnalyticsEvent = {
  name: AnalyticsEventName.ContactClick,
  // @ts-expect-error the home route is a core page, not a service page
  params: {
    page_key: "home",
    page_type: PageType.Service,
    page_language: LocaleCode.Ru,
    contact_method: ContactMethod.Call,
    cta_location: TrackingLocation.HomeHero,
  },
};

void [
  validContact,
  validContent,
  mixedEvent,
  invalidContactLocation,
  missingDestination,
];
void [forbiddenDestination, invalidPageType];
