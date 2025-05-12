import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import banner from "../../assets/landingPageImages/bannerImage.jpg";
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
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const videoId = "9CBLVoSSuwM";

  useEffect(() => {
    if (user !== null) {
      navigate("/dashboard");
    }
  }, [user]);

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <div className="landing-banner-container flex flex-row p-5 justify-between">
        <div className="w-1/2 h-full flex flex-row justify-center">
          <div className="w-3/4 h-full flex flex-col gap-10">
            <div className="text-lg text-gray-400">
              Real help. Real people. Right when you need it.
            </div>
            <h1 className="font-bold text-6xl tracking-wide">
              Here to help or hoping for help?
            </h1>
            <div className="text-lg text-gray-500">
              At Saayam for All, your support can make a real difference today.
            </div>
            <button className="join-btn" onClick={() => navigate("/contact")}>
              Join the community
            </button>
          </div>
        </div>
        <div className="w-1/2 h-full flex flex-col justify-center items-center">
          <img src={banner} className="w-4/5"></img>
        </div>
      </div>
      <Carousel />
      <div className="w-full flex flex-col items-center mt-[100px] mb-[100px]">
        <h3 className="font-bold text-4xl pb-5">Our Collaborators</h3>
        <div className="w-full flex flex-row justify-center gap-20 items-center">
          <img src={collabOne} className="w-[100px] h-fit"></img>
          <img src={collabTwo} className="w-[100px] h-fit"></img>
          <img src={collabThree} className="w-[80px] h-fit"></img>
          <img src={collabFour} className="w-[100px] h-fit"></img>
          <img src={collabFive} className="w-[100px] h-fit"></img>
          <img src={collabSix} className="w-[140px] h-fit"></img>
          <img src={collabSeven} className="w-[70px] h-fit"></img>
        </div>
      </div>
      {/* First Section */}
      <div className="flex flex-row items-center bg-white h-80 mt-5 gap-10 mb-[100px]">
        <div className="flex flex-col justify-start items-start w-3/5 p-10 h-full">
          <h3 className="font-bold text-4xl h-1/3 w-3/4 mb-[30px]">
            Creating a World Where Help is Always Within Reach
          </h3>
          <p className="h-1/3 text-lg text-gray-500">
            Through our global network of volunteers and donors, we empower
            communities to support one another, fostering a culture of
            compassion and solidarity that transcends geographical boundaries.
          </p>
          <button
            className="mt-10 text-sm text-blue-500 hover:text-blue-600 hover:underline "
            onClick={() => navigate("/our-mission")}
          >
            Our Mission &rarr;
          </button>
        </div>
        <div className="flex flex-row w-2/5 h-full gap-5 overflow-hidden">
          <img
            className="w-1/2 rounded-lg"
            src={topOne}
            alt="A sunny day with two people looking at each other comfortingly"
          />
          <img
            className="w-1/2 rounded-lg"
            src={topTwo}
            alt="A joyful family stands in a lush field on a sunny day"
          />
        </div>
      </div>

      <div className="flex flex-row items-center bg-white h-80 mt-5 gap-10 mb-[100px]">
        <div className="flex flex-row w-1/2 h-full gap-5 overflow-hidden ml-5">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0`}
            title="YouTube Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;fullscreen"
            className="landing-iframe"
          ></iframe>
        </div>
        <div className="flex flex-col justify-start items-start w-1/2 p-10 h-full">
          <h3 className="font-bold text-4xl h-1/3 w-2/3 pb-5">
            How We Operate
          </h3>
          <p className="h-1/3 text-lg text-gray-500">
            Watch our 5 minute video to understand how Saayam for All works and
            how we make a difference.
          </p>
          <button
            className="mt-10 text-sm text-blue-500 hover:text-blue-600 hover:underline"
            onClick={() => navigate("/how-we-operate")}
          >
            Learn More &rarr;
          </button>
        </div>
      </div>

      {/* Community Section */}
      <div className="flex flex-row mt-5 mb-[100px]">
        <div className="w-1/3 flex flex-row justify-end mt-[75px] mr-2">
          <div className="relative w-[200px] h-[300px] rounded-[25px] overflow-hidden">
            <img
              src={bottomOne}
              alt={"Red rescue jacket and cap with Red Cross logos"}
              class="absolute w-full h-full object-cover"
            />

            <div class="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
              <div class="border-2 border-white rounded-[25px] w-full h-full p-5 mr-2 mt-2">
                <p class="text-white text-lg font-bold text-center">
                  Take help from our Volunteers
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-2/3">
          <div className="w-full h-fit flex flex-col pl-[200px]">
            <h3 className="font-bold text-4xl h-1/3 w-2/3">
              Discover Our Community
            </h3>
            <p className="text-lg text-gray-500 pb-4 pt-[30px] w-4/5">
              Chat with our community and get in touch with different charity
              organizations!
            </p>
            <button className="join-btn" onClick={() => navigate("/contact")}>
              Join the community
            </button>
          </div>
          <div className="flex flex-row h-3/4">
            <div className="relative w-[200px] h-[300px] rounded-[25px] overflow-hidden mt-[50px] mr-2">
              <img
                src={bottomTwo}
                alt={
                  "A woman with a backpack walks down a narrow, cobblestone alley between colorful, old buildings"
                }
                class="absolute w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
                <div className="border-2 border-white rounded-[25px] w-full h-full p-5 mr-2 mt-2">
                  <p className="text-white text-lg font-bold text-center">
                    Planning and budgeting advice for travel
                  </p>
                </div>
              </div>
            </div>
            <div className="relative w-[200px] h-[300px] rounded-[25px] overflow-hidden mt-[175px]">
              <img
                src={bottomThree}
                alt={
                  "A woman with a backpack walks down a narrow, cobblestone alley between colorful, old buildings"
                }
                class="absolute w-full h-full object-cover"
              />

              <div class="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
                <div class="border-2 border-white rounded-[25px] w-full h-full p-5 mr-2 mt-2">
                  <p class="text-white text-lg font-bold text-center">
                    Woman hiking at sunset with a backpack and trekking poles,
                    set against a mountainous landscape
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
