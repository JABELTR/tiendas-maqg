// src/components/CruceRedeban.jsx
import React, { useRef,useState } from "react";
import axios from "../api/axiosInstance";
import {
  Box, Paper, Typography, Button, TextField, Table, TableHead, TableBody, TableCell, 
  TableContainer,TableRow, Snackbar, Alert, IconButton
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const fmtCOP = (v) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 2 }).format(Number(v || 0));

const CruceRedeban = () => {
  const [file, setFile] = useState(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [separator, setSeparator] = useState(";"); // si tu CSV es ; cambia aquí
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alerta, setAlerta] = useState({ open: false, message: "", severity: "info" });

  const fileInputRef = useRef(null);

  const subir = async () => {
    if (!file) {
      setAlerta({ open: true, message: "Selecciona un archivo CSV.", severity: "warning" });
      return;
    }
    if (!fechaInicio || !fechaFin) {
      setAlerta({ open: true, message: "Selecciona el rango de fechas.", severity: "warning" });
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("fechaInicio", fechaInicio);
      form.append("fechaFin", fechaFin);
      if (separator) form.append("separator", separator);

      const { data } = await axios.post("/cruce-redeban/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRows(data || []);
      if (!data || data.length === 0) {
        setAlerta({ open: true, message: "Error procesando el archivo. Revise si hay información con el rango de fechas indicado", severity: "error" });
      // 🔹 limpiar campos
      //  setFile(null);
      //  setFechaInicio("");
      //  setFechaFin("");
      //  if (fileInputRef.current) fileInputRef.current.value = null;
      //  setRows([]);
      }
    } catch (err) {
      setAlerta({ open: true, message: "Error procesando el archivo. Revise si se usó el separador adecuado y si el csv está columnado", severity: "error" });
      // 🔹 limpiar campos
        setFile(null);
        setFechaInicio("");
        setFechaFin("");
        if (fileInputRef.current) fileInputRef.current.value = null;
        setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const totalArchivo = rows.reduce((acc, r) => acc + Number(r.montoArchivo || 0), 0);
  const totalMovs   = rows.reduce((acc, r) => acc + Number(r.montoMovimientos || 0), 0);
  const totalDiff   = totalArchivo - totalMovs;

  // === Llama al backend para exportar Excel ===
const exportarExcel = async () => {
  if (!file || !fechaInicio || !fechaFin) {
    alert("Debes seleccionar archivo y rango de fechas");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);                // 👈 tiene que llamarse "file"
  formData.append("fechaInicio", fechaInicio);  // formato yyyy-MM-dd
  formData.append("fechaFin", fechaFin);        // formato yyyy-MM-dd
  if (separator) formData.append("separator", separator);

  try {
    const res = await axios.post("/cruce-redeban/export-excel", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      responseType: "blob",
    });  

    // Descargar el archivo
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "cruce_redeban.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error(err);
    alert("Error exportando Excel");
  }
};

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>Cruce Redeban (CSV vs Movimientos)</Typography>

      <Paper sx={{ p: 2, mb: 2, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
        <Button variant="outlined" component="label">
          Seleccionar CSV
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
        </Button>
        <TextField
          type="date"
          label="Fecha inicio"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="date"
          label="Fecha fin"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Separador CSV (, o ;)"
          value={separator}
          onChange={(e) => setSeparator(e.target.value)}
          size="small"
          sx={{ width: 140 }}
        />
        <Button variant="contained" onClick={subir} disabled={loading}>
          {loading ? "Procesando..." : "Procesar Cruce"}
        </Button>
        <IconButton color="success" onClick={exportarExcel} title="Exportar a Excel">
          <FileDownloadIcon fontSize="large" />
        </IconButton>        
      </Paper>

      <TableContainer component={Paper} sx={{ maxHeight: 400, "& tbody tr:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}>
        <Table size="small">
          <TableHead>
            <TableRow colSpan={6} align="center"  style={{ fontWeight: "bold", backgroundColor: "#CAD420",color: "black", }}>
              <TableCell><b>Terminal</b></TableCell>
              <TableCell align="right"><b>Monto (CSV)</b></TableCell>
              <TableCell align="right"><b>Monto (Movimientos)</b></TableCell>
              <TableCell align="right"><b>Diferencia</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r, idx) => (
              <TableRow key={idx}>
                <TableCell>{r.terminal}</TableCell>
                <TableCell align="right">{fmtCOP(r.montoArchivo)}</TableCell>
                <TableCell align="right">{fmtCOP(r.montoMovimientos)}</TableCell>
                <TableCell align="right" style={{ fontWeight: "bold", color: Number(r.diferencia) === 0 ? "inherit" : (Number(r.diferencia) > 0 ? "#2e7d32" : "#c62828") }}>
                  {fmtCOP(r.diferencia)}
                </TableCell>
              </TableRow>
            ))}
            {rows.length > 0 && (
              <TableRow>
                <TableCell><b>Total</b></TableCell>
                <TableCell align="right"><b>{fmtCOP(totalArchivo)}</b></TableCell>
                <TableCell align="right"><b>{fmtCOP(totalMovs)}</b></TableCell>
                <TableCell align="right"><b>{fmtCOP(totalDiff)}</b></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={alerta.open}
        autoHideDuration={4000}
        onClose={() => setAlerta({ ...alerta, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setAlerta({ ...alerta, open: false })} severity={alerta.severity} variant="filled">
          {alerta.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CruceRedeban;
