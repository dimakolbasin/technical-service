import type { SiteConfig } from "./types";
import {
  GA4_MEASUREMENT_ID,
  SITE_ADDRESS_COUNTRY,
  SITE_ADDRESS_LOCALITY,
  SITE_ADDRESS_POSTAL,
  SITE_ADDRESS_REGION,
  SITE_ADDRESS_STREET,
  SITE_BASE_URL,
  SITE_COMPLETED_REPAIRS,
  SITE_EMAIL,
  SITE_FACEBOOK,
  SITE_GOOGLE_BUSINESS_PROFILE,
  SITE_GOOGLE_MAP,
  SITE_GOOGLE_MAP_EMBED,
  SITE_NAME,
  SITE_PHONE,
  SITE_PRICE_RANGE,
  SITE_REVIEW_SOURCE_URL,
  SITE_TELEGRAM,
  SITE_YANDEX_MAP,
  SITE_YEARS_IN_BUSINESS,
  WEB3FORMS_ACCESS_KEY,
  PHONE_SANITIZE_PATTERN,
  DIGITS_ONLY_PATTERN,
  GEORGIAN_PHONE_FORMAT,
} from "./constants";

const phone = SITE_PHONE.replace(PHONE_SANITIZE_PATTERN, "");

export const site: SiteConfig = {
  name: SITE_NAME,
  phone,
  email: SITE_EMAIL,
  baseUrl: SITE_BASE_URL,
  facebook: SITE_FACEBOOK,
  telegram: SITE_TELEGRAM,
  viber: `viber://chat?number=${encodeURIComponent(phone)}`,
  web3formsAccessKey: WEB3FORMS_ACCESS_KEY,
  address: {
    street: SITE_ADDRESS_STREET,
    postalCode: SITE_ADDRESS_POSTAL,
    locality: SITE_ADDRESS_LOCALITY,
    region: SITE_ADDRESS_REGION,
    country: SITE_ADDRESS_COUNTRY,
  },
  googleMaps: SITE_GOOGLE_MAP,
  googleMapsEmbed: SITE_GOOGLE_MAP_EMBED,
  googleBusinessProfile: SITE_GOOGLE_BUSINESS_PROFILE,
  yandexMap: SITE_YANDEX_MAP,
  priceRange: SITE_PRICE_RANGE,
  trustFacts: {
    yearsInBusiness: SITE_YEARS_IN_BUSINESS,
    completedRepairs: SITE_COMPLETED_REPAIRS,
    reviewSource: SITE_REVIEW_SOURCE_URL,
  },
  gaMeasurementId: GA4_MEASUREMENT_ID,
};

export const whatsappNumber = site.phone.replace(DIGITS_ONLY_PATTERN, "");

export function formatGeorgianPhone(rawPhone: string): string {
  return rawPhone
    .replace(DIGITS_ONLY_PATTERN, "")
    .replace(GEORGIAN_PHONE_FORMAT, "$1 $2 $3 $4");
}

export type { SiteConfig } from "./types";
