import Directors from "../pages/Directors/Directors";
import LandingPage from "../pages/LandingPage/LandingPage";
import Donate from "../pages/Donate/Donate";
import HowWeOperate from "../pages/How We Operate/HowWeOperate";
import MissionVision from "../pages/MissionVisioin/MissionVision";
import Contact from "../pages/Contact/Contact";
import Login from "../pages/Login/Login";

const routes = [
	{
		path: "",
		element: <LandingPage />,
	},
	{
		path: "directors",
		element: <Directors />,
	},
	{
		path: "donate",
		element: <Donate />,
	},
	{
		path: "how-we-operate",
		element: <HowWeOperate />,
	},
	{
		path: "mission-and-vision",
		element: <MissionVision />,
	},
	{
		path: "contact",
		element: <Contact />,
	},
	{
		path:"login",
		element: <Login />,
	}
];

export default routes;
