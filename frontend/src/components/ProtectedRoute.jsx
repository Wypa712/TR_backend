import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

import React from "react";

export default function ProtectedRoute() {
  const isAuth = useAuthStore((state) => state.isAuth);
  console.log("Is user authenticated?", isAuth);
  if (!isAuth) {
    return  <Navigate to="/" replace />;
  }

  return <Outlet />;
}
