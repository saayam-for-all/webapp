import "./LandingPage.css";
import { useTranslation } from "react-i18next";
//import Carousel from "./components/Carousel";
import HeroSection from "./components/HeroSection";
import Info from "./components/Info";
import { EmblaCarousel } from "./components/emblacarousel";

export default function Home() {
	const { t } = useTranslation();

	return (
		<div>
			<EmblaCarousel/>
			{/* <div className='w-[85%] mx-auto'>
				<Carousel />
			</div> */}
			<HeroSection />
			<Info />
		</div>
	);
}
