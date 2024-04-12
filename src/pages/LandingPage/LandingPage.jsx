import "./LandingPage.css";
import Home_Component_1 from "./components/HomePage_Component_1";
// import Home_Component_2 from '../components/HomePage_Component_2'
// import Home_Component_3 from '../components/HomePage_Comonent_3'
// import Home_Component_4 from '../components/HomePage_component_4'
import { useTranslation } from "react-i18next";

export default function Home() {
	const { t } = useTranslation();

	return (
		<>
			<h1>Hi</h1>
			{/* <Home_Component_1 /> */}
		</>
	);
}
