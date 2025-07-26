import React from "react";
import "./PrivacyPolicy.css";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="privacy-policy-container">
      <div className="privacy-policy-inner">
        <h1 className="privacy-policy-title">{t("PRIVACY_TITLE")}</h1>
        <p>{t("PRIVACY_INTRO")}</p>

        <h2 className="privacy-policy-heading">
          {t("PRIVACY_SECTION_1_TITLE")}
        </h2>
        <ul>
          <li>
            <strong>{t("PRIVACY_1_PERSONAL")}</strong>
          </li>
          <li>
            <strong>{t("PRIVACY_1_PROFILE")}</strong>
          </li>
          <li>
            <strong>{t("PRIVACY_1_LOCATION")}</strong>
          </li>
          <li>
            <strong>{t("PRIVACY_1_USAGE")}</strong>
          </li>
          <li>
            <strong>{t("PRIVACY_1_RECORDS")}</strong>
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
          📍 Saayam for All, 3046 Rosato Ct., San Jose, California 95135
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
