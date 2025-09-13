import { useEffect } from "react";
import { Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Borrar token y usuario al cargar la página
    localStorage.clear();
    navigate("/")
  }, []);

  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4" color="error" gutterBottom>
        404 - Página no encontrada <span style={{ color: "green" }}>Tiendas MAQG</span>
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        Ir al login
      </Button>
    </Box>
  );
};

export default NotFound;

