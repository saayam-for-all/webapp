import React from "react";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown } from "react-icons/io";

const FAQ = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-8 p-4 bg-gray-50 rounded">
      <h2 className="text-lg font-bold text-center mb-4 text-gray-800">
        {t("FAQ_TITLE")}
      </h2>
      <div className="max-w-2xl mx-auto">
        <details className="border-b border-gray-200 py-2 group">
          <summary className="text-sm font-medium text-gray-700 cursor-pointer flex items-center justify-between">
            {t("FAQ_TAX_QUESTION")}
            <IoIosArrowDown className="w-5 h-5 transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-2 text-xs text-gray-600 ml-4">
            {t("FAQ_TAX_ANSWER")}
          </p>
        </details>
        <details className="border-b border-gray-200 py-2 group">
          <summary className="text-sm font-medium text-gray-700 cursor-pointer flex items-center justify-between">
            {t("FAQ_USE_QUESTION")}
            <IoIosArrowDown className="w-5 h-5 transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-2 text-xs text-gray-600 ml-4">
            {t("FAQ_USE_ANSWER")}
          </p>
        </details>
        <details className="py-2 group">
          <summary className="text-sm font-medium text-gray-700 cursor-pointer flex items-center justify-between">
            {t("FAQ_CANCEL_QUESTION")}
            <IoIosArrowDown className="w-5 h-5 transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-2 text-xs text-gray-600 ml-4">
            {t("FAQ_CANCEL_ANSWER")}
          </p>
        </details>
      </div>
    </div>
  );
};

export default FAQ;
