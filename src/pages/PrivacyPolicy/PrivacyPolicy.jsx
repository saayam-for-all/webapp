import React from "react";
import { useTranslation } from "react-i18next";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  const { t } = useTranslation("privacyPolicy");

  return (
    <div className="privacy-policy-container">
      <div className="privacy-policy-inner">
        <h1 className="privacy-policy-title">{t("PRIVACY_POLICY_TITLE")}</h1>
        <p>{t("PRIVACY_INTRO")}</p>

        <h2 className="privacy-policy-heading">
          {t("PRIVACY_SECTION_1_TITLE")}
        </h2>
        <ul>
          <li>{t("PRIVACY_SECTION_1_IDENTIFIERS")}</li>
          <li>{t("PRIVACY_SECTION_1_PROFILE")}</li>
          <li>{t("PRIVACY_SECTION_1_LOCATION")}</li>
          <li>{t("PRIVACY_SECTION_1_USAGE")}</li>
          <li>{t("PRIVACY_SECTION_1_RECORDS")}</li>
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
          <li>{t("PRIVACY_SECTION_6_ACCESS")}</li>
          <li>{t("PRIVACY_SECTION_6_DELETION")}</li>
          <li>{t("PRIVACY_SECTION_6_CONSENT")}</li>
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
          <a href="mailto:info@SaayamForAll.org">
            {t("PRIVACY_CONTACT_EMAIL")}
          </a>
          <br />
          {t("PRIVACY_CONTACT_ADDRESS")}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
