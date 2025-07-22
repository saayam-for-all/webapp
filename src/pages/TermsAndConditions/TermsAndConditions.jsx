import React from "react";
import { useTranslation } from "react-i18next";
import "./TermsAndConditions.css";

const TermsAndConditions = () => {
  const { t } = useTranslation();

  return (
    <div className="terms-container">
      <div className="terms-inner">
        <h1 className="terms-title">{t("TERMS_AND_CONDITIONS")}</h1>
        <p className="terms-intro">{t("TERMS_INTRO")}</p>

        <section className="terms-section">
          <h2 className="terms-heading">{t("TERMS_OVERVIEW_TITLE")}</h2>
          <p>{t("TERMS_OVERVIEW_CONTENT")}</p>
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
          <h2 className="terms-heading">{t("TERMS_USER_ROLES_TITLE")}</h2>
          <p>{t("TERMS_USER_ROLES_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("TERMS_SERVICES_TITLE")}</h2>
          <p>{t("TERMS_SERVICES_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("TERMS_LIMITATIONS_TITLE")}</h2>
          <p>{t("TERMS_LIMITATIONS_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("TERMS_ACCEPTABLE_USE_TITLE")}</h2>
          <p>{t("TERMS_ACCEPTABLE_USE_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("TERMS_PRIVACY_TITLE")}</h2>
          <p>{t("TERMS_PRIVACY_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">
            {t("TERMS_NON_DISCRIMINATION_TITLE")}
          </h2>
          <p>{t("TERMS_NON_DISCRIMINATION_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("TERMS_DISCLAIMERS_TITLE")}</h2>
          <p>{t("TERMS_DISCLAIMERS_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">
            {t("TERMS_INTELLECTUAL_PROPERTY_TITLE")}
          </h2>
          <p>{t("TERMS_INTELLECTUAL_PROPERTY_CONTENT")}</p>
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
          <h2 className="terms-heading">{t("TERMS_TERMINATION_TITLE")}</h2>
          <p>{t("TERMS_TERMINATION_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">
            {t("TERMS_LIMITATION_LIABILITY_TITLE")}
          </h2>
          <p>{t("TERMS_LIMITATION_LIABILITY_CONTENT")}</p>
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
          <p>{t("TERMS_CONTACT_CONTENT")}</p>
        </section>

        <p className="terms-thank-you">{t("TERMS_THANK_YOU")}</p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
