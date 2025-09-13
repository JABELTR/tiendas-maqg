import React, { useEffect, useState } from "react";
import {
  Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TextField, Select, MenuItem, Button, IconButton
} from "@mui/material";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import MensajeAlert from "./MensajeAlert";
import { jwtDecode } from "jwt-decode";

import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline"; // Modificar Caja
import DeleteIcon from "@mui/icons-material/Delete";                     // Eliminar Caja


const Cajas = () => {
  const [cajas, setCajas] = useState([]);
  const [tiendas, setTiendas] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [datafono, setDatafono] = useState("");
  const [eskoaj, setEskoaj] = useState(false);
  const [tiendaId, setTiendaId] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [id, setid] = useState(null);
  const navigate = useNavigate();
  const [alerta, setAlerta] = useState({ open: false, message: "", severity: "info" });

  useEffect(() => {
    cargarCajas();
    cargarTiendas();
  }, []);

  const cargarCajas = async () => {
    try {
      const res = await axios.get("/cajas");
      setCajas(res.data);
    } catch (err) {
      alert("Error al cargar cajas");
      localStorage.removeItem("token");
      navigate("/");
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!descripcion.trim() || !tiendaId) {

      setAlerta({
        open: true,
        message: "Debe diligenciar tienda y descripción.",
        severity: "error",
    });
      return;
    }

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const email = decoded.sub; // o decoded.email si tu token lo incluye así        
    
    try {
      if (modoEdicion) {
        await axios.put("/cajas/actualizar", { id, descripcion, datafono, eskoaj,tiendaId });
      const auditoria = {
      usuarioEmail: email,
      accion: "ACTUALIZAR-CAJA",
      entidad: "caja",
      descripcion: `Se actualiza la caja ${descripcion} de la tienda ${tiendaId}`};
      await axios.post("/auditoria/registrar", auditoria);        
      setAlerta({
        open: true,
        message: "La caja se ha actualizado satisfactoriamente.",
        severity: "success",});
        cargarCajas(); // función para recargar la lista
      } else {
        await axios.post("/cajas/crear", { descripcion, datafono, eskoaj,tiendaId });
        const auditoria = {
        usuarioEmail: email,
        accion: "CREAR-CAJA",
        entidad: "caja",
        descripcion: `Se crea la caja ${descripcion} para la tienda ${tiendaId}`};
        await axios.post("/auditoria/registrar", auditoria);
        setAlerta({
          open: true,
          message: "La caja se ha creado satisfactoriamente.",
          severity: "success",});
        }
      setDescripcion("");
      setDatafono("");
      setEskoaj(false);
      setTiendaId("");
      setModoEdicion(false);
      setid(null);
      cargarCajas();
    } catch {
      alert("Error al guardar caja");
    }
  };

  const editar = (caja) => {
    setDescripcion(caja.descripcion);
    setDatafono(caja.datafono);
    setEskoaj(caja.eskoaj);
    setTiendaId(caja.tienda?.id || "");
    setModoEdicion(true);
    setid(caja.id);
  };
  
  const eliminarCaja = async (id) => {
  
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const email = decoded.sub; // o decoded.email si tu token lo incluye así       
    
  if (!window.confirm("¿Eliminar esta caja?")) return;
  try {
    await axios.delete(`/cajas/${id}`);
    const auditoria = {
        usuarioEmail: email,
        accion: "ELIMINAR-CAJA",
        entidad: "caja",
        descripcion: `Se elimina la caja ${id}`};
    await axios.post("/auditoria/registrar", auditoria);
    setAlerta({ open: true, message: "Caja eliminada", severity: "success" });
    cargarCajas(); // función para recargar la lista
  } catch{
    setAlerta({ open: true, message: "No se pudo eliminar. Puede tener movimientos asociados.", severity: "error" });
  }
};

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Gestión de Cajas</Typography>

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
          label="Datafono"
          fullWidth
          margin="normal"
          value={datafono}
          onChange={(e) => setDatafono(e.target.value)}
          size="small"
        />        
        <TextField
          label="Es Koaj (true/false)"
          fullWidth
          margin="normal"
          value={eskoaj}
          onChange={(e) => setEskoaj(e.target.value)}
          size="small"
        />                
        <Select
          value={tiendaId}
          onChange={(e) => setTiendaId(e.target.value)}
          displayEmpty
          fullWidth
          size="small"
          
           MenuProps={{ PaperProps: { sx: { fontSize: '12px' } } }}
        >
          <MenuItem value="" disabled>Seleccione una tienda</MenuItem>
          {tiendas.map((t) => (
            <MenuItem key={t.id} value={t.id}>{t.descripcion}</MenuItem>
          ))}
        </Select>
        <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        >
          {modoEdicion ? "Actualizar Caja" : "Crear Caja"}
          
        </Button>
        

      </form>

      <Box mt={4}>
        <Typography variant="h6">Listado de Cajas</Typography>
        <TableContainer component={Paper} sx={{ maxHeight: 400, "& tbody tr:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}>
          <Table stickyHeader size="small" aria-label="sticky table">
            <TableHead
                        sx={{
                          "& th": {
                        backgroundColor: "#CAD420",
                        color: "black",
                        fontWeight: "bold"
                        }
                    }}>
              <TableRow>
                {/*<TableCell>ID</TableCell>*/}
                <TableCell>Descripción</TableCell>
                <TableCell>Datafono</TableCell>
                <TableCell>Es Koaj</TableCell>
                <TableCell>Tienda</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cajas.map((caja) => (
                <TableRow key={caja.id}>
                  {/*<TableCell>{caja.id}</TableCell>*/}
                  <TableCell>{caja.descripcion}</TableCell>
                  <TableCell>{caja.datafono}</TableCell>
                  <TableCell>{caja.eskoaj ? "Sí" : "No"}</TableCell>
                  <TableCell>{caja.tienda?.descripcion || "Sin tienda"}</TableCell>
                  <TableCell>
                    {/*<Button variant="outlined" onClick={() => editar(caja)}
                    size='small'>
                      Editar
                    </Button>*/}

                      <IconButton
                        title="Modificar Caja"
                        color="secondary"
                        size="small"
                        onClick={() => editar(caja)}
                        aria-label="Modificar Caja"
                    >
                        <DriveFileRenameOutlineIcon fontSize="small" />
                      </IconButton>

                    {/*<Button variant="outlined" color="error" onClick={() => eliminarCaja(caja.id)} ml={2} 
                    size='small'>
                      Eliminar
                    </Button>*/}

                      <IconButton
                        title="Eliminar Caja"
                        size="small"
                        color="error"
                        onClick={() => eliminarCaja(caja.id)}
                        aria-label="Eliminar Caja"
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

export default Cajas;