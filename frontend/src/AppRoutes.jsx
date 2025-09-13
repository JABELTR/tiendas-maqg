// src/AppRoutes.jsx (ejemplo)
import React, { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { setUnauthorizedHandler } from "./api/axiosInstance";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import NotFound from "./pages/NotFound";
import CambiarPassword from "./pages/CambiarPassword";
import ResetearPassword from "./pages/ResetearPassword";
import Registro from "./pages/Registro";
import useIdleLogout from "./hooks/useIdleLogout";
// ... tus PrivateRoute etc.
import PrivateRoute from "./pages/PrivateRoute";

export default function AppRoutes() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  useIdleLogout(() => {
  if (isAuthenticated) logout({ reason: "idle_timeout" });
  }, 10 * 60 * 1000); // 20 minutos

  useEffect(() => {
    setUnauthorizedHandler(() => (reason) => {
      // opcional: mostrar toast según reason
      logout({ reason, redirect: true });
    });
  }, [logout]);

  return (
    <>
      {/* Navbar sólo si autenticado */}
      {isAuthenticated && <Navbar />}
      <Routes>
        
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/cambiar-password" element={<CambiarPassword />} />
        <Route path="/resetear-password" element={<ResetearPassword />} />
        <Route path="/registro" element={<Registro />} />

        {/* Ruta solo para ADMIN */}
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={["ADMIN"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Ruta solo para USER */}
        <Route
          path="/user"
          element={
            <PrivateRoute roles={["USER"]}>
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </>
  );
}
