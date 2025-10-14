import "@fontsource/poppins";
import { useTranslation } from "react-i18next";
import img1 from "../../../assets/about_Us/bot.png";
import img2 from "../../../assets/about_Us/building-2.png";
import img3 from "../../../assets/about_Us/circle-dollar-sign.png";
import img4 from "../../../assets/about_Us/diversity_4.png";
import img5 from "../../../assets/about_Us/droplet.png";
import img6 from "../../../assets/about_Us/hand-heart.png";
import img7 from "../../../assets/about_Us/handshake.png";
import img8 from "../../../assets/about_Us/trophy.png";

export function MissionHero() {
  const { t } = useTranslation();
  const values = [
    {
      icon: img5, // 💧
      titleLine1: t("Address Basic"),
      titleLine2: t("Necessities"),
      description1: t("Focus on food, clothing,"),
      description2: t("shelter, education,"),
      description3: t("medical, healthcare."),
    },
    {
      icon: img4, // 🤝 Inclusivity
      titleLine1: t("Inclusivity and "),
      titleLine2: t("Respect"),
      description1: t("Open to all, regardless of beliefs,"),
      description2: t(" religion, location, country, or politics,"),
      description3: t("without desecrating any beliefs."),
    },
    {
      icon: img7, // 🤝 Collaboration
      titleLine1: t("Collaboration,"),
      titleLine2: t("Not Competition"),

      description1: t("Match Requestors with existing"),
      description2: t("voluntary organizations without"),
      description3: t("starting new ones that compete."),
    },
    {
      icon: img2, // 🏢
      titleLine1: t("No Infrastructure or"),
      titleLine2: t(" Money Distribution"),

      description1: t("No building of schools or hospitals and"),
      description2: t("no direct distribution of money."),
    },
    {
      icon: img6, // 👐
      titleLine1: t("Volunteer-Based"),
      description1: t("Purely volunteer-driven with no pay or"),
      description2: t("benefits; cost reimbursement is allowed."),
    },
    {
      icon: img8, // 🏆
      titleLine1: t("Motivation"),
      description1: t("Use Saayam Dollars to motivate"),
      description2: t("volunteers."),
    },
    {
      icon: img1, // 🤖
      titleLine1: t("Automation"),
      description1: t("Implement a software solution with"),
      description2: t("minimal human intervention."),
    },
    {
      icon: img3, // 💲
      titleLine1: t("Cost-Efficiency"),
      description1: t("Utilize free resources like WhatsApp,"),
      description2: t(" Zoom, and GitHub to keep costs low."),
    },
  ];
  return (
    <section className="flex justify-center items-center py-10 bg-white">
      <div className="text-center ">
        <h2 className="text-2xl font-bold mb-2">{t("Our Values")}</h2>
        <p className="text-gray-600 text-base leading-relaxed mb-6 mx-auto md:whitespace-nowrap">
          {t(
            "At Saayam For All, our shared values keep us connected and guide us as one team.",
          )}
        </p>
        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2  gap-4 pl-[25px] md:pl-0">
          {values.map((item, index) => (
            <div
              key={index}
              className="bg-blue-50 rounded-2xl p-6 text-center shadow-sm border border-blue-100 w-[320px] h-[320px] flex flex-col justify-center items-center"
            >
              <div className="mb-12">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-12 h-12 mx-auto"
                />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">
                {item.titleLine1} <br /> {item.titleLine2}
              </h3>

              <p className="text-sm text-gray-600">
                {item.description1}
                <br /> {item.description2}
                <br /> {item.description3}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
