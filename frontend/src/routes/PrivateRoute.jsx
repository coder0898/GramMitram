import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const PrivateRoute = ({ allowedRole, children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/" />; // Not logged in

  if (!allowedRole.includes(currentUser.role))
    return <Navigate to="/unauthorized" />; // Wrong role

  return children;
};

export default PrivateRoute;
