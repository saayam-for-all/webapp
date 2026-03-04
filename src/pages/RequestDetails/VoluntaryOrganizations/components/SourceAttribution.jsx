import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { FaRobot, FaClipboardList } from "react-icons/fa";

const SourceAttribution = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-8 text-center text-sm text-gray-600">
      <div className="flex items-center justify-center gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs">
            <FaRobot /> {t("AI_SUGGESTED")}
          </span>
          <span>= {t("RECOMMENDED_BY_AI")}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs">
            <FaClipboardList /> {t("REGISTERED")}
          </span>
          <span>= {t("REGISTERED_WITH_US")}</span>
        </div>
      </div>
    </div>
  );
};

SourceAttribution.propTypes = {};

export default SourceAttribution;
