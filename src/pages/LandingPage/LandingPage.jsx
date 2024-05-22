import "./LandingPage.css";
import { useTranslation } from "react-i18next";
import HeroSection from "./components/HeroSection";
import Info from "./components/Info";
import Images from "./components/Dynamic_img"


export default function Home() {
	// const { t } = useTranslation();

	return (
		<div>
			<Images/>
			<HeroSection />
			<Info />
		</div>
	);
}
