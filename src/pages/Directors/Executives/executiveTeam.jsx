// import { Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import executiveTeamData from "../data/executiveTeam";

const ExecutiveTeam = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-100 py-16 px-4 sm:px-8 md:px-16 lg:px-[150px] xl:px-[250px]">
      <div className="text-center max-w-3xl mx-auto mb-12 px-4">
        <h2 className="font-extrabold text-2xl sm:text-3xl mb-4">
          {t("EXECUTIVE_TEAM")}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-2">
          {t("EXECUTIVE_DESCRIPTION_1")}
        </p>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          {t("EXECUTIVE_DESCRIPTION_2")}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-10">
        {executiveTeamData.map((member, index) => (
          <div key={index} className="w-[180px] text-center">
            <div className="w-[200px] h-[240px] overflow-hidden rounded-lg mx-auto">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* <div className="font-semibold text-base mt-3 text-left pl-1">
              {member.name}
            </div> */}
            <div className="font-semibold text-base mt-3 text-left pl-1">
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:underline"
              >
                {t(member.name)}
              </a>
            </div>
            <div className="text-sm text-gray-500 mt-1 text-left pl-1">
              {t(member.role) || " "}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ExecutiveTeam;
