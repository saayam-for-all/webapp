import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import HeroSection from "./components/HeroSection";
import Info from "./components/Info";
import Images from "./components/Dynamic_img";

import "./LandingPage.css";

export default function Home() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null) {
      navigate("/dashboard");
    }
  }, [user]);

  return (
    <div>
      <Images />
      <HeroSection />
      <Info />
    </div>
  );
}
