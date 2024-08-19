import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import en from './translations/en';
import de from './translations/de';

// Set the key-value pairs for the different languages you want to support.
const translations = {
    en,
    de,
};

// Initialize I18n with the translations
const i18n = new I18n(translations);

// Set the locale based on the device's locale
i18n.locale = getLocales()[0].languageCode ?? 'en';

// Enable fallback to another language if a translation is missing
i18n.enableFallback = true;

export default i18n;
