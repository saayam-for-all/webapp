import React from "react";
import { useTranslation } from "react-i18next";
import "./Vision.css";
import VISIONIMG from "../../assets/vision.png";

const MissionVision = () => {
  const { t } = useTranslation();
  return (
    <div className="lg:px-5 md:px-10 lg:px-20 mt-6 mb-6">
      <div>
        <h1 className="text-3xl font-semibold text-center">{t("VISION")}</h1>
        <div className="flex flex-col lg:flex-row max-w-5xl mx-auto mt-5">
          <p className="text-lg lg:px-5 text-justify">
            {t("VISION_DESCRIPTION")}
          </p>

          <div className="flex-shrink-0 items-center flex justify-center">
            <img
              src={VISIONIMG}
              alt="vision"
              className="w-[30rem] h-80 mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionVision;
