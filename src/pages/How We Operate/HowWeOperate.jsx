import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import img1 from "../../assets/imagesOfHowWeOperate/ima1.jpeg";
import img2 from "../../assets/imagesOfHowWeOperate/ima2.jpeg";
import img3 from "../../assets/imagesOfHowWeOperate/ima3.jpeg";
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
      {/* Volunteer Services Section */}
      <section className="text-center px-4 py-12 bg-white">
        <h2 className="text-3xl font-bold mb-4">{t("VOLUNTEER_SERVICES")}</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-4">
          At Saayam for All, we connect individuals who need assistance with
          compassionate volunteers ready to help.
        </p>
        <p className="text-gray-700 max-w-3xl mx-auto mb-10">
          Whether it&apos;s delivering groceries, providing companionship, or
          supporting small everyday tasks, our volunteers make a real
          difference—one request at a time. We believe in building a community
          where help is just a request away.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <img
            src={img1}
            alt="Grocery Delivery"
            className="rounded-xl object-cover h-64 w-full"
          />
          <img
            src={img2}
            alt="Group Volunteering"
            className="rounded-xl object-cover h-64 w-full"
          />
          <img
            src={img3}
            alt="Beach Cleanup"
            className="rounded-xl object-cover h-64 w-full"
          />
        </div>
      </section>
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            {t("HOW_WE_OPERATE")}
          </h2>
          <p className="text-center text-gray-600 mb-12">
            At Saayam For All, getting help is as simple and seamless as
            requesting a ride.
            <br />
            Get help in 5 easy steps.
          </p>

          <div className="relative h-full min-h-[800px]">
            {/* Animated line */}
            <div
              className="absolute left-1/2 top-28 transform -translate-x-1/2 w-0.5 border-l-2 border-dashed border-blue-300 z-10"
              ref={timelineRef}
            />

            {/* Timeline content */}
            <div className="step-box">
              <TimelineItem
                number={1}
                title="Request for Help"
                description="Submit a request for the support you need—just like booking a ride through an app."
                image={img4}
                align="right"
              />

              <TimelineItem
                number={2}
                title=" Get Matching With a Volunteer"
                description="We don't just match—you get the smartest match possible.Our AI/ML engine find the right volunteer for you faster and more accuately, just like a ride share app- but smarter, more human, built for community care ."
                image={img5}
                align="left"
              />

              <TimelineItem
                number={3}
                title="Confirm Your Volunteer"
                description="From these potential matches, one volunteer will be chosen to assist you, much like selecting a specific car."
                image={img6}
                align="right"
              />

              <TimelineItem
                number={4}
                title="Connect and Coordinate"
                description="Your volunteer reaches out to finalize details and schedule the support you need."
                image={img7}
                align="left"
              />

              <TimelineItem
                number={5}
                title="Receive Assistance"
                description="The volunteer provides the help you requested,working with other if needed-making sure you reach your destination."
                image={img8}
                align="right"
              />
            </div>
          </div>
          {/* End marker text – line will stop here */}
          <div className="text-center mt-32">
            <span className="text-blue-500 text-2xl font-bold">
              Connecting help to those who need it.
            </span>
          </div>
          <div className="text-center mt-32">
            <h3 className="text-2xl font-bold mb-4">
              Looking to volunteer with us?
            </h3>
            <p className="text-gray-600 mb-6">
              Chat with our community and get in touch with us!
            </p>
            <button
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => navigate("/Contact")}
            >
              Join the community
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ number, title, description, image, align }) => {
  const isRight = align === "right";
  return (
    <div
      className={`relative flex flex-col sm:flex-row ${
        isRight ? "sm:flex-row-reverse" : ""
      } items-center mb-16`}
    >
      {/* Overlapping blue background (visible on desktop and mobile) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/4 h-72 sm:h-64 bg-blue-50 rounded-2xl z-0" />

      {/* Image - always on top for mobile, left/right for desktop */}
      <div className="w-full sm:w-1/2 flex justify-center z-10 mb-6 sm:mb-0 order-1 sm:order-none">
        {image && (
          <img
            src={image}
            alt={title}
            className="rounded-xl object-cover h-40 sm:h-60 lg:h-60"
          />
        )}
      </div>

      {/* Step number – centered on blue background for mobile and desktop */}
      <div className="z-20 mb-4 sm:mb-0 absolute left-1/2 top-[88px] sm:static sm:left-auto sm:top-auto sm:transform-none -translate-x-1/2">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg">
          {number}
        </div>
      </div>

      {/* Text */}
      <div
        className={`w-full sm:w-1/2 z-10 flex order-2 sm:order-none ${
          isRight
            ? "sm:pl-16 sm:justify-start sm:-translate-x-12"
            : "sm:pr-16 sm:justify-end sm:translate-x-12"
        }`}
      >
        <div className="my-auto text-center sm:text-left px-4 sm:px-0">
          <h3 className="text-xl font-bold leading-tight mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
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
