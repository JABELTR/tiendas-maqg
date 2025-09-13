import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Button, Select, MenuItem
} from "@mui/material";
import MensajeAlert from "./MensajeAlert";
import TableBodyMovimientosEditable from "./TableBodyMovimientosEditable";


const Movimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [nuevo, setNuevo] = useState({
    fecha: "", tiendaId: "", cajaId: "", efectivo: 0, cajaTipo: 0, daviplata: 0, texito: 0,
    codensa: 0, addi: 0, sistecredito: 0, tc: 0, tefOgloba: 0, qrCuentaSraPaty: 0,
    tarjetaBigPass: 0, tarjetaSodexo: 0, bonoBigPass: 0, bonoSodexo: 0, certificadoDotacion: 0,
    ventaPaginaWeb: 0, tarjetaRegalo: 0, voucherUrban: 0, voucherStyle: 0, voucherDatafono4: 0,
    abonoSistet: 0, gastos: 0
  });
  const [tiendas, setTiendas] = useState([]);
  const [cajas, setCajas] = useState([]);
  const campoStyle = { width: '160px' };
  const [alerta, setAlerta] = useState({ open: false, message: "", severity: "info" });
  const [expanded, setExpanded] = useState(false);



  const cargarDatos = async () => {
    const [movs, tds, cjs] = await Promise.all([
      axios.get("/movimientos"),
      axios.get("/tiendas"),
      axios.get("/cajas")
    ]);
    setMovimientos(movs.data);
    setTiendas(tds.data);
    setCajas(cjs.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange  = (e) => {
     setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setMovimientos(prev =>
      prev.map(m =>
      m.id === id
        ? {
          ...m,
          [name]: isNaN(value) ? value : parseFloat(value),
        }
      : m
      )
    );
  };

  const crearMovimiento = async () => {
    try {
        if (!nuevo.fecha) {

      setAlerta({
        open: true,
        message: "Debe seleccionar una fecha.",
        severity: "error",
    });

          return;
        }
        if (!nuevo.tiendaId) {
          setAlerta({
            open: true,
            message: "Debe seleccionar una tienda.",
            severity: "error",});
          return;
        }
        if (!nuevo.cajaId) {
          
          setAlerta({
            open: true,
            message: "Debe seleccionar una caja.",
            severity: "error",
        });
          return;
        }
      await axios.post("/movimientos/crear", nuevo);
      setAlerta({
        open: true,
        message: "El movimiento se ha creado satisfactoriamente.",
        severity: "success",});
      setNuevo({ ...nuevo, fecha : "", tiendaId: "", cajaId: "" });
      cargarDatos();
    } catch {
      setAlerta({
        open: true,
        message: "Ya existe un movimiento para tienda/fecha/oficina.",
        severity: "error",
    });

  }
  };

  const guardarMovimiento = async (m) => {
    console.log("mov", m);
    try {
      const movimientoRequest = {
        id: m.id,
        fecha: m.fecha,
        tiendaId: m.tienda?.id,
        cajaId: m.caja?.id,
        efectivo: m.efectivo,
        cajaTipo: m.cajaTipo,
        daviplata: m.daviplata,
        texito: m.texito,
        codensa: m.codensa,
        addi: m.addi,
        sistecredito: m.sistecredito,
        tc: m.tc,
        tefOgloba: m.tefOgloba,
        qrCuentaSraPaty: m.qrCuentaSraPaty,
        tarjetaBigPass: m.tarjetaBigPass,
        tarjetaSodexo: m.tarjetaSodexo,
        bonoBigPass: m.bonoBigPass,
        bonoSodexo: m.bonoSodexo,
        certificadoDotacion: m.certificadoDotacion,
        ventaPaginaWeb: m.ventaPaginaWeb,
        tarjetaRegalo: m.tarjetaRegalo,
        voucherUrban: m.voucherUrban,
        voucherStyle: m.voucherStyle,
        voucherDatafono4: m.voucherDatafono4,
        abonoSistet: m.abonoSistet,
        gastos: m.gastos,
        editable: m.editable,
      };
      if (!movimientoRequest.fecha) {
     setAlerta({
        open: true,
        message: "Debe seleccionar una fecha.",
        severity: "error",
    });
        return;
      }
  
      await axios.put("/movimientos/actualizar", movimientoRequest);
     setAlerta({
        open: true,
        message: "El movimiento se ha actualizado correctamente.",
        severity: "success",
    });
      cargarDatos();
    } catch (err) {
      console.error(err);
     setAlerta({
        open: true,
        message: "Ya existe un movimiento para tienda/fecha/oficina.",
        severity: "error",
      });
  }
  };

  const camposNumericos = [
    "efectivo", "cajaTipo", "daviplata", "texito", "codensa", "addi", "sistecredito",
    "tc", "tefOgloba", "qrCuentaSraPaty", "tarjetaBigPass", "tarjetaSodexo", "bonoBigPass",
    "bonoSodexo", "certificadoDotacion", "ventaPaginaWeb", "tarjetaRegalo", "voucherUrban",
    "voucherStyle", "voucherDatafono4", "abonoSistet", "gastos"
  ];

  const eliminarMovimiento = async (id) => {
  if (!window.confirm("¿Eliminar este movimiento?")) return;

  try {
    await axios.delete(`/movimientos/${id}`);
    setAlerta({ open: true, message: "Movimiento eliminado correctamente", severity: "success" });
    cargarDatos(); // vuelve a cargar la lista
  } catch {
    setAlerta({ open: true, message: "Error al eliminar el movimiento", severity: "error" });
  }
  };

  const cambiarEditable = (id) => {
    setMovimientos(prev =>
      prev.map(m => m.id === id ? { ...m, editable: !m.editable } : m)
    );
    setAlerta({ open: true, message: "Si cambia la edición del movimiento debe Guardar", severity: "info" });
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Gestión de Movimientos</Typography>
      <Button variant="contained" onClick={() => setExpanded(!expanded)}>
        {expanded ? "Ocultar crear Nuevo" : "Mostrar crear Nuevo"}
      </Button>
      {expanded && (
      <Paper elevation={3} sx={{ p: 2, mb: 3}}>
        <Typography variant="h6">Nuevo movimiento</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <TextField type="date" label="Fecha" name="fecha" value={nuevo.fecha} onChange={handleChange} size="small" InputLabelProps={{ shrink: true }} />
          <Select name="tiendaId" value={nuevo.tiendaId} onChange={handleChange} displayEmpty size="small">
            <MenuItem value="">Seleccione tienda</MenuItem>
            {tiendas.map(t => <MenuItem key={t.id} value={t.id}>{t.descripcion}</MenuItem>)}
            cajaId: ""
          </Select>
          <Select
            name="cajaId"
            value={nuevo.cajaId}
            onChange={handleChange}
            size="small"
            displayEmpty
            disabled={!nuevo.tiendaId}  // desactiva si no hay tienda
>
            <MenuItem value="">Seleccione caja</MenuItem>
            {cajas
              .filter(c => c.tienda?.id === parseInt(nuevo.tiendaId))  // ← filtrado clave
              .map(c => (
                <MenuItem key={c.id} value={c.id}>{c.descripcion}</MenuItem>
              ))}
          </Select>

          {camposNumericos.map((campo) => (
            <TextField
              key={campo}
              label={campo}
              name={campo}
              type="number"
              value={nuevo[campo]}
              onChange={handleInputChange}
              size="small"
            />
          ))}
          <Button variant="contained" onClick={crearMovimiento}>Crear</Button>
        </Box>
      </Paper>
      )}
      <TableContainer component={Paper} mt={2}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell colSpan={6} style={{ fontWeight: "bold", backgroundColor: "#eee" }}>
                Detalles de Movimientos
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBodyMovimientosEditable
            movimientos={movimientos}
            handleChange={handleChange}
            handleInputChange={handleInputChange}
            guardarMovimiento={guardarMovimiento}
            eliminarMovimiento={eliminarMovimiento}
            cambiarEditable={cambiarEditable}
            tiendas={tiendas}
            cajas={cajas}
          />
        </Table>
      </TableContainer>

      {/* Alertas */}
      <MensajeAlert
        open={alerta.open}
        message={alerta.message}
        severity={alerta.severity}
        onClose={() => setAlerta({ ...alerta, open: false })}
      />
    </Box>
    
  );
};

export default Movimientos;