import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import MensajeAlert from "./MensajeAlert";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Select, MenuItem, Button, IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TableBodyMovimientosConsolidado from "./TableBodyMovimientosConsolidado";

const ConsolidadoMovimientos = () => {
  const [tiendas, setTiendas] = useState([]);
  const [cajas, setCajas] = useState([]);
  const [filtros, setFiltros] = useState({ fechaInicio: "", fechaFin: "", tiendaId: "", cajaId: "" });
  const [datos, setDatos] = useState([]);
  const [alerta, setAlerta] = useState({ open: false, message: "", severity: "info" });

  useEffect(() => {
    axios.get("/tiendas").then(res => setTiendas(res.data));
    axios.get("/cajas").then(res => setCajas(res.data));
  }, []);

  const buscar = async () => {
  if (filtros.fechaInicio === "" || filtros.fechaFin === "") {
     setAlerta({
        open: true,
        message: "Fecha inicio o Fecha fin inválidas",
        severity: "error",
    });
        return;
   }

  const hoy = new Date().toLocaleDateString('en-CA');
  console.log("hoy:", hoy);
  if (filtros.fechaInicio   > hoy || filtros.fechaFin  > hoy) {
      setAlerta({
      open: true,
      message: "La fecha no puede ser mayor a hoy.",
      severity: "error"
    });
      return;
    }
  
  if (filtros.fechaInicio > filtros.fechaFin) {
      setAlerta({
      open: true,
      message: "La fecha inicio no puede ser mayor a fecha fin.",
      severity: "error"
    });
      return;
    }

    const res = await axios.get("/movimientos/consolidado", { params: filtros });
    setDatos(res.data);
  };

  const cajasFiltradas = filtros.tiendaId
    ? cajas.filter(c => c.tienda?.id.toString() === filtros.tiendaId.toString())
    : cajas;

const descargarConsolidadoExcel = async () => {
try {
    const response = await axios.get("/movimientos/consolidado/exportar-excel", {
      responseType: "blob",
      params: {
        fechaInicio: filtros.fechaInicio,
        fechaFin: filtros.fechaFin,
        tiendaId: filtros.tiendaId || "",
        cajaId: filtros.cajaId || ""
      }
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "consolidado.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    setAlerta({
      open: true,
      message: "Error al descargar el Excel.",
      severity: "error"
    });
  }
};


  return (
    <Box p={3}>
      <Typography variant="h6">Consolidado de Movimientos</Typography>
      <Box display="flex" gap={2} mt={2} mb={2}>
        <TextField
          label="Fecha Inicio"
          type="date"
          name="fechaInicio"
          value={filtros.fechaInicio}
          onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{ height: 40 }}   // 👈 fuerza altura total
          InputProps={{ sx: { height: 40 } }} // 👈 asegura que el input interno también          
        />
        <TextField
          label="Fecha Fin"
          type="date"
          name="fechaFin"
          value={filtros.fechaFin}
          onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{ height: 40 }}   // 👈 fuerza altura total
          InputProps={{ sx: { height: 40 } }} // 👈 asegura que el input interno también          

        />
        <Select
          value={filtros.tiendaId}
          onChange={(e) => setFiltros({ ...filtros, tiendaId: e.target.value })}
          displayEmpty
          size="small"
          sx={{ height: 40 }}
        >
          <MenuItem value="">Todas las Tiendas</MenuItem>
          {tiendas.map(t => <MenuItem key={t.id} value={t.id}>{t.descripcion}</MenuItem>)}
        </Select>
        <Select
          value={filtros.cajaId}
          onChange={(e) => setFiltros({ ...filtros, cajaId: e.target.value })}
          displayEmpty
          size="small"
          sx={{ height: 40 }}
        >
          <MenuItem value="">Todas las Cajas</MenuItem>
          {cajasFiltradas.map(c => (
            <MenuItem key={c.id} value={c.id}>{c.descripcion}</MenuItem>
          ))}
        </Select>
        
        {/*<Button variant="contained" onClick={buscar}>Buscar</Button>*/}
        <IconButton color="success" onClick={buscar} title="Ejecutar búsqueda" sx={{ width: 40, height: 40 }}>
          <SearchIcon />
        </IconButton>    

        {/*<Button
          variant="outlined"
          onClick={() => setFiltros({ fechaInicio: "", fechaFin: "",cajaId: "", tiendaId: "" })}
        >
          Limpiar Filtros
        </Button>*/}
        <IconButton color="success" onClick={() => setFiltros({ fechaInicio: "", fechaFin: "",cajaId: "", tiendaId: "" })} title="Limpiar filtros búsqueda">
          <CleaningServicesIcon />
        </IconButton>  
       {/*} <Button variant="outlined" onClick={descargarConsolidadoExcel}>
          Exportar a Excel
        </Button>*/}
        <IconButton color="success" onClick={descargarConsolidadoExcel} title="Exportar a Excel">
          <FileDownloadIcon fontSize="large" />
        </IconButton>    

      </Box>
      
      <TableContainer component={Paper} sx={{ maxHeight: 400, "& tbody tr:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}>
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={6} align="center"  style={{ fontWeight: "bold", backgroundColor: "#CAD420",color: "black", }}>
                Movimientos Consolidados por Fecha, Tienda y Caja
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBodyMovimientosConsolidado
            movimientos={datos}
            tiendas={tiendas}
            cajas={cajas}
          />
        </Table>          
      </TableContainer>
      <MensajeAlert
        open={alerta.open}
        message={alerta.message}
        severity={alerta.severity}
        onClose={() => setAlerta({ ...alerta, open: false })}
      />
    </Box>
  );
};

export default ConsolidadoMovimientos;
