import React from "react";
import { useTranslation } from "react-i18next";
import "./Mission.css";
import MISSIONIMG from "../../assets/mission.png";

const MissionVision = () => {
  const { t } = useTranslation();
  return (
    <div className="px-5 md:px-10 lg:px-20 mt-6 mb-6">
      <div>
        <h1 className="text-3xl font-semibold text-center">{t("MISSION")}</h1>
        <div className="flex flex-col md:flex-col lg:flex-row max-w-5xl mx-auto mt-5">
          <div className="flex-shrink-0">
            <img src={MISSIONIMG} alt="mission" className="w-[35rem] h-80" />
          </div>
          <p className="text-lg px-5 text-justify">
            {t("EMPOWER_INDIVIDUALS")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MissionVision;
