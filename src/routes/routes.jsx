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
import EmergencyContact from "../pages/EmergencyContact/EmergencyContact";

const routes = [
  {
    path: "",
    element: <LandingPage />,
    handle: { leaveAdSpace: true },
  },
  {
    path: "our-team",
    element: <Directors />,
    handle: { leaveAdSpace: true },
  },
  {
    path: "donate",
    element: <Donate />,
    handle: { leaveAdSpace: true },
  },
  {
    path: "how-we-operate",
    element: <HowWeOperate />,
    handle: { leaveAdSpace: true },
  },
  {
    path: "collaborators",
    element: <Collaborators />,
    handle: { leaveAdSpace: true },
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
    handle: { leaveAdSpace: true },
  },
  {
    path: "emergency-contact",
    element: <EmergencyContact />,
    handle: { leaveAdSpace: true },
  },
  {
    path: "thanks",
    element: <Thanks />,
  },
  {
    path: "sitemap",
    element: <Sitemap />,
    handle: { leaveAdSpace: true },
  },
  {
    path: "terms-and-conditions",
    element: <TermsAndConditions />,
    handle: { leaveAdSpace: true },
  },
  {
    path: "privacy-policy",
    element: <PrivacyPolicy />,
    handle: { leaveAdSpace: true },
  },
  {
    path: "news-our-stories",
    element: <NewsOurStories />,
    handle: { leaveAdSpace: true },
  },
  {
    path: "notifications",
    element: <Notifications />,
    handle: { leaveAdSpace: true },
  },
  {
    path: "our-mission",
    element: <OurMission />,
    handle: { leaveAdSpace: true },
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
    handle: { leaveAdSpace: true },
  },
];

export default routes;
