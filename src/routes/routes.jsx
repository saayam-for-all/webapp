import Login from "../pages/Auth/Login";
import SignUp from "../pages/Auth/Signup";
import OTPVerification from "../pages/Auth/VerifyOtp";
import Collaborators from "../pages/Collaborators/Collaborators";
import Contact from "../pages/Contact/Contact";
import Dashboard from "../pages/Dashboard/Dashboard";
import Directors from "../pages/Directors/Directors";
import Donate from "../pages/Donate/Donate";
import ForgotPasswordPage from "../pages/ForgotPasswordPage/ForgotPasswordPage";
import VerifyAccountPage from "../pages/ForgotPasswordPage/VerifyAccountPage";
import HelpRequestForm from "../pages/HelpRequest/HelpRequestForm";
import HowWeOperate from "../pages/How We Operate/HowWeOperate";
import LandingPage from "../pages/LandingPage/LandingPage";
import Mission from "../pages/Mission/Mission";
import Notifications from "../pages/Notifications/Notifications";
import Profile from "../pages/Profile/Profile";
import OrganizationDetails from "../pages/RequestDetails/OrganizationDetails";
import RequestDetails from "../pages/RequestDetails/RequestDetails";
import VoluntaryOrganizations from "../pages/RequestDetails/VoluntaryOrganizations";
import Vision from "../pages/Vision/Vision";
import PromoteToVolunteer from "../pages/Volunteer/PromoteToVolunteer";
import ProtectedRoute from "./ProtectedRoute";
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
    path: "collaborators",
    element: <Collaborators />,
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
    path: "notifications",
    element: <Notifications />,
  },
  {
    path: "our-mission",
    element: <Mission />,
  },
  {
    element: <ProtectedRoute />, // Parent wrapper for protected routes
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
        handle: { leaveAdSpace: true },
      },
      {
        path: "request/:id",
        element: <RequestDetails />,
        handle: { leaveAdSpace: true },
      },
      {
        path: "request",
        element: <HelpRequestForm />,
        handle: { leaveAdSpace: true },
      },
      {
        path: "promote-to-volunteer",
        element: <PromoteToVolunteer />,
        handle: { leaveAdSpace: true },
      },
      {
        path: "profile",
        element: <Profile />,
        handle: { leaveAdSpace: true },
      },
      {
        path: "voluntary-organizations",
        element: <VoluntaryOrganizations />,
        handle: { leaveAdSpace: true },
      },
      {
        path: "organization/:id",
        element: <OrganizationDetails />,
        handle: { leaveAdSpace: true },
      },
    ],
  },
  {
    path: "verify-otp",
    element: <OTPVerification />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "signup",
    element: <SignUp />,
  },
  {
    path: "forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "verify-account",
    element: <VerifyAccountPage />,
  },
];

export default routes;
