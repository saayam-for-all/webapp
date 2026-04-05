import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// translation namespace (existing flat files)
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

// termsAndConditions namespace
import enTerms from "./locales/en/termsAndConditions.json";
import deTerms from "./locales/de/termsAndConditions.json";
import esTerms from "./locales/es/termsAndConditions.json";
import frTerms from "./locales/fr/termsAndConditions.json";
import ruTerms from "./locales/ru/termsAndConditions.json";

// privacyPolicy namespace
import enPrivacy from "./locales/en/privacyPolicy.json";

// messages namespace
import enMessages from "./locales/en/messages.json";
import bnMessages from "./locales/bn/messages.json";
import deMessages from "./locales/de/messages.json";
import esMessages from "./locales/es/messages.json";
import frMessages from "./locales/fr/messages.json";
import hiMessages from "./locales/hi/messages.json";
import ptMessages from "./locales/pt/messages.json";
import ruMessages from "./locales/ru/messages.json";
import teMessages from "./locales/te/messages.json";
import zhMessages from "./locales/zh/messages.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    ns: ["translation", "termsAndConditions", "privacyPolicy", "messages"],
    defaultNS: "translation",
    resources: {
      bn: { translation: bnTranslation, messages: bnMessages },
      de: {
        translation: deTranslation,
        termsAndConditions: deTerms,
        messages: deMessages,
      },
      en: {
        translation: enTranslation,
        termsAndConditions: enTerms,
        privacyPolicy: enPrivacy,
        messages: enMessages,
      },
      es: {
        translation: esTranslation,
        termsAndConditions: esTerms,
        messages: esMessages,
      },
      fr: {
        translation: frTranslation,
        termsAndConditions: frTerms,
        messages: frMessages,
      },
      hi: { translation: hiTranslation, messages: hiMessages },
      pt: { translation: ptTranslation, messages: ptMessages },
      ru: {
        translation: ruTranslation,
        termsAndConditions: ruTerms,
        messages: ruMessages,
      },
      te: { translation: teTranslation, messages: teMessages },
      zh: { translation: zhTranslation, messages: zhMessages },
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
