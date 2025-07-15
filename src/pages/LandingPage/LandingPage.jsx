import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import bannerImageOne from "../../assets/landingPageImages/bannerImageOne.jpg";
import bannerImageThree from "../../assets/landingPageImages/bannerImageThree.jpg";
import bannerImageTwo from "../../assets/landingPageImages/bannerImageTwo.jpg";
import bottomFour from "../../assets/landingPageImages/bottomFour.jpg";
import bottomOne from "../../assets/landingPageImages/bottomOne.jpg";
import bottomThree from "../../assets/landingPageImages/bottomThree.jpg";
import bottomTwo from "../../assets/landingPageImages/bottomTwo.jpg";
import collabFive from "../../assets/landingPageImages/collab_five.jpg";
import collabFour from "../../assets/landingPageImages/collab_four.jpg";
import collabOne from "../../assets/landingPageImages/collab_one.jpg";
import collabSeven from "../../assets/landingPageImages/collab_seven.jpg";
import collabSix from "../../assets/landingPageImages/collab_six.jpg";
import collabThree from "../../assets/landingPageImages/collab_three.jpg";
import collabTwo from "../../assets/landingPageImages/collab_two.jpg";
import topOne from "../../assets/landingPageImages/topOne.jpg";
import topTwo from "../../assets/landingPageImages/topTwo.jpg";
import "./LandingPage.css";
import Carousel from "./components/Carousel";

export default function Home() {
  const navigate = useNavigate();
  const videoId = "zupN0-zXrLQ";
  const { t, i18n } = useTranslation();

  // Get the current language and map it to YouTube language codes
  const getYouTubeLanguageCode = (language) => {
    // Extract base language code (remove region code if present)
    const baseLanguage = language ? language.split("-")[0] : "en";

    const languageMap = {
      en: "en",
      es: "es",
      fr: "fr",
      de: "de",
      pt: "pt",
      ru: "ru",
      zh: "zh",
      hi: "hi",
      bn: "bn",
      te: "te",
    };
    return languageMap[baseLanguage] || "en"; // Default to English if language not supported
  };

  const currentLanguage = getYouTubeLanguageCode(i18n.language);

  // uncomment this for debugging
  // console.log("Current i18n language:", i18n.language);
  // console.log("Mapped YouTube language:", currentLanguage);
  // console.log(
  //   "YouTube URL:",
  //   `https://www.youtube.com/embed/${videoId}?controls=1&rel=0&hl=${currentLanguage}&cc_lang_pref=${currentLanguage}`,
  // );

  return (
    <div className="w-full overflow-hidden">
      <div className="w-full">
        <div className="w-full flex flex-col items-center justify-center">
          <div className="text-sm md:text-lg text-gray-600 mb-[30px] md:mb-[50px] mt-[20px]">
            {t("Real help. Real people. Right when you need it.")}
          </div>
          <h1 className="font-bold text-3xl md:text-6xl tracking-wide mb-[30px] md:mb-[50px]">
            {t("Need help? Here to help?")}
          </h1>
          <div className="w-3/4 md:w-1/4 text-sm md:text-lg text-gray-600 m-auto mb-[40px] text-center">
            {t(
              "At Saayam for All, your support can make a real difference today.",
            )}
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row justify-center  ">
        <div className="w-[22%] h-[50%] flex flex-col justify-center items-center">
          <img
            src={bannerImageOne}
            className="aspect-[.77] w-full object-cover object-center rounded-[10px]"
            alt={t("SARVE_JANA_SUKHINO_BHAVANTU_ALT")}
          />
          <h3 className="w-3/4 font-bold text-xl md:text-2xl md:tracking-wide m-[10px] text-center">
            {t("Sarve jana sukhino bhavantu")}
          </h3>
          <div className="text-xs md:text-sm md:text-lg text-gray-600 text-center">
            {t("May all live happily.")}
          </div>
        </div>
        <div className="w-[33%] h-full flex flex-col justify-center items-center">
          <img
            src={bannerImageTwo}
            className="aspect-square w-[90%] object-cover object-center rounded-[10px] mt-[15%]"
            alt={t("JNANAM_VARDHATI_SANCHAYAT_ALT")}
          />
          <h3 className="font-bold text-xl md:text-2xl tracking-wide m-[10px] text-center">
            {t("jñānam vardhati sanchayāt")}
          </h3>
          <div className="text-xs md:text-sm  md:text-lg text-gray-600 text-center">
            {t(
              "Sharing knowledge expands one's own understanding and the knowledge of others.",
            )}
          </div>
        </div>
        <div className="w-[22%] h-full flex flex-col justify-center items-center">
          <img
            src={bannerImageThree}
            className="aspect-[.77] w-full object-cover object-center rounded-[10px]"
            alt={t("MANAVA_SEVAYE_MADHAVA_SEVA_ALT")}
          />
          <h3 className="w-3/4 font-bold text-xl md:text-2xl tracking-wide m-[10px] text-center">
            {t("Manava sevaye Madhava seva")}
          </h3>
          <div className="text-xs md:text-sm md:text-lg text-gray-600 text-center w-2/3">
            {t("Service to mankind is Service to God.")}
          </div>
        </div>
      </div>

      <Carousel />
      <div className="relative w-full flex flex-col overflow-hidden items-center mb-[25px] md:mb-[50px]">
        <h3 className="font-bold text-3xl md:text-4xl md:mb-[40px]">
          {t("Our Collaborators")}
        </h3>

        {/* Hid collaborators until we get permission from them all*/}
        <div className="w-full flex flex-row overflow-hidden hidden">
          <div className="scroll imgBox">
            <div>
              <img src={collabOne} className="w-[150px] ml-[75px]"></img>
              <img src={collabTwo}></img>
              <img src={collabThree} className="w-[200px]"></img>
              <img src={collabFour}></img>
              <img src={collabFive}></img>
              <img src={collabSix} className="w-[200px]"></img>
              <img src={collabSeven} className="w-[125px]"></img>
            </div>
            <div>
              <img src={collabOne} className="w-[150px] ml-[75px]"></img>
              <img src={collabTwo}></img>
              <img src={collabThree} className="w-[200px]"></img>
              <img src={collabFour}></img>
              <img src={collabFive}></img>
              <img src={collabSix} className="w-[200px]"></img>
              <img src={collabSeven} className="w-[125px]"></img>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center bg-white h-auto md:h-80 mt-5 gap-10 mb-[40px] md:mb-[100px] px-4 md:px-0">
        <div className="flex flex-col justify-start items-start w-full md:w-3/5 p-4 md:p-10 h-auto md:h-full">
          <h3 className="font-bold text-2xl md:text-4xl md:h-1/3 w-full md:w-3/4 mb-4 md:mb-[30px]">
            {t("Creating a World Where Help is Always Within Reach")}
          </h3>
          <p className="text-base md:text-lg text-gray-500 md:h-1/3">
            {t(
              "Through our global network of volunteers and donors, we empower communities to support one another, fostering a culture of compassion and solidarity that transcends geographical boundaries.",
            )}
          </p>
          <button
            className="mt-6 md:mt-10 text-sm text-blue-500 hover:text-blue-600 hover:underline"
            onClick={() => navigate("/our-mission")}
          >
            {t("Our Mission")} →
          </button>
        </div>
        <div className="flex flex-row w-full md:w-2/5 h-auto md:h-full gap-4 md:gap-5 overflow-hidden justify-center">
          <img
            className="w-[45%] md:w-1/2 h-[180px] md:h-auto rounded-2xl md:rounded-md object-cover ml-[10px] border-2"
            src={topOne}
            alt={t("LANDING_IMAGE_ALT_1")}
          />
          <img
            className="w-[45%] md:w-1/2 h-[180px] md:h-auto rounded-2xl md:rounded-md object-cover"
            src={topTwo}
            alt={t("LANDING_IMAGE_ALT_2")}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center bg-white h-auto md:h-80 mt-5 gap-10 mb-[40px] md:mb-[100px] px-4 md:px-0">
        <div className="order-1 md:order-2 flex flex-col justify-start items-start w-full md:w-1/2 p-4 md:p-10 h-auto md:h-full">
          <h3 className="font-bold text-2xl md:text-4xl w-full md:w-2/3 pb-4 md:pb-5">
            {t("How We Operate")}
          </h3>
          <p className="text-base md:text-lg text-gray-500">
            {t(
              "Watch our 5 minute video to understand how Saayam for All works and how we make a difference.",
            )}
          </p>
          <button
            className="mt-6 md:mt-10 text-sm text-blue-500 hover:text-blue-600 hover:underline"
            onClick={() => navigate("/how-we-operate")}
          >
            {t("Learn More")} →
          </button>
        </div>

        {/* Video Section - Second on mobile, first on desktop */}
        <div className="order-2 md:order-1 w-full md:w-1/2 h-[200px] md:h-full flex justify-center md:justify-start overflow-hidden md:ml-5">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?controls=1&rel=0&hl=${currentLanguage}&cc_lang_pref=${currentLanguage}`}
            title={t("YOUTUBE_VIDEO_TITLE")}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            className="landing-iframe "
          ></iframe>
        </div>
      </div>

      <div className="bg-gray-100 flex flex-col w-full items-center justify-center">
        <h1 className="w-[90%] font-bold text-3xl md:text-4xl tracking-wide mb-[25px] mt-[25px] md:mb-[50px] md:mt-[50px] text-center">
          {t("One Platform. Many Ways to Contribute.")}
        </h1>
        <div className="w-[90%] md:w-[60%] text-sm md:text-lg text-black mb-[20px] md:mb-[40px] text-center">
          {t(
            "Learn about different roles in our ecosystem and how each one contributes to creating an impact.",
          )}
        </div>
        <div className="w-[75%] md:w-[80%] flex flex-riw items-center justify-center gap-2 md:gap-5 mb-[35px] md:mb-[75px]">
          {[bottomOne, bottomTwo, bottomThree, bottomFour].map((src, i) => (
            <div
              key={`bottom-image-${i}`}
              className="w-[30%] md:w-1/4 h-[400px] rounded-[10px] bg-cover bg-center"
              style={{ backgroundImage: `url(${src})` }}
            >
              <div className="w-full h-full bg-gray-800 bg-opacity-50 rounded-[10px] flex flex-col items-center justify-around gap-[10%] md:gap-[30%]">
                <h3 className="w-full text-white font-bold text-l md:text-2xl tracking-wide m-[5px] md:m-[10px] text-center">
                  {t(
                    [
                      "Beneficiaries",
                      "Volunteers",
                      "Voluntary Organizations",
                      "Donors",
                    ][i],
                  )}
                </h3>
                <h6 className="w-full text-white text-l md:text-xl tracking-wide m-[10px] text-center">
                  {t(
                    [
                      "Receive help for their requests",
                      "Provide guidance and solutions to beneficiaries",
                      "Offer necessary support to beneficiaries",
                      "Provide financial assistance to voluntary organization",
                    ][i],
                  )}
                </h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
