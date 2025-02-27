import React from "react";
import { useTranslation } from "react-i18next";
import HOWWEOPERATEIMG from "../../assets/howWeOperate.jpeg";
import howWeOperateData from "../How We Operate/HowWeOperateData.js";

const HowWeOperate = () => {
  const { t } = useTranslation();
  return (
    <div className="px-5 md:px-10 lg:px-20 mt-6 mb-6">
      <div>
        <h1 className="text-3xl font-semibold text-center">
          {t("HOW_WE_OPERATE")}
        </h1>

        <div className="flex flex-col md:flex-col lg:flex-row max-w-5xl mx-auto mt-5">
          <div className="flex-shrink-0 w-full md:w-full lg:w-5/12">
            <a href="https://youtu.be/9CBLVoSSuwM">
              <img
                src={HOWWEOPERATEIMG}
                alt="how we operate"
                className="h-96 w-[30rem] mx-auto"
              />
            </a>
          </div>

          <div className="flex flex-col text-left justify-center w-full md:w-full lg:w-7/12 px-5 mt-4 lg:mt-0 space-y-6">
            {howWeOperateData.map((item, key) => (
              <div key={key}>
                <h1 className="text-lg font-semibold">{t(item.heading)}</h1>
                <p className="text-sm">{t(item.points)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowWeOperate;
