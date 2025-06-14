import { useEffect } from "react";
import { MissionHero } from "./MissionHero";
import { Mission } from "./Mission";
import { Vision } from "./Vision";
import { JoinCTA } from "./JoinCTA";

export default function OurMission() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Mission />
      <MissionHero />
      <Vision />
      <JoinCTA />
    </>
  );
}
