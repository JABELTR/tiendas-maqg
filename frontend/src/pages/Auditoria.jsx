import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import {
  Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Select, MenuItem, Box
} from "@mui/material";

const Auditoria = () => {
  const [registros, setRegistros] = useState([]);
  const [usuario, setUsuario] = useState("todos");

  const cargarAuditoria = async () => {
    try {
      const res = usuario === "todos"
        ? await axios.get("/auditoria")
        : await axios.get(`/auditoria/usuario/${usuario}`);
      setRegistros(
      res.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    );
    } catch {
      alert("Error al cargar auditoría");
    }
  };

  useEffect(() => {
    cargarAuditoria();
  }, [usuario]);

  const usuariosUnicos = Array.from(
    new Set(registros.map((r) => r.usuarioEmail))
  );

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Registros de Auditoría</Typography>

      <Select
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        sx={{ mb: 2, minWidth: 200 }}
        displayEmpty
        size="small"
      >
        <MenuItem value="todos">Todos los usuarios</MenuItem>
        {usuariosUnicos.map((u, idx) => (
          <MenuItem key={idx} value={u}>{u}</MenuItem>
        ))}
      </Select>

      <TableContainer component={Paper} sx={{ maxHeight: 400, "& tbody tr:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}>
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead colSpan={6} style={{ fontWeight: "bold", backgroundColor: "#CAD420",color: "black", }}>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", backgroundColor: "#CAD420",color: "black", }}>Fecha</TableCell>
              <TableCell style={{ fontWeight: "bold", backgroundColor: "#CAD420",color: "black", }}>Usuario</TableCell>
              <TableCell style={{ fontWeight: "bold", backgroundColor: "#CAD420",color: "black", }}>Acción</TableCell>
              <TableCell style={{ fontWeight: "bold", backgroundColor: "#CAD420",color: "black", }}>Entidad</TableCell>
              <TableCell style={{ fontWeight: "bold", backgroundColor: "#CAD420",color: "black", }}>Descripción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registros.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.fecha?.replace("T", " ").substring(0, 19)}</TableCell>
                <TableCell>{r.usuarioEmail}</TableCell>
                <TableCell>{r.accion}</TableCell>
                <TableCell>{r.entidad}</TableCell>
                <TableCell>{r.descripcion}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Auditoria;
