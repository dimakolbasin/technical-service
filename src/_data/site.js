require('dotenv').config();

const rawPhone = process.env.SITE_PHONE || "";
// Убираем всё, кроме цифр и плюса. Используем этот формат и для ссылок, и для отображения.
const cleanPhone = rawPhone.replace(/[^0-9+]/g, '');

module.exports = {
    name: process.env.SITE_NAME,
    phone: cleanPhone,
    email: process.env.SITE_EMAIL,
    baseUrl: process.env.SITE_BASE_URL,
    facebook: process.env.SITE_FACEBOOK,
    telegram: process.env.SITE_TELEGRAM
};
