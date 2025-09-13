import React, { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MensajeAlert from "./MensajeAlert";



function Registro() {
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", password: "" });
  const [alerta, setAlerta] = useState({ open: false, message: "", severity: "info" });
  const Navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/registrar-usuario", form);

        setAlerta({
        open: true,
        message: "Usuario registrado satisfactoriamente. Espere aprobación del administrador.",
        severity: "success",});

      setForm({ nombre: "", apellido: "", email: "", password: "" });
      
      setTimeout(() => {
        Navigate("/");
      }, 5000); // Espera 5 segundos antes de redirigir            
    } catch {
      alert("Error al registrar");
    }
  };

  return (
    
    <Box mt={4} maxWidth={500} mx="auto" p={3} borderRadius={2} boxShadow={3} >
          <Box display="flex" justifyContent="center">
          <   PersonIcon sx={{ fontSize: 40, color: "#1976d2" }} />
          </Box>

       <Typography align="center" variant="h5" fontWeight="bold" color="primary" gutterBottom>
        Registro de Usuario <span style={{ color: "green" }}>Tiendas MAQG</span>
        </Typography>
      
      
      <form onSubmit={handleSubmit}>
        <TextField label="Nombre" fullWidth margin="normal" onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        <TextField label="Apellido" fullWidth margin="normal" onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
        <TextField label="Correo" type="email" fullWidth margin="normal" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <TextField label="Contraseña" type="password" fullWidth margin="normal" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button type="submit" fullWidth variant="contained" color="primary">Registrarse</Button>
        <Typography
                            variant="body2"
                            align="center"
                            color="primary"
                            sx={{ cursor: "pointer", textDecoration: "underline" }}
                            onClick={() => Navigate("/")}
                          >
                          Ir a la página de inicio       
                </Typography>
      </form>
      <MensajeAlert
        open={alerta.open}
        message={alerta.message}
        severity={alerta.severity}
        onClose={() => setAlerta({ ...alerta, open: false })}
      />      
    </Box>
  );
}

export default Registro;