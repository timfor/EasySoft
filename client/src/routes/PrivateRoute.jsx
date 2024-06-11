import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../AppStateContext.js";

const PrivateRoute = ({ element, requiredRole }) => {
  const { isAuthenticated, data } = useAuthStore();

  if (isAuthenticated && data.roleId >= requiredRole) {
    return element;
  } else {
    return <Navigate to="/auth" replace />;
  }
};

export default PrivateRoute;
