import Directors from "../pages/Directors/Directors";
import LandingPage from "../pages/LandingPage/LandingPage";
import Donation from "../pages/Donation/Donation";

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
		path: "donation",
		element: <Donation />,
	},
];

export default routes;
