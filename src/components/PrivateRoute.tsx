import React from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

interface PrivateRouteProps {
  element: React.ReactElement;
  allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, allowedRoles }) => {
  const auth = React.useContext(AuthContext);

  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(auth.role || "")) {
    return <Navigate to="/unauthorized" />;
  }

  return element;
};

export default PrivateRoute;
