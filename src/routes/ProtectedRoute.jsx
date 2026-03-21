import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import InactivityLogoutTimer from "../common/components/InactivityTimer/InactivityTimer";

import {
  startVolunteerLocationTracking,
  stopVolunteerLocationTracking,
  syncVolunteerLocationNow,
} from "../services/volunteerLocationTracker";

import { getIdToken, getTokenPayload } from "../services/tokenService";

const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    let removeListener = null;

    const boot = async () => {
      const token = await getIdToken();
      if (cancelled) return;

      if (!token) {
        stopVolunteerLocationTracking();
        return;
      }

      const payload = await getTokenPayload();
      const groups = payload?.["cognito:groups"] || [];
      const isVolunteer =
        Array.isArray(groups) && groups.includes("Volunteers");

      if (!isVolunteer) {
        stopVolunteerLocationTracking();
        return;
      }

      await startVolunteerLocationTracking({
        intervalMs: 5 * 60 * 1000,
      });

      const onPersonalInfoUpdated = async () => {
        await syncVolunteerLocationNow();
      };

      window.addEventListener("personal-info-updated", onPersonalInfoUpdated);

      removeListener = () => {
        window.removeEventListener(
          "personal-info-updated",
          onPersonalInfoUpdated,
        );
      };
    };

    boot();

    return () => {
      cancelled = true;
      stopVolunteerLocationTracking();
      if (removeListener) removeListener();
    };
  }, []);

  useEffect(() => {
    const publicPaths = [
      "/",
      "/login",
      "/signup",
      "/forgot-password",
      "/verify-otp",
      "/verify-account",
    ];

    if (publicPaths.includes(location.pathname)) {
      stopVolunteerLocationTracking();
    }
  }, [location.pathname]);

  if (!user) return <Navigate to="/" replace />;

  return (
    <InactivityLogoutTimer>
      <Outlet />
    </InactivityLogoutTimer>
  );
};

export default ProtectedRoute;
