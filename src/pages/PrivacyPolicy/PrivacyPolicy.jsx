import React from "react";
import { useTranslation } from "react-i18next";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="privacy-policy-container">
      <div className="privacy-policy-inner">
        <h1 className="privacy-policy-title">{t("PRIVACY_POLICY")}</h1>
        <p>
          {t("At")} <strong>Saayam for All</strong> {t("PRIVACY_INTRO")}
        </p>

        <h2 className="privacy-policy-heading">
          {t("PRIVACY_INFO_COLLECT_TITLE")}
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

        <h2 className="privacy-policy-heading">{t("PRIVACY_USE_TITLE")}</h2>
        <p>{t("PRIVACY_USE_CONTENT")}</p>

        <h2 className="privacy-policy-heading">{t("PRIVACY_SHARING_TITLE")}</h2>
        <p>{t("PRIVACY_SHARING_CONTENT")}</p>

        <h2 className="privacy-policy-heading">
          {t("PRIVACY_RETENTION_TITLE")}
        </h2>
        <p>{t("PRIVACY_RETENTION_CONTENT")}</p>

        <h2 className="privacy-policy-heading">
          {t("PRIVACY_SECURITY_TITLE")}
        </h2>
        <p>{t("PRIVACY_SECURITY_CONTENT")}</p>

        <h2 className="privacy-policy-heading">{t("PRIVACY_RIGHTS_TITLE")}</h2>
        <ul>
          <li>{t("PRIVACY_RIGHTS_ACCESS")}</li>
          <li>{t("PRIVACY_RIGHTS_DELETE")}</li>
          <li>{t("PRIVACY_RIGHTS_WITHDRAW")}</li>
        </ul>

        <h2 className="privacy-policy-heading">{t("PRIVACY_COOKIES_TITLE")}</h2>
        <p>{t("PRIVACY_COOKIES_CONTENT")}</p>

        <h2 className="privacy-policy-heading">
          {t("PRIVACY_THIRD_PARTY_TITLE")}
        </h2>
        <p>{t("PRIVACY_THIRD_PARTY_CONTENT")}</p>

        <h2 className="privacy-policy-heading">{t("PRIVACY_CHANGES_TITLE")}</h2>
        <p>{t("PRIVACY_CHANGES_CONTENT")}</p>

        <h2 className="privacy-policy-heading">{t("PRIVACY_CONTACT_TITLE")}</h2>
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
