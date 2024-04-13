import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import arTranslation from './locales/ar.json';
import asTranslation from './locales/as.json';
import bnTranslation from './locales/bn.json';
import doiTranslation from './locales/doi.json';
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';
import filTranslation from './locales/fil.json';
import frTranslation from './locales/fr.json';
import guTranslation from './locales/gu.json';
import hiTranslation from './locales/hi.json';
import idTranslation from './locales/id.json';
import jaTranslation from './locales/ja.json';
import knTranslation from './locales/kn.json';
import koTranslation from './locales/ko.json';
import maiTranslation from './locales/mai.json';
import mlTranslation from './locales/ml.json';
import mrTranslation from './locales/mr.json';
import neTranslation from './locales/ne.json';
import orTranslation from './locales/or.json';
import paTranslation from './locales/pa.json';
import ptTranslation from './locales/pt.json';
import ruTranslation from './locales/ru.json';
import saTranslation from './locales/sa.json';
import sdTranslation from './locales/sd.json';
import taTranslation from './locales/ta.json';
import teTranslation from './locales/te.json';
import thTranslation from './locales/th.json';
import tlTranslation from './locales/tl.json';
import urTranslation from './locales/ur.json';
import viTranslation from './locales/vi.json';
import zhTranslation from './locales/zh.json';



i18n
   .use(initReactI18next)
   .init({
      lng: 'en',
      fallbackLng: 'en',
      resources: {
         ar: {
            translation: arTranslation,
         },
         as: {
            translation: asTranslation,
         },
         bn: {
            translation: bnTranslation,
         },
         doi: {
            translation: doiTranslation,
         },
         en: {
            translation: enTranslation,
         },
         es: {
            translation: esTranslation,
         },
         fil: {
            translation: filTranslation,
         },
         fr: {
            translation: frTranslation,
         },
         gu: {
            translation: guTranslation,
         },
         hi: {
            translation: hiTranslation,
         },
         id: {
            translation: idTranslation,
         },
         ja: {
            translation: jaTranslation,
         },
         kn: {
            translation: knTranslation,
         },
         ko: {
            translation: koTranslation,
         },
         mai: {
            translation: maiTranslation,
         },
         ml: {
            translation: mlTranslation,
         },
         mr: {
            translation: mrTranslation,
         },
         ne: {
            translation: neTranslation,
         },
         or: {
            translation: orTranslation,
         },
         pa: {
            translation: paTranslation,
         },
         pt: {
            translation: ptTranslation,
         },
         ru: {
            translation: ruTranslation,
         },
         sa: {
            translation: saTranslation,
         },
         sd: {
            translation: sdTranslation,
         },
         ta: {
            translation: taTranslation,
         },
         te: {
            translation: teTranslation,
         },
         th: {
            translation: thTranslation,
         },
         tl: {
            translation: tlTranslation,
         },
         ur: {
            translation: urTranslation,
         },
         vi: {
            translation: viTranslation,
         },
         zh: {
            translation: zhTranslation,
         },
      },
      interpolation: {
         escapeValue: false,
      },
   });

export default i18n;

