import React from "react";
import { useTranslation } from "react-i18next";
import "./TermsAndConditions.css";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="terms-container">
      <div className="terms-inner">
        <div className="w-full mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center"
          >
            <span className="text-2xl mr-2">&lt;</span> {t("BACK") || Back}
          </button>
        </div>
        <h1 className="terms-title">{t("TERMS_AND_CONDITIONS")}</h1>
        <p className="terms-intro">{t("TERMS_INTRO")}</p>

        <section className="terms-section">
          <h2 className="terms-heading">{t("TERMS_ACCEPTANCE_SCOPE_TITLE")}</h2>
          <p>{t("TERMS_ACCEPTANCE_SCOPE_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("TERMS_MISSION_TITLE")}</h2>
          <p>{t("TERMS_MISSION_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("TERMS_ELIGIBILITY_TITLE")}</h2>
          <p>{t("TERMS_ELIGIBILITY_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("TERMS_VOLUNTEER_STATUS_TITLE")}</h2>
          <p>{t("TERMS_VOLUNTEER_STATUS_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("TERMS_CONNECTOR_ROLE_TITLE")}</h2>
          <p>{t("TERMS_CONNECTOR_ROLE_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("TERMS_ACCEPTABLE_USE_TITLE")}</h2>
          <p>{t("TERMS_ACCEPTABLE_USE_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">
            {t("TERMS_PRIVACY_CONFIDENTIALITY_TITLE")}
          </h2>
          <p>{t("TERMS_PRIVACY_CONFIDENTIALITY_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">
            {t("TERMS_CHILDRENS_PRIVACY_TITLE")}
          </h2>
          <p>{t("TERMS_CHILDRENS_PRIVACY_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">
            {t("TERMS_ACCOUNTS_SECURITY_TITLE")}
          </h2>
          <p>{t("TERMS_ACCOUNTS_SECURITY_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("TERMS_ONBOARDING_TITLE")}</h2>
          <p>{t("TERMS_ONBOARDING_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">
            {t("TERMS_INTELLECTUAL_PROPERTY_TITLE")}
          </h2>
          <p>{t("TERMS_INTELLECTUAL_PROPERTY_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("TERMS_THIRD_PARTY_TITLE")}</h2>
          <p>{t("TERMS_THIRD_PARTY_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("TERMS_DISCLAIMERS_TITLE")}</h2>
          <p>
            <strong>{t("TERMS_DISCLAIMERS_CONNECTOR_LABEL")}</strong>{" "}
            {t("TERMS_DISCLAIMERS_CONNECTOR")}
          </p>
          <p>
            <strong>{t("TERMS_DISCLAIMERS_RISK_LABEL")}</strong>{" "}
            {t("TERMS_DISCLAIMERS_RISK")}
          </p>
          <p>
            <strong>{t("TERMS_DISCLAIMERS_LIABILITY_LABEL")}</strong>{" "}
            {t("TERMS_DISCLAIMERS_LIABILITY")}
          </p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("TERMS_INDEMNIFICATION_TITLE")}</h2>
          <p>{t("TERMS_INDEMNIFICATION_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("TERMS_MODIFICATIONS_TITLE")}</h2>
          <p>{t("TERMS_MODIFICATIONS_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">
            {t("TERMS_SERVICE_INTERRUPTIONS_TITLE")}
          </h2>
          <p>{t("TERMS_SERVICE_INTERRUPTIONS_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("TERMS_TERMINATION_TITLE")}</h2>
          <p>{t("TERMS_TERMINATION_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("TERMS_GOVERNING_LAW_TITLE")}</h2>
          <p>{t("TERMS_GOVERNING_LAW_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">
            {t("TERMS_WAIVER_SEVERABILITY_TITLE")}
          </h2>
          <p>{t("TERMS_WAIVER_SEVERABILITY_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("TERMS_ENTIRE_AGREEMENT_TITLE")}</h2>
          <p>{t("TERMS_ENTIRE_AGREEMENT_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("TERMS_CONTACT_TITLE")}</h2>
          <p>
            <strong>{t("TERMS_CONTACT_ORG")}</strong>
          </p>
          <p>
            <strong>{t("TERMS_CONTACT_ADDRESS_LABEL")}</strong>{" "}
            {t("TERMS_CONTACT_ADDRESS_VALUE")}
          </p>
          <p>
            <strong>{t("TERMS_CONTACT_GENERAL_LABEL")}</strong>{" "}
            {t("TERMS_CONTACT_GENERAL_VALUE")}
          </p>
          <p>
            <strong>{t("TERMS_CONTACT_SAFETY_LABEL")}</strong>{" "}
            {t("TERMS_CONTACT_SAFETY_VALUE")}
          </p>
          <p>
            <strong>{t("TERMS_CONTACT_SECURITY_LABEL")}</strong>{" "}
            {t("TERMS_CONTACT_SECURITY_VALUE")}
          </p>
          <p>
            <strong>{t("TERMS_CONTACT_DMCA_LABEL")}</strong>{" "}
            {t("TERMS_CONTACT_DMCA_VALUE")}
          </p>
        </section>

        <p className="terms-thank-you">{t("TERMS_THANK_YOU")}</p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
