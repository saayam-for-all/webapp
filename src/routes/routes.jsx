import OurMission from "../pages/About Us/OurMission/OurMission";
import Login from "../pages/Auth/Login";
import SignUp from "../pages/Auth/Signup";
import OTPVerification from "../pages/Auth/VerifyOtp";
import Collaborators from "../pages/Collaborators/Collaborators";
import ContactUs from "../pages/Contact/ContactUs";
import Dashboard from "../pages/Dashboard/Dashboard";
import Directors from "../pages/Directors/Directors";
import Donate from "../pages/Donate/Donate";
import ForgotPasswordPage from "../pages/ForgotPasswordPage/ForgotPasswordPage";
import VerifyAccountPage from "../pages/ForgotPasswordPage/VerifyAccountPage";
import HelpRequestForm from "../pages/HelpRequest/HelpRequestForm";
import HowWeOperate from "../pages/How We Operate/HowWeOperate";
import LandingPage from "../pages/LandingPage/LandingPage";
// import Mission from "../pages/Mission/Mission";
import NewsOurStories from "../pages/NewsOurStories/NewsOurStories";
import Notifications from "../pages/Notifications/Notifications";
import Profile from "../pages/Profile/Profile";
import OrganizationDetails from "../pages/RequestDetails/OrganizationDetails";
import RequestDetails from "../pages/RequestDetails/RequestDetails";
import VoluntaryOrganizations from "../pages/RequestDetails/VoluntaryOrganizations";
import Sitemap from "../pages/Sitemap/Sitemap";
// import Vision from "../pages/Vision/Vision";
import PromoteToVolunteer from "../pages/Volunteer/PromoteToVolunteer";
import ProtectedRoute from "./ProtectedRoute";
import BenevityInfo from "../pages/Benevity/BenevityInfo";
import TermsAndConditions from "../pages/TermsAndConditions/TermsAndConditions";

import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import Thanks from "../pages/Thanks/Thanks";

const routes = [
  {
    path: "",
    element: <LandingPage />,
  },
  {
    path: "our-team",
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
  // {
  //   path: "mission",
  //   element: <Mission />,
  // },
  // {
  //   path: "vision",
  //   element: <Vision />,
  // },
  {
    path: "contact",
    element: <ContactUs />,
  },
  {
    path: "thanks",
    element: <Thanks />,
  },
  {
    path: "sitemap",
    element: <Sitemap />,
  },
  {
    path: "terms-and-conditions",
    element: <TermsAndConditions />,
  },
  {
    path: "privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "news-our-stories",
    element: <NewsOurStories />,
  },
  {
    path: "notifications",
    element: <Notifications />,
  },
  {
    path: "our-mission",
    element: <OurMission />,
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
  {
    path: "benevity",
    element: <BenevityInfo />,
  },
];

export default routes;
