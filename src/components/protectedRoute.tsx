import { type ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

interface ProtectedRouteProps {
  element: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { userId } = useAuth();

  if (!userId) {
    return <Navigate to="/authForm" replace />;
  }

  return element;
};

export default ProtectedRoute;
