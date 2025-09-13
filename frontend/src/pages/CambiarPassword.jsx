import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const CambiarPassword = () => {
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nuevaPassword !== confirmar) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const email = decoded.sub;

      await axios.put("/auth/cambiar-password", {
        email,
        nuevaPassword
      });

      alert("Contraseña cambiada. Inicia sesión nuevamente.");
//      navigate(decoded.rol === "ADMIN" ? "/admin" : "/user");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/"); // Redirigir a la página de inicio o login
    } catch (error) {
      console.error("Error al cambiar contraseña", error);
      alert("Error al cambiar contraseña");
    }
  };

  return (
    <Box mt={8} maxWidth={400} mx="auto">
      <Typography variant="h5" gutterBottom>Cambiar contraseña</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nueva contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={nuevaPassword}
          onChange={(e) => setNuevaPassword(e.target.value)}
        />
        <TextField
          label="Confirmar contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Guardar contraseña
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CambiarPassword;
