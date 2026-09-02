import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import InactivityLogoutTimer from "../common/components/InactivityTimer/InactivityTimer";
import MainLoader from "../common/components/Loader/MainLoader";

import {
  startVolunteerLocationTracking,
  stopVolunteerLocationTracking,
  syncVolunteerLocationNow,
} from "../services/volunteerLocationTracker";

const ProtectedRoute = () => {
  const authState = useSelector((state) => state.auth);
  const user = authState?.user || null;

  const loading = authState?.loading ?? false;

  const userDBid = user?.userDbId || "";

  const location = useLocation();

  useEffect(() => {
    let removeListener = null;

    const rawGroups =
      user?.groups ??
      user?.group ??
      user?.cognitoGroups ??
      user?.["cognito:groups"] ??
      [];

    const normalizedGroups = Array.isArray(rawGroups)
      ? rawGroups
      : [rawGroups].filter(Boolean);

    const isVolunteer =
      normalizedGroups.includes("Volunteers") ||
      normalizedGroups.includes("Volunteer");

    if (!user || !userDBid || !isVolunteer) {
      stopVolunteerLocationTracking();
      return;
    }

    startVolunteerLocationTracking();

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

    return () => {
      stopVolunteerLocationTracking();
      if (removeListener) removeListener();
    };
  }, [authState, user, userDBid, location.pathname]);

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

  if (loading) return <MainLoader />;

  if (!user) return <Navigate to="/" replace />;

  return (
    <InactivityLogoutTimer>
      <Outlet />
    </InactivityLogoutTimer>
  );
};

export default ProtectedRoute;
