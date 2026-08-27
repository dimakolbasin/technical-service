import type { Locale, RouteKey } from "../content";
import {
  ContactMethod,
  ContentType,
  FaqScope,
  TrackingLocation,
} from "./enums";
import { contactRules, contentRules, pageTypeByRoute } from "./rules";

type ContactAttributes = {
  "data-ga-contact-method": ContactMethod;
  "data-ga-location": TrackingLocation;
};

type ContentAttributes = {
  "data-ga-content-type": ContentType;
  "data-ga-location": TrackingLocation;
  "data-ga-destination-key"?: RouteKey;
};

type LanguageAttributes = {
  "data-lang": Locale;
  "data-ga-language-switch": TrackingLocation.Header | TrackingLocation.Footer;
};

type FaqAttributes = {
  "data-ga-faq-scope": FaqScope;
  "data-ga-faq-index": number;
};

type ContentArgs<Type extends ContentType> =
  (typeof contentRules)[Type]["destination"] extends "required"
    ? [
        type: Type,
        location: (typeof contentRules)[Type]["locations"][number],
        destination: RouteKey,
      ]
    : [type: Type, location: (typeof contentRules)[Type]["locations"][number]];

function contact<Location extends keyof typeof contactRules>(
  method: (typeof contactRules)[Location][number],
  location: Location,
): ContactAttributes {
  if (!(contactRules[location] as readonly ContactMethod[]).includes(method)) {
    throw new Error(
      `Invalid analytics contact combination: ${method} @ ${location}`,
    );
  }

  return {
    "data-ga-contact-method": method,
    "data-ga-location": location,
  };
}

function content<Type extends ContentType>(
  ...[type, location, destination]: ContentArgs<Type>
): ContentAttributes {
  const rule = contentRules[type];

  if (!(rule.locations as readonly TrackingLocation[]).includes(location)) {
    throw new Error(
      `Invalid analytics content combination: ${type} @ ${location}`,
    );
  }

  if ((rule.destination === "required") !== Boolean(destination)) {
    throw new Error(
      `Invalid analytics destination for ${type}: ${destination ?? "missing"}`,
    );
  }

  if (destination && !(destination in pageTypeByRoute)) {
    throw new Error(`Unknown analytics destination: ${destination}`);
  }

  return {
    "data-ga-content-type": type,
    "data-ga-location": location,
    ...(destination ? { "data-ga-destination-key": destination } : {}),
  };
}

function language<From extends Locale, To extends Locale>(
  from: From,
  to: To &
    ([Locale] extends [From] ? unknown : To extends From ? never : unknown),
  location: TrackingLocation.Header | TrackingLocation.Footer,
): LanguageAttributes {
  if (from === (to as Locale)) {
    throw new Error(`Analytics language switch must change language: ${from}`);
  }

  return {
    "data-lang": to,
    "data-ga-language-switch": location,
  };
}

type PositiveIndex<Index extends number> = number extends Index
  ? Index
  : `${Index}` extends `-${string}` | "0" | `${string}.${string}`
    ? never
    : Index;

function faq<Index extends number>(
  scope: FaqScope,
  index: PositiveIndex<Index>,
): FaqAttributes {
  if (!Number.isInteger(index) || index <= 0) {
    throw new Error(`Analytics FAQ index must be a positive integer: ${index}`);
  }

  return {
    "data-ga-faq-scope": scope,
    "data-ga-faq-index": index,
  };
}

export const ga = { contact, content, language, faq };
