import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Donate.css";
import QRIMG from "../../assets/QR.png";

const Donation = () => {
  const { t } = useTranslation();

  return (
    <div className="donation-tab mt-20">
      <h1 className="tect-center">{t("SCAN_ON_DONATE")}</h1>
      <div className="flex items-center justify-center mt-6">
        <img src={QRIMG} alt="qr" />
      </div>
      <a
        href="https://www.paypal.com/donate/?hosted_button_id=4KLWNM5JWKJ4S"
        className="btn btn-accent mt-6"
        target="_blank"
      >
        {t("DONATE")}
      </a>
    </div>
  );
};

export default Donation;
