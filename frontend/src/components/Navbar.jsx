import React, { useContext, useMemo } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isAuthenticated, user, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const title = useMemo(() => {
    if (!isAuthenticated) return "Gestión de Tiendas";
    const tiendaTxt = user?.tiendaDescripcion || (user?.tiendaId ? `Tienda #${user.tiendaId}` : "Sin tienda");
    //console.log("tiendaTxt", tiendaTxt);
    return `${role === "ADMIN" ? "Admin" : "Usuario"} - ${tiendaTxt}`;
  }, [isAuthenticated, role, user]);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout({ redirect: true });
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">TIENDAS MAQG - <span style ={{fontWeight: "bold",color: "#CAD420"}}>{role}</span></Typography>
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
