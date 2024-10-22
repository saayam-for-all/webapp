import Directors from "../pages/Directors/Directors";
import LandingPage from "../pages/LandingPage/LandingPage";
import Donate from "../pages/Donate/Donate";
import HowWeOperate from "../pages/How We Operate/HowWeOperate";
import Mission from "../pages/Mission/Mission";
import Vision from "../pages/Vision/Vision";
import Contact from "../pages/Contact/Contact";
import Dashboard from "../pages/Dashboard/Dashboard";
import RequestDetails from "../pages/RequestDetails/RequestDetails";
import ProtectedRoute from "./ProtectedRoute";
import HelpRequestForm from "../pages/HelpRequest/HelpRequestForm";
import PromoteToVolunteer from "../pages/Volunteer/PromoteToVolunteer";
import Profile from "../pages/Profile/Profile";
import VoluntaryOrganizations from "../pages/RequestDetails/VoluntaryOrganizations";
import OrganizationDetails from '../pages/RequestDetails/OrganizationDetails';

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
    element: <Dashboard />,
  },
  {
    path: "request/:id",
    element: <RequestDetails />,
  },
  {
    path: "request",
    element: <HelpRequestForm />,
  },
  {
    path: "promote-to-volunteer",
    element: <PromoteToVolunteer />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
  {
    path: "voluntary-organizations",
    element: <VoluntaryOrganizations />,
  },
  {
    path: "organization/:id",
    element: <OrganizationDetails />,
  },
];

export default routes;

