import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert, Paper } from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const ResetearPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleResetPassword = async () => {
    setError("");
    setMensaje("");

    if (!email.trim()) {
      setError("Debes ingresar un correo electrónico.");
      return;
    }

    try {
      console.log("Reseteando contraseña para:", email);
      await axios.put(`/usuarios/resetear-password`, { email });
      setMensaje("Contraseña reseteada a '1234'");
      setEmail("");
    } catch (err) {
      setError("Error al resetear la contraseña. Asegúrate de que el correo exista.");
    }
  };

  return (
    <Box mt={10} display="flex" justifyContent="center">
      <Paper elevation={4} sx={{ p: 4, width: 400, textAlign: "center" }}>
        <LockResetIcon sx={{ fontSize: 40, color: "#1976d2", mb: 1 }} />
        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                Resetear Contraseña <span style={{ color: "green" }}>Tiendas MAQG</span>
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {mensaje && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {mensaje}
          </Alert>
        )}

        <TextField
          label="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          error={!email && error !== ""}
          helperText={!email && error ? "Campo requerido" : ""}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleResetPassword}
        >
          Resetear Contraseña
        </Button>
        <Typography
                    variant="body2"
                    align="center"
                    color="primary"
                    sx={{ mt: 2, cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => navigate("/")}
                  >
                  Ir a la página de inicio       
        </Typography>
      </Paper>
    </Box>
  );
};

export default ResetearPassword;
