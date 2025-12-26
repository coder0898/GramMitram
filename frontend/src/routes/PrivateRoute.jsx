// export default PrivateRoute;
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ allowedRole, children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/" />; // Not logged in → login

  if (!allowedRole.includes(currentUser.role)) {
    // Redirect based on role
    switch (currentUser.role) {
      case "admin":
        return <Navigate to="/admin" />;
      case "staff":
        return <Navigate to="/staff" />;
      case "user":
        return <Navigate to="/user" />;
      default:
        return <Navigate to="/" />;
    }
  }

  return children;
};

export default PrivateRoute;
