import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import "./LandingPage.css";
import Carousel from "./components/Carousel";

export default function Home() {
  const { user } = useSelector((state) => state.auth);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null) {
      navigate("/dashboard");
    }
  }, [user]);

  useEffect(() => {
    const handleResize = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const videoId = "9CBLVoSSuwM";
  const cards = [
    {
      text: "Take help from our Volunteers",
      image:
        "https://platform.theverge.com/wp-content/uploads/sites/2/2025/03/STK093_GOOGLE_E.jpg?quality=90&strip=all&crop=0%2C0%2C100%2C100&w=2400",
    },
    {
      text: "Planning and budgeting advice for travel",
      image:
        "https://platform.theverge.com/wp-content/uploads/sites/2/2025/03/STK093_GOOGLE_E.jpg?quality=90&strip=all&crop=0%2C0%2C100%2C100&w=2400",
    },
    {
      text: "A whole new community of charity organisations",
      image:
        "https://platform.theverge.com/wp-content/uploads/sites/2/2025/03/STK093_GOOGLE_E.jpg?quality=90&strip=all&crop=0%2C0%2C100%2C100&w=2400",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="video-section">
        <div className="video-overlay flex flex-col justify-center">
          <div className="flex flex-col items-end justify-end">
            <p className="landing-title">Sayaam For All</p>
            <h6 className="landing-subtitle">
              Connecting Help to those who need it
            </h6>
          </div>
          <button
            className="text-white bg-blue-500 hover:bg-blue-700 rounded-lg px-8 py-2 text-lg hover:underline"
            onClick={() => navigate("/login")}
          >
            Join the Community
          </button>
        </div>
        <div className="video-wrapper">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${videoId}`}
            title="YouTube Video"
            allow="autoplay"
          ></iframe>
        </div>
      </section>

      {/* First Section */}
      <div className="flex flex-row items-center bg-white h-96 mt-5 gap-10">
        <div className="flex flex-col justify-start items-start w-3/5 p-10 h-full">
          <h3 className="font-bold text-3xl h-1/3 w-2/3">
            Creating a World Where Help is Always Within Reach
          </h3>
          <p className="h-1/3 text-lg text-gray-500">
            Through our global network of volunteers and donors, we empower
            communities to support one another, fostering a culture of
            compassion and solidarity that transcends geographical boundaries.
          </p>
          <button
            className="mt-10 text-sm text-gray-500 hover:text-blue-500 hover:underline"
            onClick={() => navigate("/how-we-operate")}
          >
            How We Operate &rarr;
          </button>
        </div>
        <div className="flex flex-row w-1/3 h-full gap-5">
          <img
            className="w-1/2 rounded-lg"
            src="https://platform.theverge.com/wp-content/uploads/sites/2/2025/03/STK093_GOOGLE_E.jpg?quality=90&strip=all&crop=0%2C0%2C100%2C100&w=2400"
            alt="Help 1"
          />
          <img
            className="w-1/2 rounded-lg"
            src="https://platform.theverge.com/wp-content/uploads/sites/2/2025/03/STK093_GOOGLE_E.jpg?quality=90&strip=all&crop=0%2C0%2C100%2C100&w=2400"
            alt="Help 2"
          />
        </div>
      </div>

      {/* Carousel Section */}
      <Carousel />

      {/* Community Section */}
      <div className="community-container">
        <div className="cards-section">
          {cards.map((card, index) => (
            <div
              key={index}
              className="community-card"
              style={{
                backgroundImage: `url(${card.image})`,
                marginTop: `${index * 120}px`,
              }}
            >
              <div className="card-overlay">{card.text}</div>
            </div>
          ))}
        </div>

        <div className="text-section">
          <h2>Discover our community</h2>
          <p>
            Chat with our community and get in touch with different charity
            organisations!
          </p>
          <button className="join-btn" onClick={() => navigate("/login")}>
            Join the community
          </button>
        </div>
      </div>
    </div>
  );
}
