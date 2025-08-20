import React from "react";
import { useTranslation } from "react-i18next";
import "./TermsAndConditions.css";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const { t } = useTranslation(["common", "terms"]);
  const navigate = useNavigate();

  return (
    <div className="terms-container">
      <div className="terms-inner">
        <div className="w-full mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center"
          >
            <span className="text-2xl mr-2">&lt;</span> Back
          </button>
        </div>
        <h1 className="terms-title">{t("common:TERMS_AND_CONDITIONS")}</h1>
        <p className="terms-intro">{t("terms:TERMS_INTRO")}</p>

        <section className="terms-section">
          <h2 className="terms-heading">{t("terms:TERMS_OVERVIEW_TITLE")}</h2>
          <p>{t("terms:TERMS_OVERVIEW_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("terms:TERMS_MISSION_TITLE")}</h2>
          <p>{t("terms:TERMS_MISSION_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">
            {t("terms:TERMS_ELIGIBILITY_TITLE")}
          </h2>
          <p>{t("terms:TERMS_ELIGIBILITY_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("terms:TERMS_USER_ROLES_TITLE")}</h2>
          <p>{t("terms:TERMS_USER_ROLES_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("terms:TERMS_SERVICES_TITLE")}</h2>
          <p>{t("terms:TERMS_SERVICES_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">
            {t("terms:TERMS_LIMITATIONS_TITLE")}
          </h2>
          <p>{t("terms:TERMS_LIMITATIONS_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">
            {t("terms:TERMS_ACCEPTABLE_USE_TITLE")}
          </h2>
          <p>{t("terms:TERMS_ACCEPTABLE_USE_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("terms:TERMS_PRIVACY_TITLE")}</h2>
          <p>{t("terms:TERMS_PRIVACY_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">
            {t("terms:TERMS_NON_DISCRIMINATION_TITLE")}
          </h2>
          <p>{t("terms:TERMS_NON_DISCRIMINATION_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">
            {t("terms:TERMS_DISCLAIMERS_TITLE")}
          </h2>
          <p>{t("terms:TERMS_DISCLAIMERS_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">
            {t("terms:TERMS_INTELLECTUAL_PROPERTY_TITLE")}
          </h2>
          <p>{t("terms:TERMS_INTELLECTUAL_PROPERTY_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">
            {t("terms:TERMS_INDEMNIFICATION_TITLE")}
          </h2>
          <p>{t("terms:TERMS_INDEMNIFICATION_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">
            {t("terms:TERMS_MODIFICATIONS_TITLE")}
          </h2>
          <p>{t("terms:TERMS_MODIFICATIONS_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">
            {t("terms:TERMS_TERMINATION_TITLE")}
          </h2>
          <p>{t("terms:TERMS_TERMINATION_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">
            {t("terms:TERMS_LIMITATION_LIABILITY_TITLE")}
          </h2>
          <p>{t("terms:TERMS_LIMITATION_LIABILITY_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">
            {t("terms:TERMS_GOVERNING_LAW_TITLE")}
          </h2>
          <p>{t("terms:TERMS_GOVERNING_LAW_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">
            {t("terms:TERMS_WAIVER_SEVERABILITY_TITLE")}
          </h2>
          <p>{t("terms:TERMS_WAIVER_SEVERABILITY_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">
            {t("terms:TERMS_ENTIRE_AGREEMENT_TITLE")}
          </h2>
          <p>{t("terms:TERMS_ENTIRE_AGREEMENT_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <h2 className="terms-heading">{t("terms:TERMS_CONTACT_TITLE")}</h2>
          <p>{t("terms:TERMS_CONTACT_CONTENT")}</p>
        </section>

        <section className="terms-section">
          <p className="terms-thank-you">{t("terms:TERMS_THANK_YOU")}</p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
