require('dotenv').config();

const rawPhone = process.env.SITE_PHONE || "";
const cleanPhone = rawPhone.replace(/[^0-9+]/g, '');
const address = {
    street: process.env.SITE_ADDRESS_STREET,
    postalCode: process.env.SITE_ADDRESS_POSTAL,
    locality: process.env.SITE_ADDRESS_LOCALITY,
    region: process.env.SITE_ADDRESS_REGION,
    country: process.env.SITE_ADDRESS_COUNTRY
};

const googleMaps = process.env.SITE_GOOGLE_MAP;
const yandexMaps = process.env.SITE_YANDEX_MAP;
const priceRange = process.env.SITE_PRICE_RANGE;

module.exports = {
    name: process.env.SITE_NAME,
    phone: cleanPhone,
    email: process.env.SITE_EMAIL,
    baseUrl: process.env.SITE_BASE_URL,
    facebook: process.env.SITE_FACEBOOK,
    telegram: process.env.SITE_TELEGRAM,
    web3formsAccessKey: process.env.WEB3FORMS_ACCESS_KEY,
    address,
    googleMaps,
    yandexMaps,
    priceRange
};
