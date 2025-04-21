import { useTranslation } from "react-i18next";

import "./Directors.css";

import NaveenIMG from "../../assets/images/Naveen_Sharma.jpeg";
import RajeshwaryImg from "../../assets/images/Rajeshwary.jpeg";
import RameshImg from "../../assets/images/Ramesh_Maturu.jpeg";
import RaoPanugantiImg from "../../assets/images/Rao-Panuganti.jpeg";
import RaoImg from "../../assets/images/Rao.jpeg";
import MadhukarImg from "../../assets/images/Madhukar_Govindaraju.jpeg";
import SateeshImg from "../../assets/images/Sateesh_Mucharla.jpeg";
import { useNavigate } from "react-router-dom";
import ExecutiveTeam from "./Executives/executiveTeam";

const DirectorsData = [
  // {
  //   name: "Rao K Bhethanabotla",
  //   role: "Founder, CEO, CTO, President",
  //   linkedin: "https://www.linkedin.com/in/raobhethanabotla",
  //   image: RaoImg,
  // },
  {
    name: "Ramesh Maturu",
    role: "Director",
    linkedin: "https://www.linkedin.com/in/rameshmaturu/",
    image: RameshImg,
  },
  {
    name: "Rao Panuganti",
    role: "Director",
    linkedin: "https://www.linkedin.com/in/rao-panuganti-654443/",
    image: RaoPanugantiImg,
  },
  {
    name: "Naveen Sharma",
    role: "Director",
    linkedin: "https://www.linkedin.com/in/nsharma2/",
    image: NaveenIMG,
  },
  {
    name: "Rajeshwary Jaldu",
    role: "Director & Treasurer",
    linkedin: "https://www.linkedin.com/in/rajeshwary-jaldu/",
    image: RajeshwaryImg,
  },
];

const advisorsData = [
  {
    name: "Madhukar Govindaraju",
    role: "Advisor",
    linkedin: "https://www.linkedin.com/in/madhukar/",
    imgUrl: MadhukarImg,
  },
  {
    name: "Sateesh Mucharla",
    role: "Advisor",
    linkedin: "https://www.linkedin.com/in/mucharla",
    imgUrl: SateeshImg,
  },
];

const Directors = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const btnOnClick = () => {
    navigate("/contact");
  };
  return (
    <div className="py-5">
      <section>
        <h1 className="text-center text-3xl font-bold text-black">
          {t("DIRECTORS")}
        </h1>
        <p className="text-center text-lg text-gray-600 my-4">
          {t("DIRECTORS_DESCRIPTION")}
        </p>

        <div className="directors flex items-center justify-center flex-wrap gap-10 my-20">
          {DirectorsData.map((director, index) => (
            <div key={index} className="">
              <div>
                <img
                  src={director.image}
                  alt={director.name}
                  width={300}
                  height={400}
                  style={{
                    aspectRatio: "3/3",
                  }}
                  className="rounded-2xl shadow-lg"
                />
              </div>

              <div className="text-left self-start w-full px-6">
                <h2 className="flex gap-2 mt-5">
                  <a
                    href={director.linkedin}
                    className="text-black font-bold text-xl"
                    target="_blank"
                  >
                    {director.name}
                  </a>
                </h2>
                <h3 className="flex gap-2">{director.role}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <ExecutiveTeam />
      </section>
      <section className="py-20">
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
        <div className="flex flex-col items-center">
          <h1 className="text-center text-3xl font-bold text-black">
            {t("Looking to join us?")}
          </h1>
          <p className="text-center text-lg text-gray-600 my-4">
            {t("Chat with our community and get in touch with our team!")}
          </p>
          <button
            className="text-center bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 my-2 rounded-2xl"
            onClick={btnOnClick}
          >
            Join the community
          </button>
        </div>
      </section>
    </div>
  );
};

export default Directors;
