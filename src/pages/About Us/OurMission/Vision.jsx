import { useTranslation } from "react-i18next";
import visionImg1 from "../../../assets/images/our-mission/vision-img-1.png";
import visionImg2 from "../../../assets/images/our-mission/vision-img-2.png";
import visionImg3 from "../../../assets/images/our-mission/vision-img-3.png";
import visionImg4 from "../../../assets/images/our-mission/vision-img-4.png";

export function Vision() {
  const { t } = useTranslation();
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between items-start px-4 gap-6">
        {/* Left Text Block */}
        <div className="w-full md:w-[42%] ml-[10px] md:ml-[90px]">
          <h2 className="text-2xl font-bold mb-4">{t("Our Vision")}</h2>
          <p className="text-gray-700 text-base leading-relaxed">
            {t("Our vision is to cultivate a community")} <br />
            {t('where the ethos of "Manava Sevaye Madhava')}
            <br />
            {t('Seva" ( Service to mankind is Service to God )')}
            <br /> {t('and "Sarve jana sukhino bhavantu" ( May ')}
            <br />
            {t("all live happily) guides our actions, driving")}
            <br />
            {t("positive change and fostering a more")}
            <br /> {t("compassionate and equitable world for all.")}
          </p>
        </div>
        {/* Right Image Grid */}
        <div className="grid grid-cols-2 gap-2 w-full md:w-[40%] md:ml-[-20px]">
          <img
            src={visionImg1}
            alt="Vision image 1"
            className="object-cover h-[150px] w-full rounded-tl-[20px]"
          />
          <img
            src={visionImg2}
            alt="Vision image 2"
            className="object-cover h-[210px] w-full rounded-tr-[20px]"
          />
          <img
            src={visionImg3}
            alt="Vision image 3"
            className="object-cover h-[150px] w-full mt-[-50px] rounded-bl-[20px]"
          />
          <img
            src={visionImg4}
            alt="Vision image 4"
            className="object-cover h-[100px] w-full rounded-br-[20px]"
          />
        </div>
      </div>
    </section>
  );
}
