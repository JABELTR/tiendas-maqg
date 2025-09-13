import React, { useEffect, useState } from "react";
import {
  Table, TableHead, TableRow, TableCell, TableContainer,
  Paper, Snackbar, Alert
} from "@mui/material";
import axios from "../api/axiosInstance";
import TableBodyMovimientosEditable from "./TableBodyMovimientosEditable";

const Movimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [alerta, setAlerta] = useState({ open: false, message: "", severity: "info" });

  const cargarDatos = async () => {
    try {
      const res = await axios.get("/movimientos");
      setMovimientos(res.data);
    } catch {
      setAlerta({ open: true, message: "Error al cargar movimientos", severity: "error" });
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setMovimientos(prev =>
      prev.map(m => m.id === id ? { ...m, [name]: parseFloat(value) || 0 } : m)
    );
  };

  const guardarMovimiento = async (id) => {
    const movimiento = movimientos.find(m => m.id === id);
    if (!movimiento.editable) {
      setAlerta({ open: true, message: "Este movimiento no se puede editar", severity: "warning" });
      return;
    }
    try {
      await axios.put("/movimientos/actualizar", movimiento);
      setAlerta({ open: true, message: "Movimiento actualizado", severity: "success" });
      cargarDatos();
    } catch {
      setAlerta({ open: true, message: "Error al guardar movimiento", severity: "error" });
    }
  };

  const eliminarMovimiento = async (id) => {
    if (!window.confirm("¿Eliminar este movimiento?")) return;
    try {
      await axios.delete(`/movimientos/${id}`);
      setAlerta({ open: true, message: "Movimiento eliminado", severity: "success" });
      cargarDatos();
    } catch {
      setAlerta({ open: true, message: "Error al eliminar movimiento", severity: "error" });
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
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
            handleInputChange={handleInputChange}
            guardarMovimiento={guardarMovimiento}
            eliminarMovimiento={eliminarMovimiento}
          />
        </Table>
      </TableContainer>

      <Snackbar
        open={alerta.open}
        autoHideDuration={3000}
        onClose={() => setAlerta({ ...alerta, open: false })}
      >
        <Alert severity={alerta.severity} variant="filled">
          {alerta.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Movimientos;
