import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { FaRobot, FaClipboardList } from "react-icons/fa";
import { getSourceType } from "../utils/organizationHelpers";

const SourceBadge = ({ dbOrAi }) => {
  const { t } = useTranslation();
  const isAI = getSourceType(dbOrAi) === "ai";

  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
        isAI
          ? "bg-purple-100 text-purple-700"
          : "bg-emerald-100 text-emerald-700"
      }`}
    >
      {isAI ? (
        <>
          <FaRobot className="text-xs" />
          <span>{t("AI_SUGGESTED")}</span>
        </>
      ) : (
        <>
          <FaClipboardList className="text-xs" />
          <span>{t("REGISTERED")}</span>
        </>
      )}
    </div>
  );
};

SourceBadge.propTypes = {
  dbOrAi: PropTypes.string,
};

export default SourceBadge;
