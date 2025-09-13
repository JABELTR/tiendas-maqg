import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Usuarios from "./pages/Usuarios";
import CambiarPassword from "./pages/CambiarPassword";
import Navbar from "./components/Navbar";
import Tiendas from "./pages/Tiendas";
import Cajas from "./pages/Cajas";
import Movimientos from "./pages/Movimientos";
import ResetearPassword from "./pages/ResetearPassword";
import AppRoutes from "./AppRoutes";

import NotFound from "./pages/NotFound"; 
import { AuthProvider } from "./context/AuthContext";


const App = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <Router>
      {token && <Navbar />} {/* solo se muestra si hay token */}
      <AuthProvider>
        <AppRoutes />        
      </AuthProvider>
    </Router>
  );
};

export default App;