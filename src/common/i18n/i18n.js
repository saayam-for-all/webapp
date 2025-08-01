import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

//import arTranslation from './locales/ar_SA.json';
//import asTranslation from './locales/as_IN.json';
import bnTranslation from "./locales/bn_BD.json";
//import doiTranslation from './locales/doi_IN.json';
import deTranslation from "./locales/de_DE.json";
import enTranslation from "./locales/en_US.json";
import esTranslation from "./locales/es_ES.json";
//import filTranslation from './locales/fil_PH.json';
import frTranslation from "./locales/fr_FR.json";
//import guTranslation from './locales/gu_IN.json';
import hiTranslation from "./locales/hi_IN.json";
//import idTranslation from './locales/id_ID.json';
//import jaTranslation from './locales/ja_JP.json';
//import knTranslation from './locales/kn_IN.json';
//import koTranslation from './locales/ko_KR.json';
//import maiTranslation from './locales/mai_IN.json';
//import mlTranslation from './locales/ml_IN.json';
//import mrTranslation from './locales/mr_IN.json';
//import neTranslation from './locales/ne_NP.json';
//import orTranslation from './locales/or_IN.json';
//import paTranslation from './locales/pa_IN.json';
import ptTranslation from "./locales/pt_PT.json";
import ruTranslation from "./locales/ru_RU.json";
//import saTranslation from './locales/sa_IN.json';
//import sdTranslation from './locales/sd_IN.json';
//import taTranslation from './locales/ta_IN.json';
import teTranslation from "./locales/te_IN.json";
//import thTranslation from './locales/th_TH.json';
//import tlTranslation from './locales/tl_PH.json';
//import urTranslation from './locales/ur_PK.json';
//import viTranslation from './locales/vi_VN.json';
import zhTranslation from "./locales/zh_CN.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: {
      bn: { translation: bnTranslation },
      de: { translation: deTranslation },
      en: { translation: enTranslation },
      es: { translation: esTranslation },
      fr: { translation: frTranslation },
      hi: { translation: hiTranslation },
      pt: { translation: ptTranslation },
      ru: { translation: ruTranslation },
      te: { translation: teTranslation },
      zh: { translation: zhTranslation },
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
