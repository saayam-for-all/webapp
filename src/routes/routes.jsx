import Directors from "../pages/Directors/Directors";
import LandingPage from "../pages/LandingPage/LandingPage";
import Donate from "../pages/Donate/Donate";
import HowWeOperate from "../pages/How We Operate/HowWeOperate";
import Mission from "../pages/Mission/Mission";
import Vision from "../pages/Vision/Vision";
import Contact from "../pages/Contact/Contact";
import PostLogin from "../pages/PostLogin/PostLogin";


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
		path: "mission",
		element: <Mission />,
	},
	,
	{
		path: "vision",
		element: <Vision />,
	},
	{
		path: "contact",
		element: <Contact />,
	},
	{
		path: "dashboard",
		element: <PostLogin />,
	  },
];

export default routes;
