import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { canAccessDashboard, getDefaultDashboard } from "../utils/rbac";

const ProtectedDashboard = ({ requiredDashboard, children }) => {
  const groups = useSelector((state) => state.auth.user?.groups);

  if (!groups || groups.length === 0) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = canAccessDashboard(groups, requiredDashboard);

  if (!hasAccess) {
    const defaultDash = getDefaultDashboard(groups);
    return <Navigate to={`/dashboard?view=${defaultDash}`} replace />;
  }
  return children;
};

ProtectedDashboard.propTypes = {
  requiredDashboard: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ProtectedDashboard;
