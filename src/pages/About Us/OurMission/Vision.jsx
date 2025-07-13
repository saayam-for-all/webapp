import { useTranslation } from "react-i18next";
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
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/9e489c91f28508597741986fff385e42dcf07f04"
            alt="Vision image 1"
            className="object-cover h-[150px] w-full rounded-tl-[20px]"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/96f2577da3ff33600f091becd5353f37e9ec91fd"
            alt="Vision image 2"
            className="object-cover h-[210px] w-full rounded-tr-[20px]"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d69a9a1b73ece3f214ca700fdad2926ac86ffb47"
            alt="Vision image 3"
            className="object-cover h-[150px] w-full mt-[-50px] rounded-bl-[20px]"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/7eed748020e8f83d968948c1754918c0f51ff363"
            alt="Vision image 4"
            className="object-cover h-[100px] w-full rounded-br-[20px]"
          />
        </div>
      </div>
    </section>
  );
}
