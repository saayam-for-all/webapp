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
    image: AshwaniImg,
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
    <div>
      <div className="bg-gray-100 py-16 px-4 sm:px-8 md:px-16 lg:px-[150px] xl:px-[250px]">
        <div className="text-center max-w-3xl mx-auto mb-12 px-4">
          <h2 className="font-extrabold text-2xl sm:text-3xl mb-4">
            {t("DIRECTORS")}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-2">
            {t("DIRECTORS_DESCRIPTION")}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          {DirectorsData.map((director, index) => (
            <div key={index} className="w-[180px] text-center">
              <div className="w-[200px] h-[240px] overflow-hidden rounded-lg mx-auto">
                <img
                  src={director.image}
                  alt={t(director.name)}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="font-semibold text-base mt-3 text-left pl-1">
                <a
                  href={director.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline"
                >
                  {t(director.name)}
                </a>
              </div>
              <div className="text-sm text-gray-500 mt-1 text-left pl-1">
                {t(director.role)}
              </div>
            </div>
          ))}
        </div>
      </div>
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
