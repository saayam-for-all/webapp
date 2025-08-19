import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import existing translation files (for backward compatibility)
import arTranslation from "./locales/ar_SA.json";
import asTranslation from "./locales/as_IN.json";
import bnTranslation from "./locales/bn_BD.json";
import deTranslation from "./locales/de_DE.json";
import doiTranslation from "./locales/doi_IN.json";
import enTranslation from "./locales/en_US.json";
import esTranslation from "./locales/es_ES.json";
import filTranslation from "./locales/fil_PH.json";
import frTranslation from "./locales/fr_FR.json";
import guTranslation from "./locales/gu_IN.json";
import hiTranslation from "./locales/hi_IN.json";
import idTranslation from "./locales/id_ID.json";
import jaTranslation from "./locales/ja_JP.json";
import knTranslation from "./locales/kn_IN.json";
import koTranslation from "./locales/ko_KR.json";
import maiTranslation from "./locales/mai_IN.json";
import mlTranslation from "./locales/ml_IN.json";
import mrTranslation from "./locales/mr_IN.json";
import neTranslation from "./locales/ne_NP.json";
import orTranslation from "./locales/or_IN.json";
import paTranslation from "./locales/pa_IN.json";
import ptTranslation from "./locales/pt_PT.json";
import ruTranslation from "./locales/ru_RU.json";
import saTranslation from "./locales/sa_IN.json";
import sdTranslation from "./locales/sd_IN.json";
import taTranslation from "./locales/ta_IN.json";
import teTranslation from "./locales/te_IN.json";
import thTranslation from "./locales/th_TH.json";
import tlTranslation from "./locales/tl_PH.json";
import zhTranslation from "./locales/zh_CN.json";

// Import new namespaced translations under locales/ (as Rashmi requested)
import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enCategories from "./locales/en/categories.json";

import deCommon from "./locales/de/common.json";
import deAuth from "./locales/de/auth.json";
import deCategories from "./locales/de/categories.json";

import esCommon from "./locales/es/common.json";
import esAuth from "./locales/es/auth.json";
import esCategories from "./locales/es/categories.json";

import frCommon from "./locales/fr/common.json";
import frAuth from "./locales/fr/auth.json";
import frCategories from "./locales/fr/categories.json";

import ruCommon from "./locales/ru/common.json";
import ruAuth from "./locales/ru/auth.json";
import ruCategories from "./locales/ru/categories.json";

import hiCommon from "./locales/hi/common.json";
import hiAuth from "./locales/hi/auth.json";
import hiCategories from "./locales/hi/categories.json";

import teCommon from "./locales/te/common.json";
import teAuth from "./locales/te/auth.json";
import teCategories from "./locales/te/categories.json";

import zhCommon from "./locales/zh/common.json";
import zhAuth from "./locales/zh/auth.json";
import zhCategories from "./locales/zh/categories.json";

import ptCommon from "./locales/pt/common.json";
import ptAuth from "./locales/pt/auth.json";
import ptCategories from "./locales/pt/categories.json";

import bnCommon from "./locales/bn/common.json";
import bnAuth from "./locales/bn/auth.json";
import bnCategories from "./locales/bn/categories.json";

import arCommon from "./locales/ar/common.json";
import arAuth from "./locales/ar/auth.json";
import arCategories from "./locales/ar/categories.json";

import asCommon from "./locales/as/common.json";
import asAuth from "./locales/as/auth.json";
import asCategories from "./locales/as/categories.json";

import doiCommon from "./locales/doi/common.json";
import doiAuth from "./locales/doi/auth.json";
import doiCategories from "./locales/doi/categories.json";

import filCommon from "./locales/fil/common.json";
import filAuth from "./locales/fil/auth.json";
import filCategories from "./locales/fil/categories.json";

import guCommon from "./locales/gu/common.json";
import guAuth from "./locales/gu/auth.json";
import guCategories from "./locales/gu/categories.json";

import idCommon from "./locales/id/common.json";
import idAuth from "./locales/id/auth.json";
import idCategories from "./locales/id/categories.json";

import jaCommon from "./locales/ja/common.json";
import jaAuth from "./locales/ja/auth.json";
import jaCategories from "./locales/ja/categories.json";

import knCommon from "./locales/kn/common.json";
import knAuth from "./locales/kn/auth.json";
import knCategories from "./locales/kn/categories.json";

import koCommon from "./locales/ko/common.json";
import koAuth from "./locales/ko/auth.json";
import koCategories from "./locales/ko/categories.json";

import maiCommon from "./locales/mai/common.json";
import maiAuth from "./locales/mai/auth.json";
import maiCategories from "./locales/mai/categories.json";

import mlCommon from "./locales/ml/common.json";
import mlAuth from "./locales/ml/auth.json";
import mlCategories from "./locales/ml/categories.json";

import mrCommon from "./locales/mr/common.json";
import mrAuth from "./locales/mr/auth.json";
import mrCategories from "./locales/mr/categories.json";

import neCommon from "./locales/ne/common.json";
import neAuth from "./locales/ne/auth.json";
import neCategories from "./locales/ne/categories.json";

import orCommon from "./locales/or/common.json";
import orAuth from "./locales/or/auth.json";
import orCategories from "./locales/or/categories.json";

import paCommon from "./locales/pa/common.json";
import paAuth from "./locales/pa/auth.json";
import paCategories from "./locales/pa/categories.json";

import saCommon from "./locales/sa/common.json";
import saAuth from "./locales/sa/auth.json";
import saCategories from "./locales/sa/categories.json";

import sdCommon from "./locales/sd/common.json";
import sdAuth from "./locales/sd/auth.json";
import sdCategories from "./locales/sd/categories.json";

import taCommon from "./locales/ta/common.json";
import taAuth from "./locales/ta/auth.json";
import taCategories from "./locales/ta/categories.json";

import thCommon from "./locales/th/common.json";
import thAuth from "./locales/th/auth.json";
import thCategories from "./locales/th/categories.json";

import tlCommon from "./locales/tl/common.json";
import tlAuth from "./locales/tl/auth.json";
import tlCategories from "./locales/tl/categories.json";

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
      ar: {
        translation: arTranslation,
        common: arCommon,
        auth: arAuth,
        categories: arCategories,
      },
      as: {
        translation: asTranslation,
        common: asCommon,
        auth: asAuth,
        categories: asCategories,
      },
      bn: {
        translation: bnTranslation,
        common: bnCommon,
        auth: bnAuth,
        categories: bnCategories,
      },
      de: {
        translation: deTranslation,
        common: deCommon,
        auth: deAuth,
        categories: deCategories,
      },
      doi: {
        translation: doiTranslation,
        common: doiCommon,
        auth: doiAuth,
        categories: doiCategories,
      },
      en: {
        translation: enTranslation,
        common: enCommon,
        auth: enAuth,
        categories: enCategories,
      },
      es: {
        translation: esTranslation,
        common: esCommon,
        auth: esAuth,
        categories: esCategories,
      },
      fil: {
        translation: filTranslation,
        common: filCommon,
        auth: filAuth,
        categories: filCategories,
      },
      fr: {
        translation: frTranslation,
        common: frCommon,
        auth: frAuth,
        categories: frCategories,
      },
      gu: {
        translation: guTranslation,
        common: guCommon,
        auth: guAuth,
        categories: guCategories,
      },
      hi: {
        translation: hiTranslation,
        common: hiCommon,
        auth: hiAuth,
        categories: hiCategories,
      },
      id: {
        translation: idTranslation,
        common: idCommon,
        auth: idAuth,
        categories: idCategories,
      },
      ja: {
        translation: jaTranslation,
        common: jaCommon,
        auth: jaAuth,
        categories: jaCategories,
      },
      kn: {
        translation: knTranslation,
        common: knCommon,
        auth: knAuth,
        categories: knCategories,
      },
      ko: {
        translation: koTranslation,
        common: koCommon,
        auth: koAuth,
        categories: koCategories,
      },
      mai: {
        translation: maiTranslation,
        common: maiCommon,
        auth: maiAuth,
        categories: maiCategories,
      },
      ml: {
        translation: mlTranslation,
        common: mlCommon,
        auth: mlAuth,
        categories: mlCategories,
      },
      mr: {
        translation: mrTranslation,
        common: mrCommon,
        auth: mrAuth,
        categories: mrCategories,
      },
      ne: {
        translation: neTranslation,
        common: neCommon,
        auth: neAuth,
        categories: neCategories,
      },
      or: {
        translation: orTranslation,
        common: orCommon,
        auth: orAuth,
        categories: orCategories,
      },
      pa: {
        translation: paTranslation,
        common: paCommon,
        auth: paAuth,
        categories: paCategories,
      },
      pt: {
        translation: ptTranslation,
        common: ptCommon,
        auth: ptAuth,
        categories: ptCategories,
      },
      ru: {
        translation: ruTranslation,
        common: ruCommon,
        auth: ruAuth,
        categories: ruCategories,
      },
      sa: {
        translation: saTranslation,
        common: saCommon,
        auth: saAuth,
        categories: saCategories,
      },
      sd: {
        translation: sdTranslation,
        common: sdCommon,
        auth: sdAuth,
        categories: sdCategories,
      },
      ta: {
        translation: taTranslation,
        common: taCommon,
        auth: taAuth,
        categories: taCategories,
      },
      te: {
        translation: teTranslation,
        common: teCommon,
        auth: teAuth,
        categories: teCategories,
      },
      th: {
        translation: thTranslation,
        common: thCommon,
        auth: thAuth,
        categories: thCategories,
      },
      tl: {
        translation: tlTranslation,
        common: tlCommon,
        auth: tlAuth,
        categories: tlCategories,
      },
      zh: {
        translation: zhTranslation,
        common: zhCommon,
        auth: zhAuth,
        categories: zhCategories,
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
