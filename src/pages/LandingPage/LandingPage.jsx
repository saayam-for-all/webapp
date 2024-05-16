import "./LandingPage.css";
import HeroSection from "./components/HeroSection";
import Info from "./components/Info";
import Images from "./components/Dynamic_img.jsx";

export default function Home() {
	// const { t } = useTranslation();

	return (
		<div>
			<myElement/>
			<Images/>
			<HeroSection />
			<Info />
		</div>
	);
}
