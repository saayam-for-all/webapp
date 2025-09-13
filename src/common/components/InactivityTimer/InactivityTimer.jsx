import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../../redux/features/authentication/authActions";

export const INACTIVITY_TIMEOUT = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

const InactivityLogoutTimer = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const updateExpiryTime = () => {
    const newExpiry = Date.now() + INACTIVITY_TIMEOUT;
    localStorage.setItem("expireTime", newExpiry.toString());
  };

  const checkForInactivity = () => {
    const expireTime = parseInt(localStorage.getItem("expireTime") || "0", 10);

    if (expireTime < Date.now() && location.pathname !== "/") {
      dispatch(logout());
      navigate("/");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkForInactivity();
    }, 5000); // Check for inactivity every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const events = ["click", "keypress", "scroll", "mousemove"];
    events.forEach((event) => window.addEventListener(event, updateExpiryTime));

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, updateExpiryTime),
      );
    };
  }, [updateExpiryTime]);

  return children;
};

export default InactivityLogoutTimer;
