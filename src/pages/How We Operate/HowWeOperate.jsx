import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import img1 from "../../assets/imagesOfHowWePperate/Image1.jpeg";
import img2 from "../../assets/imagesOfHowWePperate/Image2.jpeg";
import img3 from "../../assets/imagesOfHowWePperate/Image3.jpeg";
import img4 from "../../assets/imagesOfHowWePperate/Image4.png";
import img5 from "../../assets/imagesOfHowWePperate/Image5.png";
import img6 from "../../assets/imagesOfHowWePperate/Image6.png";
import img7 from "../../assets/imagesOfHowWePperate/Image7.png";
import img8 from "../../assets/imagesOfHowWePperate/Image8.png";
import { useNavigate } from "react-router-dom";

const HowWeOperate = () => {
  const timelineRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;

      const timeline = timelineRef.current;
      const timelineTop = timeline.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      // Calculate how much of the timeline should be revealed based on scroll position
      const scrollPercentage = Math.max(
        0,
        Math.min(
          1,
          1 - (timelineTop - windowHeight * 0.2) / (windowHeight * 0.8),
        ),
      );

      timeline.style.height = `${scrollPercentage * 100}%`;
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="font-sans">
      {/* Volunteer Services Section */}
      <section className="text-center px-4 py-12 bg-white">
        <h2 className="text-3xl font-bold mb-4">Volunteer Services</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-4">
          At Saayam for All, we connect individuals who need assistance with
          compassionate volunteers ready to help.
        </p>
        <p className="text-gray-700 max-w-3xl mx-auto mb-10">
          Whether it's delivering groceries, providing companionship, or
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
            How We Operate
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
              className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 w-0.5 border-l-2 border-dashed border-blue-300 z-0"
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
                description="We don’t just match—you get the smartest match possible.Our AI/ML engine find the right volunteer for you faster and more accuately, just like a ride share app- but smarter, more human, built for community care ."
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
              <div className="absolute left-1/2 bottom-[-60px] transform -translate-x-1/2 text-blue-600 font-semibold text-2xl tracking-wide text-center">
                Connecting help to those who need it.
              </div>
            </div>
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
    <div className={`flex items-center ${isRight ? "flex-row-reverse" : ""}`}>
      <div className="w-1/2 flex justify-center">
        {image && (
          <img
            src={image}
            alt={title}
            className="rounded-xl object-cover h-60"
          />
        )}
      </div>

      {/* Blue circle with number */}
      <div className="z-10 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
        {number}
      </div>
      <div
        className={`w-1/2 ${isRight ? "pl-8" : "pr-8"} ${isRight ? "text-left" : "text-right"}`}
      >
        <div
          className={`flex items-center ${isRight ? "" : "justify-end"} gap-4`}
        >
          <div className="text-left">
            <h3 className="text-xl font-bold leading-tight">{title}</h3>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
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
