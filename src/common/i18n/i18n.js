import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import all namespaced translations
import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enCategories from "./locales/en/categories.json";
import enAvailability from "./locales/en/availability.json";

import deCommon from "./locales/de/common.json";
import deAuth from "./locales/de/auth.json";
import deCategories from "./locales/de/categories.json";
import deAvailability from "./locales/de/availability.json";

import esCommon from "./locales/es/common.json";
import esAuth from "./locales/es/auth.json";
import esCategories from "./locales/es/categories.json";
import esAvailability from "./locales/es/availability.json";

import frCommon from "./locales/fr/common.json";
import frAuth from "./locales/fr/auth.json";
import frCategories from "./locales/fr/categories.json";
import frAvailability from "./locales/fr/availability.json";

import ruCommon from "./locales/ru/common.json";
import ruAuth from "./locales/ru/auth.json";
import ruCategories from "./locales/ru/categories.json";
import ruAvailability from "./locales/ru/availability.json";

import hiCommon from "./locales/hi/common.json";
import hiAuth from "./locales/hi/auth.json";
import hiCategories from "./locales/hi/categories.json";
import hiAvailability from "./locales/hi/availability.json";

import teCommon from "./locales/te/common.json";
import teAuth from "./locales/te/auth.json";
import teCategories from "./locales/te/categories.json";
import teAvailability from "./locales/te/availability.json";

import zhCommon from "./locales/zh/common.json";
import zhAuth from "./locales/zh/auth.json";
import zhCategories from "./locales/zh/categories.json";
import zhAvailability from "./locales/zh/availability.json";

import ptCommon from "./locales/pt/common.json";
import ptAuth from "./locales/pt/auth.json";
import ptCategories from "./locales/pt/categories.json";
import ptAvailability from "./locales/pt/availability.json";

import bnCommon from "./locales/bn/common.json";
import bnAuth from "./locales/bn/auth.json";
import bnCategories from "./locales/bn/categories.json";
import bnAvailability from "./locales/bn/availability.json";

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

import urCommon from "./locales/ur/common.json";
import urAuth from "./locales/ur/auth.json";
import urCategories from "./locales/ur/categories.json";

import viCommon from "./locales/vi/common.json";
import viAuth from "./locales/vi/auth.json";
import viCategories from "./locales/vi/categories.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    // Set default namespace to load
    defaultNS: "common",
    // Define all namespaces that will be used
    ns: ["common", "auth", "categories", "availability"],
    resources: {
      en: {
        common: enCommon,
        auth: enAuth,
        categories: enCategories,
        availability: enAvailability,
      },
      de: {
        common: deCommon,
        auth: deAuth,
        categories: deCategories,
        availability: deAvailability,
      },
      es: {
        common: esCommon,
        auth: esAuth,
        categories: esCategories,
        availability: esAvailability,
      },
      fr: {
        common: frCommon,
        auth: frAuth,
        categories: frCategories,
        availability: frAvailability,
      },
      ru: {
        common: ruCommon,
        auth: ruAuth,
        categories: ruCategories,
        availability: ruAvailability,
      },
      hi: {
        common: hiCommon,
        auth: hiAuth,
        categories: hiCategories,
        availability: hiAvailability,
      },
      te: {
        common: teCommon,
        auth: teAuth,
        categories: teCategories,
        availability: teAvailability,
      },
      zh: {
        common: zhCommon,
        auth: zhAuth,
        categories: zhCategories,
        availability: zhAvailability,
      },
      pt: {
        common: ptCommon,
        auth: ptAuth,
        categories: ptCategories,
        availability: ptAvailability,
      },
      bn: {
        common: bnCommon,
        auth: bnAuth,
        categories: bnCategories,
        availability: bnAvailability,
      },
      ar: {
        common: arCommon,
        auth: arAuth,
        categories: arCategories,
      },
      as: {
        common: asCommon,
        auth: asAuth,
        categories: asCategories,
      },
      doi: {
        common: doiCommon,
        auth: doiAuth,
        categories: doiCategories,
      },
      fil: {
        common: filCommon,
        auth: filAuth,
        categories: filCategories,
      },
      gu: {
        common: guCommon,
        auth: guAuth,
        categories: guCategories,
      },
      id: {
        common: idCommon,
        auth: idAuth,
        categories: idCategories,
      },
      ja: {
        common: jaCommon,
        auth: jaAuth,
        categories: jaCategories,
      },
      kn: {
        common: knCommon,
        auth: knAuth,
        categories: knCategories,
      },
      ko: {
        common: koCommon,
        auth: koAuth,
        categories: koCategories,
      },
      mai: {
        common: maiCommon,
        auth: maiAuth,
        categories: maiCategories,
      },
      ml: {
        common: mlCommon,
        auth: mlAuth,
        categories: mlCategories,
      },
      mr: {
        common: mrCommon,
        auth: mrAuth,
        categories: mrCategories,
      },
      ne: {
        common: neCommon,
        auth: neAuth,
        categories: neCategories,
      },
      or: {
        common: orCommon,
        auth: orAuth,
        categories: orCategories,
      },
      pa: {
        common: paCommon,
        auth: paAuth,
        categories: paCategories,
      },
      sa: {
        common: saCommon,
        auth: saAuth,
        categories: saCategories,
      },
      sd: {
        common: sdCommon,
        auth: sdAuth,
        categories: sdCategories,
      },
      ta: {
        common: taCommon,
        auth: taAuth,
        categories: taCategories,
      },
      th: {
        common: thCommon,
        auth: thAuth,
        categories: thCategories,
      },
      tl: {
        common: tlCommon,
        auth: tlAuth,
        categories: tlCategories,
      },
      ur: {
        common: urCommon,
        auth: urAuth,
        categories: urCategories,
      },
      vi: {
        common: viCommon,
        auth: viAuth,
        categories: viCategories,
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
