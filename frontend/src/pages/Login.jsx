import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import HomeIcon from "@mui/icons-material/Home";
import MensajeAlert from "./MensajeAlert";

function Copyright({ sx }) {
  return (
    <Typography variant="body2" color="white" align="center" sx={sx}>
      © {new Date().getFullYear()} PolluxTI. Todos los derechos reservados.{" "}
    </Typography>
  );
}

function Login() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [alerta, setAlerta] = useState({ open: false, message: "", severity: "info" });

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setAlerta({
        open: true,
        message: "Debe digitar correo y contraseña.",
        severity: "error",
      });
        return;
      }
        
    try {
      const res = await axios.post("/auth/login", {
        email,
        password
      });
      const { token, requiereCambioPassword, tiendaId, rol } = res.data;
//      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({rol,tiendaId}));
      
//      const requiereCambioPassword = res.data.requiereCambioPassword;
//      alert("requiereCambioPassword: " + requiereCambioPassword);
      const decoded = jwtDecode(token);
//      const rol = decoded.rol;
      const activo = decoded.activo;

            
      if (activo === false) {
        localStorage.removeItem("token");
        alert("Tu cuenta está inactiva. Espera autorización del administrador.");
      setAlerta({
        open: true,
        message: "Tu cuenta está inactiva. El administrador debe activartela.",
        severity: "info",
      });
        return;
      }

      if (rol === undefined) {
        localStorage.removeItem("token");
        alert("Tu cuenta aún no tiene rol asignado. Contacta al administrador.");
        return;
      }
      //console.log("rol: " + rol);
      //console.log("tiendaId: " + tiendaId);
      
      if (rol === "USER" && tiendaId === null) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        setAlerta({
          open: true,
          message: "Tu cuenta aún no tiene tienda asignada. Contacta al administrador.",
          severity: "warning",
        });
        return;
      }


      if (requiereCambioPassword === true) {
      setAlerta({
        open: true,
        message: "Debe cambiar su contraseña.",
        severity: "info",
      });
        navigate("/cambiar-password");
      }else {
        setAlerta({
          open: true,
          message: "Login satisfactorio. Redirigiendo a su tablero",
          severity: "info",
        });

        if (rol === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      }
    } catch (err) {

      setAlerta({
        open: true,
        message: "Correo o contraseña incorrectos",
        severity: "error",
      });

    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: `url("/tienda1.jpg")`, // ajusta la ruta
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",            // <— columna
        justifyContent: "center",
        alignItems: "center",
      }}
    >
    
    
    <Box mt={8} maxWidth={400} mx="auto" p={3} borderRadius={2} boxShadow={3} backgroundColor="#dff2f1dc">
      <Box display="flex" justifyContent="center">
          <   HomeIcon sx={{ fontSize: 40, color: "#1976d2" }} />
      </Box>
      
      <Typography variant="h5" align="center" fontWeight="bold" color="primary" gutterBottom>
              Bienvenido a <span style={{ color: "green" }}>Tiendas MAQG</span>
            </Typography>
      <form onSubmit={handleLogin}>
        <TextField fullWidth label="Correo" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField fullWidth label="Contraseña" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" fullWidth variant="contained" color="primary" >Iniciar sesión</Button>
        <Box display="flex" gap={2}>
          
          <Typography
            variant="body2"
            align="center"
                      
            color="primary"
            sx={{ mt: 2, cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/registro")}
          >
          ¿No tienes cuenta? Regístrate         
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="primary"
            sx={{ mt: 2, cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/resetear-password")}
          >
          ¿Resetear contraseña?        
          </Typography>
        </Box>
      </form>
      <MensajeAlert
        open={alerta.open}
        message={alerta.message}
        severity={alerta.severity}
        onClose={() => setAlerta({ ...alerta, open: false })}
      />      
    </Box>
      {/* Footer pegado al fondo */}
      <Box component="footer" sx={{ p: 2, bgcolor: "transparent" }}>
        <Copyright />
      </Box>    
    </Box>
    
  );
  
}

export default Login;
