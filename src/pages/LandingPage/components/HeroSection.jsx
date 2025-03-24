import React from "react";
import { Trans } from "react-i18next";

const HeroSection = () => {
  return (
    <div className="hero bg-base-100">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <div className="py-6 text-2xl">
            <Trans i18nKey="HERO_TEXT">
              Welcome to <strong>Saayam</strong>, a non-profit organization – is
              your gateway to assistance and support in times of need. Saayam
              means Help in Telugu, Sahaay in Sanskrit/Hindi, Bangzhu in
              Mandarin, and Ayuda in Spanish.
            </Trans>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
