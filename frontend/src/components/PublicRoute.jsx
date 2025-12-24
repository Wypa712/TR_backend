import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function PublicRoute() {
  const isAuth = useAuthStore((state) => state.isAuth);
  if (isAuth) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
