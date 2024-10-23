import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enT from "./locales/en/translation.json";
import deT from "./locales/de-DE/translation.json";
import esT from "./locales/es-ES/translation.json";
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';


i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources:{
      en: {translation: enT},
      de: {translation: deT},
      es: {translation: esT},
    },
    supportedLngs: ['en', 'de', 'es'],
    fallbackLng: 'en',
    debug: true,
    detection: {
      // This order defines where the language is detected from
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
    }
  });


export default i18n;