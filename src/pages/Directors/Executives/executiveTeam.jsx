// import { Typography, Box } from "@mui/material";
import executiveTeamData from "../data/executiveTeam";
import { useTranslation } from "react-i18next";

const ExecutiveTeam = () => {
  const { t } = useTranslation();
  return (
    // <Box className="bg-gray-100 py-16 p-[6rem]">
    //   <div className="text-center max-w-3xl mx-auto mb-12">
    //     <Typography
    //       variant="h4"
    //       className="font-bold text-xl mb-4"
    //       fontWeight={600}
    //     >
    //       {t("EXECUTIVE_TEAM")}
    //     </Typography>
    //     <Typography className="text-gray-600 text-base pt-[10px]">
    //         {t("EXECUTIVE_DESCRIPTION_1")}
    //     </Typography>
    //     <Typography className="text-gray-600 text-base">
    //         {t("EXECUTIVE_DESCRIPTION_2")}
    //     </Typography>
    //   </div>
    //   <div className="flex flex-wrap justify-center gap-10">
    //     {executiveTeamData.map((member, index) => (
    //       <div key={index} className="w-[180px] text-center">
    //         <div className="w-[200px] h-[240px] overflow-hidden rounded-lg mx-auto">
    //           <img
    //             src={member.image}
    //             alt={member.name}
    //             className="w-full h-full object-cover"
    //           />
    //         </div>
    //         <div className="font-semibold text-base mt-3 text-left pl-1">
    //           {member.name}
    //         </div>
    //         <div className="text-sm text-gray-500 mt-1 text-left pl-1">
    //           {member.role || " "}
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </Box>
    <div className="bg-gray-100 py-16 px-24">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="font-extrabold text-3xl mb-4">{t("EXECUTIVE_TEAM")}</h2>
        <p className="text-gray-600 text-base leading-[0.5]">
          {t("EXECUTIVE_DESCRIPTION_1")}
        </p>
        <p className="text-gray-600 text-base leading-[0.5]">
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
            <div className="font-semibold text-base mt-3 text-left pl-1">
              {member.name}
            </div>
            <div className="text-sm text-gray-500 mt-1 text-left pl-1">
              {member.role || " "}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ExecutiveTeam;
