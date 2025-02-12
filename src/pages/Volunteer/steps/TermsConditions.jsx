import React, { useState, useEffect, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import VolunteerCourse from "./VolunteerCourse.jsx";

const TermsConditions = ({ isAcknowledged, setIsAcknowledged }) => {
  const { t } = useTranslation();
  const [isCheckboxEnabled, setIsCheckboxEnabled] = useState(false);
  const scrollBoxRef = useRef(null);

  const handleCheckboxChange = () => {
    setIsAcknowledged(!isAcknowledged);
  };

  const handleScroll = () => {
    const scrollBox = scrollBoxRef.current;
    if (
      scrollBox.scrollTop + scrollBox.clientHeight >=
      scrollBox.scrollHeight - 10
    ) {
      setIsCheckboxEnabled(true);
    } else {
      setIsCheckboxEnabled(false);
    }
  };

  useEffect(() => {
    const scrollBox = scrollBoxRef.current;
    if (scrollBox) {
      scrollBox.addEventListener("scroll", handleScroll);
      return () => scrollBox.removeEventListener("scroll", handleScroll);
    }
  }, [scrollBoxRef]);

  return (
    <div className="document-acknowledgment p-6">
      <h2 className="text-2xl font-bold mb-4">{t("ACKNOWLEDGE_TERMS")}</h2>
      <p className="mb-4">{t("TERMS_DOCUMENT")}</p>
      {/* <a
        // href="/path-to-your-document.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        View Document (PDF)
      </a> */}
      <div
        ref={scrollBoxRef}
        className="scrolling-box mt-4 mb-4 p-4 border border-gray-300"
        style={{ height: "150px", overflowY: "auto" }}
      >
        <h3 className="font-bold text-lg mb-2">{t("VOLUNTEER_AGREEMENT")}</h3>
        <div>
          <h4 className="font-bold text-lg mb-2">
            1. {t("INTRODUCTION")}
            <br />
          </h4>
          {t("INTRODUCTION_CONTENT")}
          <br />
          <h4 className="font-bold text-lg mb-2">
            2. {t("VOLUNTEER_ROLE")}
            <br />
          </h4>
          {/* prettier-ignore */}
          <Trans i18nKey="VOLUNTEER_ROLE_CONTENT">
            The Volunteer agrees to fulfill the roles and responsibilities assigned by the Organization, which may include, but are not limited to, assisting in various tasks as needed by individuals or communities requesting help. The Volunteer agrees to: <br/> - Engage in activities assigned by the Organization in a diligent, responsible, and professional manner. <br/> - Communicate promptly with the Organization regarding availability, progress, and challenges. <br/> - Complete assigned tasks promptly and to the best of their ability, adhering to any specified deadlines.
          </Trans>
          <br />
          <h4 className="font-bold text-lg mb-2">
            3. {t("CONDUCT_CODE")}
            <br />
          </h4>
          {/* prettier-ignore */}
          <Trans i18nKey="CONDUCT_CODE_CONTENT">
            The Volunteer agrees to maintain the highest standards of ethical behavior while representing the Organization. This includes: <br/> - Treating all individuals with respect and dignity, regardless of race, religion, gender, sexual orientation, age, or disability. <br/> - Refraining from any form of discrimination, harassment, or unprofessional behavior. <br/> - Avoiding conflicts of interest and ensuring that personal interests do not interfere with their volunteer duties.
          </Trans>
          <br />
          <h4 className="font-bold text-lg mb-2">
            4. {t("CONFIDENTIALITY_AGREEMENT")}
            <br />
          </h4>
          {/* prettier-ignore */}
          <Trans i18nKey="CONFIDENTIALITY_AGREEMENT_CONTENT">
            The Volunteer acknowledges that during their service, they may be privy to confidential, proprietary, or personal information relating to the Organization, other volunteers, or individuals seeking assistance. The Volunteer agrees to: <br/> - Maintain confidentiality of all information, both during & after the term of this Agreement. <br/> - Use such information solely for the purpose of fulfilling their volunteer responsibilities. <br/> - Not disclose any confidential information to third parties without the explicit written consent of the Organization.
          </Trans>
          <br />
          <h4 className="font-bold text-lg mb-2">
            5. {t("DATA_PRIVACY")}
            <br />
          </h4>
          {/* prettier-ignore */}
          <Trans i18nKey="DATA_PRIVACY_CONTENT">
            The Volunteer agrees to comply with all applicable data protection laws and regulations, including but not limited to the General Data Protection Regulation (GDPR) or any other local data protection laws. The Volunteer agrees to: <br/> - Handle all personal data in accordance with the Organization’s data protection policies. <br/> - Protect the integrity and confidentiality of any personal data accessed during volunteer activities. <br/> - Immediately report any data breaches or incidents of unauthorized access to the Organization.
          </Trans>
          <br />
          <h4 className="font-bold text-lg mb-2">
            6. {t("INTELLECTUAL_PROPERTY")}
            <br />
          </h4>
          {/* prettier-ignore */}
          <Trans i18nKey="INTELLECTUAL_PROPERTY_CONTENT">
            Any work, materials, or intellectual property created by the Volunteer in the course of their volunteer activities shall be the sole property of the Organization. The Volunteer agrees to: <br/> - Assign all rights, titles, and interests in such intellectual property to the Organization. <br/> - Refrain from using, reproducing, or distributing any intellectual property created during their service without the Organization's explicit consent.
          </Trans>
          <br />
          <h4 className="font-bold text-lg mb-2">
            {" "}
            7. {t("LIABILITY_WAIVER")}
            <br />
          </h4>
          {/* prettier-ignore */}
          <Trans i18nKey="LIABILITY_WAIVER_CONTENT">
            The Volunteer acknowledges that participation in volunteer activities may involve inherent risks, including but not limited to physical injury, emotional distress, or property damage. The Volunteer agrees to: <br/> - Assume all risks associated with their volunteer activities, including any travel or transportation risks. <br/> - Release, waive, and discharge the Organization, its officers, directors, employees, and affiliates from any and all liability, claims, or demands arising out of or relating to their volunteer activities. <br/> - Acknowledge that the Organization does not provide insurance coverage for volunteers, and the Volunteer is responsible for obtaining any necessary insurance.
          </Trans>
          <br />
          <h4 className="font-bold text-lg mb-2">
            8. {t("INDEMNIFICATION")}
            <br />
          </h4>
          {t("INDEMNIFICATION_CONTENT")}
          <br />
          <h4 className="font-bold text-lg mb-2">
            9. {t("COMMITMENT")}
            <br />
          </h4>
          {/* prettier-ignore */}
          <Trans i18nKey="COMMITMENT_CONTENT">
            The Volunteer agrees to commit to the responsibilities and timeframes as communicated by the Organization. If the Volunteer is unable to fulfill these commitments, they agree to: <br/> - Notify the Organization as soon as possible, providing a valid reason for their unavailability. <br/> - Work collaboratively with the Organization to ensure a smooth transition of responsibilities, if necessary.
          </Trans>
          <br />
          <h4 className="font-bold text-lg mb-2">
            10. {t("TRAINING_SUPERVISION")}
            <br />
          </h4>
          {/* prettier-ignore */}
          <Trans i18nKey="TRAINING_SUPERVISION_CONTENT">
            The Organization will provide necessary training and supervision to the Volunteer. The Volunteer agrees to: <br/> - Attend all required training sessions. <br/> - Adhere to instructions and guidelines provided by the Organization’s supervisors or staff. <br/> - Seek clarification or assistance when needed to perform their duties effectively.
          </Trans>
          <br />
          <h4 className="font-bold text-lg mb-2">
            11. {t("HEALTH_SAFETY")}
            <br />
          </h4>
          {/* prettier-ignore */}
          <Trans i18nKey="HEALTH_SAFETY_CONTENT">
            The Volunteer acknowledges their responsibility to follow all health and safety guidelines provided by the Organization. The Volunteer agrees to: <br/> - Report any unsafe conditions or incidents immediately to the Organization. <br/> - Take reasonable precautions to protect their health and safety as well as that of others during their volunteer activities.
          </Trans>
          <br />
          <h4 className="font-bold text-lg mb-2">
            12. {t("DISPUTE_RESOLUTION")}
            <br />
          </h4>
          {t("DISPUTE_RESOLUTION_CONTENT")}
          <br />
          <h4 className="font-bold text-lg mb-2">
            13. {t("GOVERNING_LAW")}
            <br />
          </h4>
          {t("GOVERNING_LAW_CONTENT")}
          <br />
          <h4 className="font-bold text-lg mb-2">
            14. {t("ACKNOWLEDGMENT")}
            <br />
          </h4>
          {t("ACKNOWLEDGMENT_CONTENT")}
        </div>
      </div>
      <div className="checkbox-container mt-4">
        <input
          type="checkbox"
          id="acknowledge"
          checked={isAcknowledged}
          onChange={handleCheckboxChange}
          className="mr-2"
          disabled={!isCheckboxEnabled}
        />
        <label htmlFor="acknowledge" className="text-gray-700">
          {t("I_HAVE_READ")}
        </label>
      </div>
    </div>
  );
};

export default TermsConditions;
