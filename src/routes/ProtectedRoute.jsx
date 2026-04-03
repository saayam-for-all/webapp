import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import InactivityLogoutTimer from "../common/components/InactivityTimer/InactivityTimer";
import LoadingIndicator from "../common/components/Loading/Loading";

const ProtectedRoute = () => {
  const { user, loading } = useSelector((state) => state.auth);

  // Wait for auth initialization to complete before redirecting.
  // This prevents the race condition where an OAuth callback lands on
  // /dashboard but gets bounced to "/" because checkAuthStatus() hasn't
  // finished yet.
  if (loading) {
    return <LoadingIndicator size="50px" position="center" />;
  }

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

    startVolunteerLocationTracking({
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

  if (!user) return <Navigate to="/" replace />;

  return (
    <InactivityLogoutTimer>
      <Outlet />
    </InactivityLogoutTimer>
  );
};

export default ProtectedRoute;
