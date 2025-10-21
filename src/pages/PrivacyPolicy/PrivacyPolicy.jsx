import i18n from "i18next";
import enPrivacy from "../../common/i18n/locales/en/privacy.json";
import React from "react";
import "./PrivacyPolicy.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
// Ensure 'privacy' namespace is registered (temporary fix if global i18n doesn't load it)
if (!i18n.hasResourceBundle("en", "privacy")) {
  i18n.addResourceBundle("en", "privacy", enPrivacy, true, true);
}

const PrivacyPolicy = () => {
  const { t } = useTranslation("privacy");
  const navigate = useNavigate();

  return (
    <div className="privacy-policy-container">
      <div className="privacy-policy-inner">
        <div className="w-full mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center"
          >
            <span className="text-2xl mr-2">&lt;</span> {t("BACK") || Back}
          </button>
        </div>
        <h1 className="privacy-policy-title">{t("PRIVACY_POLICY")}</h1>
        <p>
          {t("AT")} <strong>Saayam for All</strong> {t("PRIVACY_INTRO")}
        </p>

        <h2 className="privacy-policy-heading">
          {t("PRIVACY_SECTION_1_TITLE")}
        </h2>
        <ul>
          <li>
            <strong>{t("PRIVACY_INFO_PERSONAL")}</strong>{" "}
            {t("PRIVACY_INFO_PERSONAL_CONTENT")}
          </li>
          <li>
            <strong>{t("PRIVACY_INFO_PROFILE")}</strong>{" "}
            {t("PRIVACY_INFO_PROFILE_CONTENT")}
          </li>
          <li>
            <strong>{t("PRIVACY_INFO_LOCATION")}</strong>{" "}
            {t("PRIVACY_INFO_LOCATION_CONTENT")}
          </li>
          <li>
            <strong>{t("PRIVACY_INFO_USAGE")}</strong>{" "}
            {t("PRIVACY_INFO_USAGE_CONTENT")}
          </li>
          <li>
            <strong>{t("PRIVACY_INFO_REQUEST_RESPONSE")}</strong>{" "}
            {t("PRIVACY_INFO_REQUEST_RESPONSE_CONTENT")}
          </li>
        </ul>

        <h2 className="privacy-policy-heading">
          {t("PRIVACY_SECTION_2_TITLE")}
        </h2>
        <p>{t("PRIVACY_SECTION_2_CONTENT")}</p>

        <h2 className="privacy-policy-heading">
          {t("PRIVACY_SECTION_3_TITLE")}
        </h2>
        <p>{t("PRIVACY_SECTION_3_CONTENT")}</p>

        <h2 className="privacy-policy-heading">
          {t("PRIVACY_SECTION_4_TITLE")}
        </h2>
        <p>{t("PRIVACY_SECTION_4_CONTENT")}</p>

        <h2 className="privacy-policy-heading">
          {t("PRIVACY_SECTION_5_TITLE")}
        </h2>
        <p>{t("PRIVACY_SECTION_5_CONTENT")}</p>

        <h2 className="privacy-policy-heading">
          {t("PRIVACY_SECTION_6_TITLE")}
        </h2>
        <ul>
          <li>{t("PRIVACY_6_ACCESS")}</li>
          <li>{t("PRIVACY_6_DELETE")}</li>
          <li>{t("PRIVACY_6_WITHDRAW")}</li>
        </ul>

        <h2 className="privacy-policy-heading">
          {t("PRIVACY_SECTION_7_TITLE")}
        </h2>
        <p>{t("PRIVACY_SECTION_7_CONTENT")}</p>

        <h2 className="privacy-policy-heading">
          {t("PRIVACY_SECTION_8_TITLE")}
        </h2>
        <p>{t("PRIVACY_SECTION_8_CONTENT")}</p>

        <h2 className="privacy-policy-heading">
          {t("PRIVACY_SECTION_9_TITLE")}
        </h2>
        <p>{t("PRIVACY_SECTION_9_CONTENT")}</p>

        <h2 className="privacy-policy-heading">
          {t("PRIVACY_SECTION_10_TITLE")}
        </h2>
        <p>
          📧 <a href="mailto:info@SaayamForAll.org">info@SaayamForAll.org</a>
          <br />
          📍 {t("PRIVACY_CONTACT_CONTENT")}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
