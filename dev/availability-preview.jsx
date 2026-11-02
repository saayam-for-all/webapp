// Isolated local preview. The production entry point never imports this file.
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Availability from "../src/pages/Profile/Availability";
import api from "../src/services/api";
import availability from "../src/common/i18n/locales/en/availability.json";
import "../src/index.css";

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      availability,
      translation: { EDIT: "Edit", SAVE: "Save", CANCEL: "Cancel" },
    },
  },
  interpolation: { escapeValue: false },
});
const store = configureStore({
  reducer: { auth: () => ({ user: { userDbId: "local-preview-only" } }) },
});
api.interceptors.request.clear();
api.interceptors.response.clear();
api.defaults.adapter = async (config) => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (!config.url.endsWith("/availability"))
    throw new Error("Preview blocks external API calls");
  const key = "saayam-local-availability-preview-214";
  let data = JSON.parse(sessionStorage.getItem(key) || "null") || {
    userId: "local-preview-only",
    timezone: "UTC",
    slots: [],
    lastUpdatedAt: null,
  };
  if (config.method === "put") {
    data = {
      userId: "local-preview-only",
      timezone: JSON.parse(config.data).timezone,
      slots: JSON.parse(config.data).slots.map((slot, index) => ({
        ...slot,
        id: index + 1,
      })),
      lastUpdatedAt: new Date().toISOString(),
    };
    sessionStorage.setItem(key, JSON.stringify(data));
  }
  return {
    data: { success: true, data },
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  };
};
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <main className="max-w-4xl mx-auto p-4 sm:p-8">
      <p className="text-sm text-gray-600 mb-2">Local fixture data</p>
      <h1 className="text-2xl font-semibold mb-6">Profile Availability</h1>
      <Availability setHasUnsavedChanges={() => {}} />
    </main>
  </Provider>,
);
