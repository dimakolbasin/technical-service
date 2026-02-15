require('dotenv').config();

const rawPhone = process.env.SITE_PHONE || "";
// Убираем всё, кроме цифр и плюса. Используем этот формат и для ссылок, и для отображения.
const cleanPhone = rawPhone.replace(/[^0-9+]/g, '');
const address = {
    street: process.env.SITE_ADDRESS_STREET || "Шериф Химшиашвили 57",
    postalCode: process.env.SITE_ADDRESS_POSTAL || "6000",
    locality: process.env.SITE_ADDRESS_LOCALITY || "Batumi",
    region: process.env.SITE_ADDRESS_REGION || "Adjara",
    country: process.env.SITE_ADDRESS_COUNTRY || "GE"
};
const googleMaps = process.env.SITE_GOOGLE_MAP || "https://maps.app.goo.gl/WdTtsJLnKg9YSYaXA";
const yandexMaps = process.env.SITE_YANDEX_MAP || "https://yandex.com.ge/maps/-/CPUbbX7-";
const priceRange = process.env.SITE_PRICE_RANGE || "GEL 20+";

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
