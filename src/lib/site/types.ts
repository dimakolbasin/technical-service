export interface SiteConfig {
  name: string;
  phone: string;
  email: string;
  baseUrl: string;
  facebook: string;
  telegram: string;
  viber: string;
  web3formsAccessKey: string;
  address: {
    street: string;
    postalCode: string;
    locality: string;
    region: string;
    country: string;
  };
  googleMaps: string;
  googleMapsEmbed: string;
  googleBusinessProfile: string;
  yandexMap: string;
  priceRange: string;
  trustFacts: {
    yearsInBusiness: string;
    completedRepairs: string;
    reviewSource: string;
  };
  gaMeasurementId: string;
}
