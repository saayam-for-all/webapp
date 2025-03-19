import React from "react";
import { useTranslation } from "react-i18next";
import "./Vision.css";
import VISIONIMG from "../../assets/vision.png";

const MissionVision = () => {
  const { t } = useTranslation();
  return (
    <div className="px-20 mt-6">
      <div>
        <h1 className="text-2xl font-semibold text-center mt-6">
          {t("VISION")}
        </h1>
        <div className="flex items-start">
          <p className="mt-5 text-lg px-5">{t("VISION_DESCRIPTION")}</p>
          <div>
            <img
              src={VISIONIMG}
              alt="vision"
              className="w-[350rem] h-80 mt-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionVision;
