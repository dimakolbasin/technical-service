import type { Locale, RouteKey } from "../content";
import {
  AnalyticsEventName,
  ContactMethod,
  ContentType,
  FaqScope,
  PageType,
  TrackingLocation,
} from "./enums";
import { contactRules, contentRules, pageTypeByRoute } from "./rules";

export type PageContext = {
  [Key in RouteKey]: {
    page_key: Key;
    page_type: (typeof pageTypeByRoute)[Key];
    page_language: Locale;
  };
}[RouteKey];

type ContactRule = {
  [Location in keyof typeof contactRules]: {
    contact_method: (typeof contactRules)[Location][number];
    cta_location: Location;
  };
}[keyof typeof contactRules];
export type ContactLocation = ContactRule["cta_location"];

type ContentRule = {
  [Type in keyof typeof contentRules]: {
    content_type: Type;
    cta_location: (typeof contentRules)[Type]["locations"][number];
  } & ((typeof contentRules)[Type]["destination"] extends "required"
    ? { destination_key: RouteKey }
    : { destination_key?: never });
}[keyof typeof contentRules];
export type ContentLocation = ContentRule["cta_location"];

declare const positiveIntegerBrand: unique symbol;
export type PositiveInteger = number & {
  readonly [positiveIntegerBrand]: true;
};

type ContactClickParams = PageContext & ContactRule;
type SelectContentParams = PageContext & ContentRule;
type LanguageSwitchParams = {
  from_language: Locale;
  to_language: Locale;
  cta_location: TrackingLocation.Header | TrackingLocation.Footer;
  page_key: RouteKey;
};
type RouteKeyByType<Type extends PageType> = {
  [Key in RouteKey]: (typeof pageTypeByRoute)[Key] extends Type ? Key : never;
}[RouteKey];
export type FaqPageKey =
  "home" | RouteKeyByType<PageType.Service | PageType.Article>;
type FaqOpenParams =
  | {
      page_key: "home";
      page_language: Locale;
      faq_scope: FaqScope.Home;
      faq_index: PositiveInteger;
    }
  | {
      page_key: RouteKeyByType<PageType.Service | PageType.Article>;
      page_language: Locale;
      faq_scope: FaqScope.Page;
      faq_index: PositiveInteger;
    };

type ParamsByEvent = {
  [AnalyticsEventName.ContactClick]: ContactClickParams;
  [AnalyticsEventName.SelectContent]: SelectContentParams;
  [AnalyticsEventName.LanguageSwitch]: LanguageSwitchParams;
  [AnalyticsEventName.FaqOpen]: FaqOpenParams;
};

type UnionKeys<Value> = Value extends Value ? keyof Value : never;
type AllParams = ParamsByEvent[AnalyticsEventName];
type StrictParams<Value> = Value &
  Partial<Record<Exclude<UnionKeys<AllParams>, keyof Value>, never>>;

export type AnalyticsEventFor<Name extends AnalyticsEventName> =
  Name extends AnalyticsEventName
    ? { name: Name; params: StrictParams<ParamsByEvent[Name]> }
    : never;

export type AnalyticsEvent = AnalyticsEventFor<AnalyticsEventName>;

export type AnalyticsPayload<Name extends AnalyticsEventName> = StrictParams<
  ParamsByEvent[Name]
> & {
  transport_type: "beacon";
};

type GtagPayloadByEvent = {
  [AnalyticsEventName.ContactClick]: PageContext & {
    contact_method: ContactMethod;
    cta_location: ContactLocation;
  };
  [AnalyticsEventName.SelectContent]: PageContext & {
    content_type: ContentType;
    cta_location: ContentLocation;
    destination_key?: RouteKey;
  };
  [AnalyticsEventName.LanguageSwitch]: LanguageSwitchParams;
  [AnalyticsEventName.FaqOpen]: {
    page_key: FaqPageKey;
    page_language: Locale;
    faq_scope: FaqScope;
    faq_index: PositiveInteger;
  };
};

export type Gtag = <Name extends AnalyticsEventName>(
  command: "event",
  name: Name,
  payload: GtagPayloadByEvent[Name] & { transport_type: "beacon" },
) => void;
