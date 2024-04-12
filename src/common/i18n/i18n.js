import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json'; // English translations
import esTranslation from './locales/es.json'; // Spanish translations
import frTranslation from './locales/fr.json'; // French translations
import zhTranslation from './locales/zh.json'; // Chinese translations
import jaTranslation from './locales/ja.json'; // Japanese translations
import hiTranslation from './locales/hi.json'; // Hindi translations
import teTranslation from './locales/te.json'; // Telugu translations

i18n
   .use(initReactI18next)
   .init({
      lng: 'en',
      fallbackLng: 'en',
      resources: {
         en: {
            translation: enTranslation,
         },
         es: {
            translation: esTranslation,
         },
         fr: {
            translation: frTranslation,
         },
         zh: {
            translation: zhTranslation,
         },
         ja: {
            translation: jaTranslation,
         },
         hi: {
            translation: hiTranslation,
         },
         te: {
            translation: teTranslation,
         }
      },
      interpolation: {
         escapeValue: false,
      },
   });

export default i18n;

