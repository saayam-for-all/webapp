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
import { element } from "prop-types";
import HelpRequestForm from "../pages/HelpRequest/HelpRequestForm";
import PromoteToVolunteer from "../pages/Volunteer/PromoteToVolunteer";

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
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "request/:id",
    element: (
      // <ProtectedRoute>
      <RequestDetails />
      // </ProtectedRoute>
    ),
  },
  {
    path: "request",
    element: <HelpRequestForm />,
  },
  {
    path: "promote-to-volunteer",
    element: <PromoteToVolunteer />,
  },
];

export default routes;
