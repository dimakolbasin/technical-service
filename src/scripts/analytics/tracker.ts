import {
  AnalyticsEventName,
  type ContactMethod,
  type ContentType,
  type FaqScope,
  type TrackingLocation,
} from "../../lib/analytics/enums";
import type {
  ContactLocation,
  ContentLocation,
  FaqPageKey,
  Gtag,
  PageContext,
  PositiveInteger,
} from "../../lib/analytics/types";
import type { Locale, RouteKey } from "../../lib/content";

export function createAnalyticsTracker(gtag: Gtag, page: PageContext) {
  // Dataset values are emitted only by the build-time ga factories.
  function contact(dataset: DOMStringMap): void {
    gtag("event", AnalyticsEventName.ContactClick, {
      ...page,
      contact_method: dataset.gaContactMethod as ContactMethod,
      cta_location: dataset.gaLocation as ContactLocation,
      transport_type: "beacon",
    });
  }

  function content(dataset: DOMStringMap): void {
    const destination = dataset.gaDestinationKey as RouteKey | undefined;

    gtag("event", AnalyticsEventName.SelectContent, {
      ...page,
      content_type: dataset.gaContentType as ContentType,
      cta_location: dataset.gaLocation as ContentLocation,
      ...(destination ? { destination_key: destination } : {}),
      transport_type: "beacon",
    });
  }

  function language(dataset: DOMStringMap): void {
    gtag("event", AnalyticsEventName.LanguageSwitch, {
      from_language: page.page_language,
      to_language: dataset.lang as Locale,
      cta_location: dataset.gaLanguageSwitch as
        TrackingLocation.Header | TrackingLocation.Footer,
      page_key: page.page_key,
      transport_type: "beacon",
    });
  }

  function faq(dataset: DOMStringMap): void {
    gtag("event", AnalyticsEventName.FaqOpen, {
      page_key: page.page_key as FaqPageKey,
      page_language: page.page_language,
      faq_scope: dataset.gaFaqScope as FaqScope,
      faq_index: Number(dataset.gaFaqIndex) as PositiveInteger,
      transport_type: "beacon",
    });
  }

  return { contact, content, language, faq };
}
