import React, { useState, useEffect } from "react";
import {
  TextField, Button, Typography, Box,
  Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Paper, IconButton
} from "@mui/material";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import MensajeAlert from "./MensajeAlert";
import { jwtDecode } from "jwt-decode";

import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline"; // Modificar Tienda
import DeleteIcon from "@mui/icons-material/Delete";                     // Eliminar Tienda


const Tiendas = () => {
  const [descripcion, setDescripcion] = useState("");
  const [infoAddi, setInfoAddi] = useState("");
  const [infoSiste, setInfoSiste] = useState("");
  const [tiendas, setTiendas] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [id, setId] = useState(null);
  const navigate = useNavigate();
  const [alerta, setAlerta] = useState({ open: false, message: "", severity: "info" });

  const cargarTiendas = async () => {
    try {
      const res = await axios.get("/tiendas");
      setTiendas(res.data);
    } catch (err) {
      alert("Error al cargar tiendas");
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  useEffect(() => {
    cargarTiendas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (descripcion === "") {
      setAlerta({
        open: true,
        message: "Debe diligenciar descripción.",
        severity: "error",
    });
      return;
    }

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const email = decoded.sub; // o decoded.email si tu token lo incluye así        

    try {
      if (modoEdicion) {

        try {
          await axios.put("/tiendas/actualizar", { id, descripcion, infoAddi, infoSiste });

          const auditoria = {
          usuarioEmail: email,
          accion: "ACTUALIZAR-TIENDA",
          entidad: "tienda",
          descripcion: `Se actualiza la tienda ${descripcion}`};
          
          await axios.post("/auditoria/registrar", auditoria);        

          setAlerta({
          open: true,
          message: "Tienda actualizada satisfactoriamente.",
          severity: "success",
          });
      
        }
        catch (error) {
          alert("Error al actualizar tienda: " + error.message);
        }   
        
      } else {
        await axios.post("/tiendas/crear", { descripcion, infoAddi, infoSiste });

        const auditoria = {
        usuarioEmail: email,
        accion: "CREAR-TIENDA",
        entidad: "tienda",
        descripcion: `Se crea la tienda ${descripcion}`};
          
        await axios.post("/auditoria/registrar", auditoria);   

        setAlerta({
        open: true,
        message: "Tienda creada satisfactoriamente.",
        severity: "success",
      });
      
      }
      setDescripcion("");
      setInfoAddi("");
      setInfoSiste("");
      setModoEdicion(false);
      setId(null);
      cargarTiendas();
    } catch {
      alert("Error al guardar");
    }
  };

  const editar = (tienda) => {
    setDescripcion(tienda.descripcion);
    setInfoAddi(tienda.infoAddi);
    setInfoSiste(tienda.infoSiste);
    setModoEdicion(true);
    setId(tienda.id);
  };

  const eliminarTienda = async (id) => {

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const email = decoded.sub; // o decoded.email si tu token lo incluye así  

  if (!window.confirm("¿Eliminar esta tienda?")) return;
  
  try {
    await axios.delete(`/tiendas/${id}`);

    const auditoria = {
    usuarioEmail: email,
    accion: "ELIMINAR-TIENDA",
    entidad: "tienda",
    descripcion: `Se elimina la tienda ${id}`};
          
    await axios.post("/auditoria/registrar", auditoria);   

    setAlerta({ open: true, message: "Tienda eliminada", severity: "success" });
    cargarTiendas(); // recarga
  } catch (err) {
    setAlerta({ open: true, message: "Error al eliminar tienda. Debe tener cajas y/o movimientos asociados", severity: "error" });
  }
};


  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>Gestión de Tiendas</Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Descripción"
          fullWidth
          margin="normal"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          size="small"
        />
        <TextField
          label="infoAddi"
          fullWidth
          margin="normal"
          value={infoAddi}
          onChange={(e) => setInfoAddi(e.target.value)}
          size="small"
        />
        <TextField
          label="infoSiste"
          fullWidth
          margin="normal"
          value={infoSiste}
          onChange={(e) => setInfoSiste(e.target.value)}
          size="small"
        />
        <Button type="submit" variant="contained" color="primary" >
          {modoEdicion ? "Actualizar Tienda" : "Crear Tienda"}
        </Button>
      </form>

      <Box mt={4}>
        <Typography variant="h6">Listado de Tiendas</Typography>
        <TableContainer component={Paper} sx={{ maxHeight: 400, "& tbody tr:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}>
          <Table stickyHeader size="small" aria-label="sticky table">
            <TableHead
                        sx={{
                          "& th": {
                        backgroundColor: "#CAD420",
                        color: "black",
                        fontWeight: "bold",
                        size: "small"
                        }
                    }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>infoAddi</TableCell>
                <TableCell>infoSiste</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ fontSize: "12px"}}>
              {tiendas.map((tienda) => (
                <TableRow key={tienda.id} >
                  <TableCell>{tienda.id} </TableCell>
                  <TableCell>{tienda.descripcion}</TableCell>
                  <TableCell>{tienda.infoAddi}</TableCell>
                  <TableCell>{tienda.infoSiste}</TableCell>
                  <TableCell>
                  {/*  <Button 
                    variant="outlined" 
                    onClick={() => editar(tienda)
                    } 
                    size='small'>
                      Editar
                    </Button>*/}

                      <IconButton
                        title="Modificar Tienda"
                        color="secondary"
                        size="small"
                        onClick={() => editar(tienda)}
                        aria-label="Modificar Tienda"
                    >
                        <DriveFileRenameOutlineIcon fontSize="small" />
                      </IconButton>

                    {/*<Button
                      variant="outlined"
                      color="error"
                      onClick={() => eliminarTienda(tienda.id)}
                      size='small'
                      >
                    Eliminar
                    </Button>*/}

                      <IconButton
                        title="Eliminar Tienda"
                        size="small"
                        color="error"
                        onClick={() => eliminarTienda(tienda.id)}
                        aria-label="Eliminar Tienda"
                     >
                        <DeleteIcon fontSize="small" />
                     </IconButton>


                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
        <MensajeAlert
        open={alerta.open}
        message={alerta.message}
        severity={alerta.severity}
        onClose={() => setAlerta({ ...alerta, open: false })}
      />
    </Box>
  );
};

export default Tiendas;
