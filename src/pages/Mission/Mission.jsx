import React from "react";
import { useTranslation } from "react-i18next";
import "./Mission.css";
import MISSIONIMG from "../../assets/mission.png";

const MissionVision = () => {
  const { t } = useTranslation();
  return (
    <div className="px-20 mt-6">
      <div>
        <h1 className="text-2xl font-semibold text-center">{t("MISSION")}</h1>
        <div className="flex">
          <div>
            <img
              src={MISSIONIMG}
              alt="mission"
              className="w-[300rem] h-80 mt-5"
            />
          </div>
          <p className="mt-5 text-lg px-5">{t("EMPOWER_INDIVIDUALS")}</p>
        </div>
      </div>
    </div>
  );
};

export default MissionVision;
