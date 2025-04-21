import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./Donate.css";
import QRIMG from "../../assets/QR.png";

const Donation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="donation-tab mt-20">
      <h1 className="text-center">{t("SCAN_ON_DONATE")}</h1>
      <div className="flex items-center justify-center mt-6">
        <img src={QRIMG} alt="QR Code for Donation" loading="lazy" />
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <button
          className="btn bg-blue-500 text-white hover:bg-blue-700"
          onClick={() => navigate("/dashboard")} // Redirects to the Dashboard
        >
          {t("BACK")}
        </button>
        <a
          href="https://www.paypal.com/donate/?hosted_button_id=4KLWNM5JWKJ4S"
          className="btn btn-accent"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Donate via PayPal"
        >
          {t("DONATE")}
        </a>
      </div>
    </div>
  );
};

export default Donation;
