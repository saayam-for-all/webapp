import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
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

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <InactivityLogoutTimer>
      <Outlet />
    </InactivityLogoutTimer>
  );
};

export default ProtectedRoute;
