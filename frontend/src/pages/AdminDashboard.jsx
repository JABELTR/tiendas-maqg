import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import Tiendas from "./Tiendas";
import Cajas from "./Cajas";
import Movimientos from "./Movimientos";
import Consolidados from "./Consolidados";
import Auditoria from "./Auditoria";
import Cruces from "./Cruces";
import { useNavigate } from "react-router-dom";
import MensajeAlert from "./MensajeAlert";
import { jwtDecode } from "jwt-decode";

import {
  Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Select, MenuItem, Box, IconButton
} from "@mui/material";
import { motion } from "framer-motion";

import HowToRegIcon from "@mui/icons-material/HowToReg";                 // Activar
import PersonOffIcon from "@mui/icons-material/PersonOff";               // Desactivar
import LockResetIcon from "@mui/icons-material/LockReset";               // Resetear contraseña
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline"; // Modificar nombre
import StorefrontIcon from "@mui/icons-material/Storefront";             // Modificar tienda
import DeleteIcon from "@mui/icons-material/Delete";                     // Eliminar

const AdminDashboard = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [vista, setVista] = useState("usuarios");
  const [tiendas, setTiendas] = useState([]);
  const [alerta, setAlerta] = useState({ open: false, message: "", severity: "info" });
  const navigate = useNavigate();

  const cargarTiendas = async () => {
    try {
      const res = await axios.get("/tiendas");
      setTiendas(res.data);
    } catch {
//      alert("Error al cargar tiendas");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");      
    }
  };

  const cargarUsuarios = async () => {
    try {
      let res;
      if (filtro === "activos") {
        res = await axios.get("/usuarios/activos");
      } else if (filtro === "inactivos") {
        res = await axios.get("/usuarios/inactivos");
      } else {
        res = await axios.get("/usuarios");
      }

      // Inicializa campos editables
      const usuariosConCampos = res.data.map(u => ({
        ...u,
        editNombre: u.nombre,
        editApellido: u.apellido,
        editTiendaId: u.tienda?.id || ""     
      }));

      setUsuarios(usuariosConCampos);
    } catch (err) {
//      alert("Error al cargar usuarios");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  useEffect(() => {
    if (vista === "usuarios") 
      cargarUsuarios();
      cargarTiendas();
  }, [filtro, vista]);

  const actualizarEstado = async (email, activo) => {
    
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const email1 = decoded.sub; // o decoded.email si tu token lo incluye así    

    const auditoria = {
      usuarioEmail: email1,
      accion: "ACTUALIZAR_ESTADO",
      entidad: "usuario",
      descripcion: `Se modifica el estado del usuario ${email} a ${activo ? "activo" : "inactivo"}`,
    };

    try {
      await axios.put(`/usuarios/estado`, { email, activo });
      await axios.post("/auditoria/registrar", auditoria);
      cargarUsuarios();
    } catch {
      alert("Error al actualizar estado");
    }
  };

  const cambiarRol = async (email, rol) => {

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const email1 = decoded.sub; // o decoded.email si tu token lo incluye así    

    const auditoria = {
      usuarioEmail: email1,
      accion: "ACTUALIZAR_ROL",
      entidad: "usuario",
      descripcion: `Se modifica el rol del usuario ${email} a ${rol}`
    };

    try {
      await axios.put(`/usuarios/rol`, { email, rol });
      await axios.post("/auditoria/registrar", auditoria);
      cargarUsuarios();
    } catch {
      alert("Error al cambiar rol");
    }
  };

  const resetearPassword = async (email) => {

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const email1 = decoded.sub; // o decoded.email si tu token lo incluye así    

    const auditoria = {
      usuarioEmail: email1,
      accion: "RESETEAR_PASSWORD",
      entidad: "usuario",
      descripcion: `Se resetea el password del usuario ${email}`};

    try {
      await axios.put(`/usuarios/resetear-password`, { email });
      await axios.post("/auditoria/registrar", auditoria);

      setAlerta({
        open: true,
        message: "Contraseña reseteada a '1234'.",
        severity: "success",});
      cargarUsuarios();
    } catch {
      alert("Error al resetear contraseña");
    }
  };

  const guardarNombre = async (email, nombre, apellido) => {
    
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const email1 = decoded.sub; // o decoded.email si tu token lo incluye así    

    const auditoria = {
      usuarioEmail: email1,
      accion: "ACTUALIZAR_NOMBRE",
      entidad: "usuario",
      descripcion: `Se actualiza el nombre y/o apellido del usuario ${email}`};    
    
    if (!nombre.trim() || !apellido.trim()) {
      setAlerta({
        open: true,
        message: "El nombre y/o apellido están vacíos.",
        severity: "error",});
      return;
    }
    
    try {
      await axios.put("/usuarios/actualizar-nombre", { email, nombre, apellido });
      await axios.post("/auditoria/registrar", auditoria);
      setAlerta({
        open: true,
        message: "El nombre y/o apellido se ha actualizado satisfactoriamente.",
        severity: "success",});
      cargarUsuarios();
    } catch {
      alert("Error al actualizar nombre");
    }
  };

  const actualizarCampo = (email, campo, valor) => {
    setUsuarios(prev =>
      prev.map(u =>
        u.email === email ? { ...u, [campo]: valor } : u
      )
    );
  };

  const guardarTienda = async (email, tiendaId) => {

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const email1 = decoded.sub; // o decoded.email si tu token lo incluye así    

    const tDescripcion = tiendas.find(t => t.id === Number(tiendaId))?.descripcion;

    const auditoria = {
      usuarioEmail: email1,
      accion: "ACTUALIZAR_TIENDA",
      entidad: "usuario",
      descripcion: `Se actualiza la tienda a ${tDescripcion} al usuario ${email}`};

    try {
      await axios.put("/usuarios/asignar-tienda", { email, tiendaId });
      await axios.post("/auditoria/registrar", auditoria);

      setAlerta({
        open: true,
        message: "La tienda se ha actualizado satisfactoriamente.",
        severity: "success",});
      cargarUsuarios();
    } catch {
      setAlerta({
        open: true,
        message: "La tienda es inválida.",
        severity: "error",});
    }
  };

  const eliminarUsuario = async (email) => {

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const email1 = decoded.sub; // o decoded.email si tu token lo incluye así    

    const auditoria = {
      usuarioEmail: email1,
      accion: "ELIMINAR_USUARIO",
      entidad: "usuario",
      descripcion: `Se elimina el usuario ${email}`};

    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;
  try {
    await axios.delete(`/usuarios/${email}`);
    await axios.post("/auditoria/registrar", auditoria);
    setAlerta({ open: true, message: "Usuario eliminado", severity: "success" });
    cargarUsuarios();
  } catch {
    setAlerta({ open: true, message: "Error al eliminar usuario", severity: "error" });
  }
};


  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>  </Typography>
      {/*
      <Box mb={2}>
        <Button variant={vista === "usuarios" ? "contained" : "outlined"} onClick={() => setVista("usuarios")} sx={{ mr: 1 }}>
          Usuarios
        </Button>
        <Button variant={vista === "tiendas" ? "contained" : "outlined"} onClick={() => setVista("tiendas")}>
          Tiendas
        </Button>
        <Button variant={vista === "cajas" ? "contained" : "outlined"} onClick={() => setVista("cajas")}>
          Cajas
        </Button>
        <Button variant={vista === "movimientos" ? "contained" : "outlined"} onClick={() => setVista("movimientos")}>
          Movimientos
        </Button>
        <Button variant={vista === "consolidados" ? "contained" : "outlined"} onClick={() => setVista("consolidados")}>
          Consolidados
        </Button>
        <Button variant={vista === "cruces" ? "contained" : "outlined"} onClick={() => setVista("cruces")}>
          Cruces
        </Button>
        <Button variant={vista === "auditoria" ? "contained" : "outlined"} onClick={() => setVista("auditoria")}>
          Auditoría
        </Button>*/}
{/*<Box
  mb={2}
  sx={{
    display: "flex",
    gap: 1,
    flexWrap: "wrap",
  }}
>
  {[
    { key: "usuarios", label: "Usuarios" },
    { key: "tiendas", label: "Tiendas" },
    { key: "cajas", label: "Cajas" },
    { key: "movimientos", label: "Movimientos" },
    { key: "consolidados", label: "Consolidados" },
    { key: "cruces", label: "Cruces" },
    { key: "auditoria", label: "Auditoría" },
  ].map(({ key, label }) => (
    <motion.div
      key={key}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Button
        onClick={() => setVista(key)}
        sx={{
          borderRadius: "30px",
          textTransform: "none",
          px: 2.5,
          py: 1,
          fontSize: "0.9rem",
          fontWeight: vista === key ? "bold" : "normal",
          bgcolor: vista === key ? "primary.main" : "grey.100",
          color: vista === key ? "white" : "text.primary",
          transition: "all 0.3s ease",
          boxShadow: vista === key ? 4 : 0,
          "&:hover": {
            bgcolor: vista === key ? "primary.dark" : "grey.200",
          },
        }}
      >
        {label}
      </Button>
    </motion.div>
  ))}
</Box>*/}
<Box
  mb={2}
  sx={{
    display: "flex",
    gap: 2,
    borderBottom: "2px solid #e0e0e0",
  }}
>
  {[
    { key: "usuarios", label: "Usuarios" },
    { key: "tiendas", label: "Tiendas" },
    { key: "cajas", label: "Cajas" },
    { key: "movimientos", label: "Movimientos" },
    { key: "consolidados", label: "Consolidados" },
    { key: "cruces", label: "Cruces" },
    { key: "auditoria", label: "Auditoría" },
  ].map(({ key, label }) => (
    <Button
      key={key}
      onClick={() => setVista(key)}
      disableRipple
      sx={{
        textTransform: "none",
        fontWeight: vista === key ? "bold" : "normal",
        color: vista === key ? "primary.main" : "text.secondary",
        borderRadius: 0,
        borderBottom: vista === key ? "3px solid" : "3px solid transparent",
        borderColor: vista === key ? "primary.main" : "transparent",
        "&:hover": {
          backgroundColor: "transparent",
          color: "primary.main",
        },
      }}
    >
      {label}
    </Button>
  ))}
</Box>
        
      {/*</Box>*/}

      {vista === "usuarios" && (
        <>
          <Select value={filtro} onChange={(e) => setFiltro(e.target.value)} sx={{ mb: 2 }}>
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="activos">Activos</MenuItem>
            <MenuItem value="inactivos">Inactivos</MenuItem>
          </Select>

          <TableContainer component={Paper} sx={{maxHeight: 400, "& tbody tr:nth-of-type(odd)": { backgroundColor: "#f9f9f9" }}}>
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
                <TableRow >
                  <TableCell>Email</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Tienda</TableCell>
                  <TableCell>Activo</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell  size="small">{u.email}</TableCell>
                    <TableCell >
                      <TextField
                        value={u.editNombre}
                        onChange={(e) => actualizarCampo(u.email, "editNombre", e.target.value)}
                        sx={{ width: '160px'}}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={u.editApellido}
                        onChange={(e) => actualizarCampo(u.email, "editApellido", e.target.value)}
                        sx={{ width: '160px'}}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={u.rol || ""}
                        onChange={(e) => cambiarRol(u.email, e.target.value)}
                        size="small"
                        sx={{ fontSize: '14x' }}
                        MenuProps={{ PaperProps: { sx: { fontSize: '14x' } } }}
                      >
                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                        <MenuItem value="USER">USER</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={u.editTiendaId}
                        onChange={(e) => actualizarCampo(u.email, "editTiendaId", e.target.value)}
                        size="small"
                        displayEmpty
                        disabled={u.rol === "ADMIN"}  // ❌ Desactiva el Select si es ADMIN
                        sx={{ fontSize: '14x' }}
                        MenuProps={{ PaperProps: { sx: { fontSize: '14x' } } }}
                      >
                        <MenuItem value="">Sin tienda</MenuItem>
                        {tiendas.map((t) => (
                          <MenuItem key={t.id} value={t.id}>{t.descripcion}</MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>{u.activo ? "Sí" : "No"}</TableCell>
                    <TableCell>
{/*                      <Button
                        title="Activar/Desactivar"
                        variant="outlined"
                        color={u.activo ? "secondary" : "primary"}
                        onClick={() => actualizarEstado(u.email, !u.activo)}
                        sx={{ fontSize: '14x', padding: '2px 2px' }}
                      >
                        {u.activo ? "I" : "A"}
                      </Button>*/}
                      <IconButton
                          title={u.activo ? "Desactivar usuario" : "Activar usuario"}
                          size="small"
                          color={u.activo ? "warning" : "success"}
                          onClick={() => actualizarEstado(u.email, !u.activo)}
                          aria-label={u.activo ? "Desactivar usuario" : "Activar usuario"}
                      >
                      {u.activo ? <PersonOffIcon fontSize="small" /> : <HowToRegIcon fontSize="small" />}
                      </IconButton>
                      
                      {/*<Button
                        title="Resetear contraseña a '1234'"
                        variant="outlined"
                        color="warning"
                        onClick={() => resetearPassword(u.email)}
                        sx={{ fontSize: '14x', padding: '4px 8px' }}
                      >
                        Resetar contraseña
                      </Button>*/}
                      <IconButton
                        title="Resetear contraseña a '1234'"
                        size="small"
                        onClick={() => resetearPassword(u.email)}
                        aria-label="Resetear contraseña"
                    >
                        <LockResetIcon fontSize="small" />
                      </IconButton>
                      
                      
                      {/*{" "}
                      <Button
                        title="Guardar nombre y/o apellido"
                        variant="outlined"
                        onClick={() => guardarNombre(u.email, u.editNombre, u.editApellido)}
                        sx={{ fontSize: '14x', padding: '4px 8px' }}
                      >
                        Nom
                      </Button>*/}
                      <IconButton
                        title="Guardar nombre y/o apellido"
                        color="secondary"
                        size="small"
                        onClick={() => guardarNombre(u.email, u.editNombre, u.editApellido)}
                        aria-label="Modificar nombre"
                    >
                        <DriveFileRenameOutlineIcon fontSize="small" />
                      </IconButton>

                      {/*<Button
                        variant="outlined"
                        onClick={() => guardarTienda(u.email, u.editTiendaId)}
                        disabled={u.rol === "ADMIN"} // ❌ Desactiva botón si es ADMIN
                        sx={{ fontSize: '14x', padding: '4px 8px' }}
                      >
                        Guardar tienda
                      </Button>*/}

                      <IconButton
                        title="Guardar tienda"
                        color="primary"
                        size="small"
                        onClick={() => guardarTienda(u.email, u.editTiendaId)}
                        disabled={u.rol === "ADMIN"} // ❌ Desactiva botón si es ADMIN
                        aria-label="Modificar tienda"
                       >
                        <StorefrontIcon fontSize="small" />
                      </IconButton>

                      {/*<Button
                        variant="outlined"
                        color="error"
                        onClick={() => eliminarUsuario(u.email)}
                        sx={{ fontSize: '14x', padding: '4px 8px' }}
            >     
                        Eliminar
                    </Button>*/}

                      <IconButton
                        title="Eliminar usuario"
                        size="small"
                        color="error"
                        onClick={() => eliminarUsuario(u.email)}
                        aria-label="Eliminar usuario"
                     >
                        <DeleteIcon fontSize="small" />
                     </IconButton>

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      {vista === "tiendas" && <Tiendas />}
      {vista === "cajas" && <Cajas />}
      {vista === "movimientos" && <Movimientos />}
      {vista === "consolidados" && <Consolidados />}
      {vista === "cruces" && <Cruces />}
      {vista === "auditoria" && <Auditoria />}

      {/* Mensaje de alerta */}

      <MensajeAlert
        open={alerta.open}
        message={alerta.message}
        severity={alerta.severity}
        onClose={() => setAlerta({ ...alerta, open: false })}
      />

    </Box>
  );
};

export default AdminDashboard;
