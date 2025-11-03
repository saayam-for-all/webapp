import React from "react";
import { useTranslation } from "react-i18next"; // <-- correct import

function InfoCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 sm:p-6 dark:bg-slate-900 dark:border-slate-700">
      <h2 className="text-base font-medium mb-3">{title}</h2>
      <div className="text-sm text-slate-600 dark:text-slate-300 leading-6 space-y-3">
        {children}
      </div>
    </section>
  );
}

export default function MoreInformationPage() {
  const { t } = useTranslation(); // standard react-i18next hook

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("moreInfo.title")}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("moreInfo.subtitle")}
        </p>
      </header>

      <InfoCard title={t("moreInfo.sections.gettingStarted.title")}>
        <p>{t("moreInfo.sections.gettingStarted.body1")}</p>
        <a
          href="https://example.com"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          {t("moreInfo.sections.gettingStarted.link")}
        </a>
      </InfoCard>

      <InfoCard title={t("moreInfo.sections.faq.title")}>
        <p>{t("moreInfo.sections.faq.body1")}</p>
      </InfoCard>
    </div>
  );
}
