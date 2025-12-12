import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import img4 from "../../assets/imagesOfHowWeOperate/step1.png";
import img5 from "../../assets/imagesOfHowWeOperate/step2.png";
import img6 from "../../assets/imagesOfHowWeOperate/step3.png";
import img7 from "../../assets/imagesOfHowWeOperate/step4.png";
import img8 from "../../assets/imagesOfHowWeOperate/step5.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HowWeOperate = () => {
  const timelineRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const line = timelineRef.current;
      if (!line) return;

      // Calculate scroll percentage using document and body scroll properties
      const docElement = document.documentElement;
      const body = document.body;
      const scrollTop = docElement.scrollTop || body.scrollTop;
      const scrollHeight = docElement.scrollHeight || body.scrollHeight;
      const clientHeight = docElement.clientHeight;

      // Calculate the scroll percentage
      const scrollPercentage =
        (scrollTop / (scrollHeight - clientHeight)) * 100;

      // Normalize the percentage to be between 0 and 1
      const normalizedPercentage = Math.max(
        0,
        Math.min(1, scrollPercentage / 100),
      );

      // Set the animated line's height as a percentage of its parent
      line.style.height = `${normalizedPercentage * 100}%`;
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className="font-sans">
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            {t("HOW_WE_OPERATE")}
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {t(
              "At Saayam For All, getting help is as simple and seamless as requesting a ride.",
            )}
            <br />
            {t("Get help in 5 easy steps.")}
          </p>

          <div className="relative h-full min-h-[800px]">
            {/* Animated line */}
            <div
              className="absolute left-1/2 top-32 md:top-32 lg:top-36 transform -translate-x-1/2 w-0.5 border-l-2 border-dashed border-blue-300 z-10"
              ref={timelineRef}
            />

            {/* Timeline content */}
            <div className="step-box">
              <TimelineItem
                number={1}
                title={t("Request for Help")}
                description={t(
                  "Submit a request for the support you need—just like booking a ride through an app.",
                )}
                image={img4}
                align="left"
              />

              <TimelineItem
                number={2}
                title={t("Get Matching With a Volunteer")}
                description={t(
                  "We don't just match—you get the smartest match possible.Our AI/ML engine find the right volunteer for you faster and more accuately, just like a ride share app- but smarter, more human, built for community care .",
                )}
                image={img5}
                align="right"
              />

              <TimelineItem
                number={3}
                title={t("Confirm Your Volunteer")}
                description={t(
                  "From these potential matches, one volunteer will be chosen to assist you, much like selecting a specific car.",
                )}
                image={img6}
                align="left"
              />

              <TimelineItem
                number={4}
                title={t("Connect and Coordinate")}
                description={t(
                  "Your volunteer reaches out to finalize details and schedule the support you need.",
                )}
                image={img7}
                align="right"
              />

              <TimelineItem
                number={5}
                title={t("Receive Assistance")}
                description={t(
                  "The volunteer provides the help you requested,working with other if needed-making sure you reach your destination.",
                )}
                image={img8}
                align="left"
              />
            </div>
          </div>
          {/* End marker text – line will stop here */}
          <div className="text-center mt-32">
            <span className="text-blue-500 text-2xl font-bold">
              {t("Connecting help to those who need it.")}
            </span>
          </div>
          <div className="text-center mt-32">
            <h3 className="text-2xl font-bold mb-4">
              {t("Looking to volunteer with us?")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("Chat with our community and get in touch with us!")}
            </p>
            <button
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => navigate("/Contact")}
            >
              {t("Join the community")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ number, title, description, image, align }) => {
  const isTextOnRight = align === "right";

  return (
    <div
      className={`relative flex flex-col sm:flex-row ${
        isTextOnRight ? "" : "sm:flex-row-reverse"
      } items-stretch justify-center mb-12 sm:mb-20 md:mb-24`}
    >
      {/* Image Container: takes 50% width on sm screens. Inner padding adjusts for step number. */}
      <div
        className={`w-full sm:w-1/2 flex justify-center items-center order-1 sm:order-none mb-4 sm:mb-0
                    ${isTextOnRight ? "sm:pr-[1.5rem]" : "sm:pl-[1.5rem]"} p-2`}
      >
        {image && (
          <img
            src={image}
            alt={title}
            className="rounded-xl object-contain h-auto sm:max-h-64 md:max-h-72 lg:max-h-80 w-auto max-w-full"
          />
        )}
      </div>

      {/* Step Number: In flow for mobile (order-2), absolute centered for sm+ */}
      <div className="order-2 sm:absolute sm:left-1/2 sm:top-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 z-20 my-3 sm:my-0 flex justify-center">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
          {number}
        </div>
      </div>

      {/* Text Content Container: takes 50% width on sm screens. Inner padding adjusts for step number. */}
      <div
        className={`w-full sm:w-1/2 flex items-stretch order-3 sm:order-none p-2 ${
          isTextOnRight ? "sm:pl-0" : "sm:pr-0"
        }`}
      >
        <div className="bg-blue-50 rounded-2xl p-6 sm:p-8 md:p-10 w-full flex flex-col justify-center">
          <h3 className="text-lg md:text-xl font-bold leading-tight mb-2 text-left">
            {title}
          </h3>
          <p className="text-sm md:text-base text-gray-600 text-left">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

TimelineItem.propTypes = {
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string,
  align: PropTypes.oneOf(["left", "right"]).isRequired,
};

export default HowWeOperate;
