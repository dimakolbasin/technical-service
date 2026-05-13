require('dotenv').config();

const rawPhone = process.env.SITE_PHONE || "";
const cleanPhone = rawPhone.replace(/[^0-9+]/g, '');
const viber = process.env.SITE_VIBER || (cleanPhone ? `viber://chat?number=${encodeURIComponent(cleanPhone)}` : "");
const address = {
    street: process.env.SITE_ADDRESS_STREET,
    postalCode: process.env.SITE_ADDRESS_POSTAL,
    locality: process.env.SITE_ADDRESS_LOCALITY,
    region: process.env.SITE_ADDRESS_REGION,
    country: process.env.SITE_ADDRESS_COUNTRY
};

const googleMaps = process.env.SITE_GOOGLE_MAP;
const googleMapsEmbed = process.env.SITE_GOOGLE_MAP_EMBED;
const googleBusinessProfile = process.env.SITE_GOOGLE_BUSINESS_PROFILE;
const priceRange = process.env.SITE_PRICE_RANGE;
const gaMeasurementId = process.env.GA4_MEASUREMENT_ID || "";
const trustFacts = {
    yearsInBusiness: process.env.SITE_YEARS_IN_BUSINESS,
    completedRepairs: process.env.SITE_COMPLETED_REPAIRS,
    reviewSource: process.env.SITE_REVIEW_SOURCE_URL
};

module.exports = {
    name: process.env.SITE_NAME,
    phone: cleanPhone,
    email: process.env.SITE_EMAIL,
    baseUrl: process.env.SITE_BASE_URL,
    facebook: process.env.SITE_FACEBOOK,
    telegram: process.env.SITE_TELEGRAM,
    viber,
    web3formsAccessKey: process.env.WEB3FORMS_ACCESS_KEY,
    address,
    googleMaps,
    googleMapsEmbed,
    googleBusinessProfile,
    priceRange,
    trustFacts,
    gaMeasurementId
};
