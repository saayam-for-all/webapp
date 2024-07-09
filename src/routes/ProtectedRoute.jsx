import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  const { user } = useSelector((state) => state.auth);
  return user !== null;
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
