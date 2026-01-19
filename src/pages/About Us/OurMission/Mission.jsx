import { useTranslation } from "react-i18next";
import img1 from "../OurMission/our-mission-img1.png";
import img2 from "../OurMission/our-mission-img2.png";
import img3 from "../OurMission/our-mission-img3.png";
export function Mission() {
  const { t } = useTranslation();
  return (
    <section className="flex justify-center items-center py-10 bg-white">
      <div className="w-full max-w-[1100px] md:h-auto rounded-[30px] p-6 border-blue-200 flex flex-col justify-between">
        {/* Header Row: Our Mission + Paragraph in single row */}
        <div className="flex flex-col md:flex-row mb-2 justify-center items-center text-center md:text-left">
          <h2 className="text-2xl font-bold mb-2 md:mb-0 md:mr-4 whitespace-nowrap">
            {t("Our Mission")}
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            {t(
              "Our mission is to provide timely and targeted assistance to those,",
            )}
            <br />
            {t(
              "facing challenges in their lives, fostering a culture of compassion,",
            )}
            <br />
            {t("solidarity, and service to humanity.")}
          </p>
        </div>
        {/* Image Row */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-4">
          <img
            src={img1}
            alt="Mission image 1"
            className="w-full md:w-[28%] h-[250px] md:h-[300px] object-cover rounded-[20px]"
          />
          <img
            src={img2}
            alt="Mission image 2"
            className="w-full md:w-[28%] h-[250px] md:h-[300px] object-cover rounded-[20px]"
          />
          <img
            src={img3}
            alt="Mission image 3"
            className="w-full md:w-[28%] h-[250px] md:h-[300px] object-cover rounded-[20px]"
          />
        </div>
      </div>
    </section>
  );
}
