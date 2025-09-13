import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!token) return null;

  let rol = "Usuario";
  try {
    const decoded = jwtDecode(token);
    rol = decoded.rol || "Usuario";
    
  } catch (e) {
    console.error("Token inválido");
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">TIENDAS MAQG - <span style ={{fontWeight: "bold",color: "pink"}}>{rol}</span></Typography>
          <Typography variant="h6">TIENDAS MAQG - <span style ={{fontWeight: "bold",color: "pink"}}>{rol}</span></Typography>
        </Box>
        <Typography variant="body2" align="center"                      
            color="white" sx={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={handleLogout}
 >          Cerrar Sesión         
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
