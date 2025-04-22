import React from "react";
import { useTranslation } from "react-i18next";
import DonationContent from "./components/DonationContent";
import FAQ from "./components/FAQ";

const Donate = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <DonationContent />
      <FAQ />
    </div>
  );
};

export default Donate;
