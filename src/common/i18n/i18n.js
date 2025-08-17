import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import existing translation files (for backward compatibility)
import bnTranslation from "./locales/bn_BD.json";
import deTranslation from "./locales/de_DE.json";
import enTranslation from "./locales/en_US.json";
import esTranslation from "./locales/es_ES.json";
import frTranslation from "./locales/fr_FR.json";
import hiTranslation from "./locales/hi_IN.json";
import ptTranslation from "./locales/pt_PT.json";
import ruTranslation from "./locales/ru_RU.json";
import teTranslation from "./locales/te_IN.json";
import zhTranslation from "./locales/zh_CN.json";

// Import new namespaced translations
import enCommon from "./namespaces/en/common.json";
import enAuth from "./namespaces/en/auth.json";
import enCategories from "./namespaces/en/categories.json";

import deCommon from "./namespaces/de/common.json";
import deAuth from "./namespaces/de/auth.json";
import deCategories from "./namespaces/de/categories.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    // Set default namespace to load
    defaultNS: "common",
    // Define all namespaces that will be used
    ns: ["common", "auth", "categories"],
    resources: {
      bn: {
        translation: bnTranslation,
      },
      de: {
        translation: deTranslation,
        common: deCommon,
        auth: deAuth,
        categories: deCategories,
      },
      en: {
        translation: enTranslation,
        common: enCommon,
        auth: enAuth,
        categories: enCategories,
      },
      es: {
        translation: esTranslation,
      },
      fr: {
        translation: frTranslation,
      },
      hi: {
        translation: hiTranslation,
      },
      pt: {
        translation: ptTranslation,
      },
      ru: {
        translation: ruTranslation,
      },
      te: {
        translation: teTranslation,
      },
      zh: {
        translation: zhTranslation,
      },
    },
    detection: {
      order: [
        "localStorage",
        "navigator",
        "htmlTag",
        "cookie",
        "path",
        "subdomain",
      ],
      caches: ["localStorage", "cookie"],
    },
    debug: true,
  });

export default i18n;
