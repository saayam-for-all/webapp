import { useTranslation } from "react-i18next";

import NaveenIMG from "../../assets/images/Naveen_Sharma.jpeg";
import RaoImg from "../../assets/images/Rao.jpeg";
import "./Directors.css";
// import RajeshwaryImg from "../../assets/images/Rajeshwary.jpeg";
import RameshImg from "../../assets/images/Ramesh_Maturu.jpeg";
// import RaoPanugantiImg from "../../assets/images/Rao-Panuganti.jpeg";
import AshwaniImg from "../../assets/images/Ashwani_Dhawan.png";
import PrabhakarImg from "../../assets/images/Prabhakar_Yellai.jpeg";
import SharadhaImg from "../../assets/images/Sharadha_Subramanian.jpeg";
import SrividhyaImg from "../../assets/images/Srividhya_Gopalan.jpeg";

import { useNavigate } from "react-router-dom";
import MadhukarImg from "../../assets/images/Madhukar_Govindaraju.jpeg";
import SateeshImg from "../../assets/images/Sateesh_Mucharla.jpeg";
import ExecutiveTeam from "./Executives/executiveTeam";

const DirectorsData = [
  {
    image: RaoImg,
    name: "Rao K Bhethanabotla",
    role: "Founder, President, CEO, CTO",
    linkedin: "https://www.linkedin.com/in/raobhethanabotla",
  },
  {
    name: "Srividhya Gopalan",
    role: "Director & Chief Financial Officer",
    linkedin: "https://www.linkedin.com/in/srividhyagopalan/",
    image: SrividhyaImg,
  },
  {
    name: "Naveen Sharma",
    role: "Director and Secretary",
    linkedin: "https://www.linkedin.com/in/nsharma2/",
    image: NaveenIMG,
  },
  {
    name: "Prabhakara Yellai",
    role: "Director",
    linkedin: "https://www.linkedin.com/in/prabhakara-yellai/",
    image: PrabhakarImg,
  },
  {
    name: "Sharadha Venketasubramanian",
    role: "Director",
    linkedin: "https://www.linkedin.com/in/sharadha/",
    image: SharadhaImg,
  },
  {
    name: "Ramesh Maturu",
    role: "Director",
    linkedin: "https://www.linkedin.com/in/rameshmaturu/",
    image: RameshImg,
  },
  // {
  //   name: "Rao Panuganti",
  //   role: "Director",
  //   linkedin: "https://www.linkedin.com/in/rao-panuganti-654443/",
  //   image: RaoPanugantiImg,
  // },

  // {
  //   name: "Rajeshwary Jaldu",
  //   role: "Director & Treasurer",
  //   linkedin: "https://www.linkedin.com/in/rajeshwary-jaldu/",
  //   image: RajeshwaryImg,
  // },
  {
    name: "Madhukar Govindaraju",
    role: "Director",
    linkedin: "https://www.linkedin.com/in/madhukar/",
    image: MadhukarImg,
  },
  {
    name: "Sateesh Mucharla",
    role: "Director",
    linkedin: "https://www.linkedin.com/in/mucharla",
    image: SateeshImg,
  },
  {
    name: "Ashwani Dhawan",
    role: "Director",
    linkedin: "https://www.linkedin.com/in/mantrapaloalto/",
    image: AshwaniImg, // We'll import this below
  },
];

// const advisorsData = [
//   {
//     name: "Madhukar Govindaraju",
//     role: "Advisor",
//     linkedin: "https://www.linkedin.com/in/madhukar/",
//     imgUrl: MadhukarImg,
//   },
//   {
//     name: "Sateesh Mucharla",
//     role: "Advisor",
//     linkedin: "https://www.linkedin.com/in/mucharla",
//     imgUrl: SateeshImg,
//   },
// ];

const Directors = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const btnOnClick = () => {
    navigate("/contact");
  };
  return (
    <div className="p-5">
      <section>
        <h1 className="text-center text-3xl font-bold text-black">
          {t("DIRECTORS")}
        </h1>
        <p className="text-center text-lg text-gray-600 my-4">
          {t("DIRECTORS_DESCRIPTION")}
        </p>
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-1 gap-y-4 place-items-center">
          {DirectorsData.map((director, index) => (
            <div
              key={index}
              className="w-[190px] text-center flex flex-col justify-start"
            >
              <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-lg w-full">
                <img
                  src={director.image}
                  alt={director.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full px-1 pt-4 text-left flex flex-col justify-between min-h-[60px]">
                <h2
                  className={`${
                    director.name === "Sharadha Venketasubramanian"
                      ? "text-[13px]"
                      : "text-[16px]"
                  } font-semibold text-black text-left w-full break-words leading-snug`}
                >
                  <a
                    href={director.linkedin}
                    className="block"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={t(director.name)}
                  >
                    {t(director.name)}
                  </a>
                </h2>

                <h3 className="text-[12.5px] text-gray-700">
                  {t(director.role)}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <ExecutiveTeam />
      </section>
      {/* <section className="py-20">
        <h1 className="text-center text-3xl font-bold text-black">
          {t("ADVISORS")}
        </h1>
        <p className="text-center text-lg text-gray-600 my-4">
          {t("ADVISORS_DESCRIPTION")}
        </p>
        <div className="flex items-center justify-center flex-wrap gap-10 my-20">
          {advisorsData.map((advisor, index) => (
            <div key={index} className="">
              <img
                src={advisor.imgUrl}
                alt={advisor.name}
                width={250}
                className="object-cover aspect-[2.5/3] rounded-xl"
              />
              <div className="text-left self-start">
                <h2 className="flex gap-2 mt-5">
                  <a
                    href={advisor.linkedin}
                    className="text-black font-bold text-xl"
                    target="_blank"
                  >
                    {advisor.name}
                  </a>
                </h2>
                <h3 className="flex gap-2">{advisor.role}</h3>
              </div>
            </div>
          ))}
        </div>
      </section> */}
    </div>
  );
};

export default Directors;
