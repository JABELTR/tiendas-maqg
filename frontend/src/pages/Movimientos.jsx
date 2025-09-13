import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Button, Select, MenuItem, Pagination, IconButton
} from "@mui/material";
import MensajeAlert from "./MensajeAlert";
import TableBodyMovimientosEditable from "./TableBodyMovimientosEditable";
import { jwtDecode } from "jwt-decode";
import { CircularProgress, Backdrop } from "@mui/material";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import FileDownloadIcon from '@mui/icons-material/FileDownload';


const Movimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [filtros, setFiltros] = useState({ fecha: "", cajaId: "", tiendaId: "" });
  const [nuevo, setNuevo] = useState({
      fecha: "", tiendaId: "", cajaId: "", efectivo: 0, cajaActual: 0, daviplata: 0, texito: 0,
      codensa: 0, addi: 0, sistecredito: 0, tc: 0, tefOgloba: 0, qrCuentaSraPaty: 0,
      tarjetaBigPass: 0, tarjetaSodexo: 0, bonoBigPass: 0, bonoSodexo: 0, certificadoDotacion: 0,
      ventaPaginaWeb: 0, tarjetaRegalo: 0, voucherUrban: 0, voucherStyle: 0, voucherDatafono4: 0,
      abonoSistet: 0, gastos: 0, totalparcial: 0, totalabosiste: 0, bonosvendidos: 0, cajaanterior: 0,
      venta: 0, total: 0, diferencia: 0, observaciones: ""
    });
 
  const [page, setPage] = useState(0);
  const size = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [tiendas, setTiendas] = useState([]);
  const [cajas, setCajas] = useState([]);
  const [alerta, setAlerta] = useState({ open: false, message: "", severity: "info" });
  const [expanded, setExpanded] = useState(false);
  
  const [loadingCajaAnterior, setLoadingCajaAnterior] = useState(false);
  const [errorCajaAnterior, setErrorCajaAnterior] = useState("");

// ¿Tenemos lo necesario para consultar?
  const puedeBuscarCajaAnterior = React.useMemo(() => {
    return Boolean(
      nuevo.tiendaId && nuevo.cajaId &&
      /^\d{4}-\d{2}-\d{2}$/.test(nuevo.fecha)   // YYYY-MM-DD
    );
  }, [nuevo.tiendaId, nuevo.cajaId, nuevo.fecha]);

useEffect(() => {
  // Opcional: solo buscar cuando el panel de "Nuevo" está abierto
  if (!expanded) return;
  if (!puedeBuscarCajaAnterior) return;

  let cancel = false;
  (async () => {
    try {
      setLoadingCajaAnterior(true);
      setErrorCajaAnterior("");
      const { data } = await axios.get("/movimientos/caja-anterior", {
        params: {
          tiendaId: Number(nuevo.tiendaId),
          cajaId: Number(nuevo.cajaId),
          fecha: nuevo.fecha, // "YYYY-MM-DD"
        },
      });

      const valor = Number(data?.cajaAnterior) || 0;
      if (cancel) return;

      // actualiza cajaanterior y recalcula totales
      setNuevo((prev) => {
        const actualizado = { ...prev, cajaanterior: valor };
        actualizado.totalparcial = calcularTotalParcial(actualizado);
        actualizado.total = calcularTotal(actualizado);
        actualizado.diferencia = calcularDiferencia(actualizado);
        return actualizado;
      });
    } catch (e) {
      if (!cancel) {
        setErrorCajaAnterior("No fue posible obtener cajaanterior.");
        setNuevo((prev) => ({ ...prev, cajaanterior: 0 }));
      }
    } finally {
      if (!cancel) setLoadingCajaAnterior(false);
    }
  })();

    return () => { cancel = true; };
  }, [expanded, puedeBuscarCajaAnterior, nuevo.tiendaId, nuevo.cajaId, nuevo.fecha, axios]);


  const camposCalculados = [
    "totalparcial",
    "total",
    "diferencia"
  ];

  const cargarDatos = async () => {
    
    setLoading(true);
    try {
      const [tds, cjs] = await Promise.all([
        axios.get("/tiendas"),
        axios.get("/cajas")
      ]);
      setTiendas(tds.data);
      setCajas(cjs.data);

      const response = await axios.get("/movimientos", {
        params: {
          page,
          size,
          ...filtros
        }
      });
      setMovimientos(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch {
      setAlerta({ open: true, message: "Error al cargar datos", severity: "error" });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [page, filtros]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
    setPage(0);
  };


const handleChange = (e) => {
  const { name, value } = e.target;
  const actualizado = {
    ...nuevo,
    [name]: isNaN(value) ? value : parseFloat(value)
  };

  actualizado.totalparcial = calcularTotalParcial(actualizado);
  actualizado.total = calcularTotal(actualizado);
  actualizado.diferencia = calcularDiferencia(actualizado);

  setNuevo(actualizado);
};

const handleInputChange = (e, id) => {
  const { name, value } = e.target;
  setMovimientos((prev) =>
    prev.map((m) => {
      if (m.id === id) {
        const actualizado = {
          ...m,
          [name]: isNaN(value) ? value : parseFloat(value)
        };

        // Recalcular automáticamente
        actualizado.totalparcial = calcularTotalParcial(actualizado);
        actualizado.total = calcularTotal(actualizado);
        actualizado.diferencia = calcularDiferencia(actualizado);

        return actualizado;
      }
      return m;
    })
  );
};


const calcularTotalParcial = (mov) => {
  return (
    (Number(mov.efectivo) || 0) +
    (Number(mov.cajaActual) || 0) +
    (Number(mov.daviplata) || 0) +
    (Number(mov.texito) || 0) +
    (Number(mov.codensa) || 0) +
    (Number(mov.addi) || 0) +
    (Number(mov.sistecredito) || 0) +
    (Number(mov.tc) || 0) +
    (Number(mov.tefOgloba) || 0) +
    (Number(mov.qrCuentaSraPaty) || 0) +
    (Number(mov.tarjetaBigPass) || 0) +
    (Number(mov.tarjetaSodexo) || 0) +
    (Number(mov.bonoBigPass) || 0) +
    (Number(mov.bonoSodexo) || 0) +
    (Number(mov.certificadoDotacion) || 0) +
    (Number(mov.ventaPaginaWeb) || 0) +
    (Number(mov.tarjetaRegalo) || 0) +
    (Number(mov.voucherUrban) || 0) +
    (Number(mov.voucherStyle) || 0) +
    (Number(mov.voucherDatafono4) || 0) +
    (Number(mov.abonoSistet) || 0) +
    (Number(mov.gastos) || 0)
      );
};

const calcularTotal = (mov) => {
  return (
    (Number(mov.totalabosiste) || 0) +
    (Number(mov.bonosvendidos) || 0) +
    (Number(mov.cajaanterior) || 0) +
    (Number(mov.venta) || 0)
      );
};

const calcularDiferencia = (mov) => {
  return (
    (Number(mov.totalparcial) || 0) -
    (Number(mov.total) || 0)
      );
};

  const crearMovimiento = async () => {

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const email = decoded.sub; // o decoded.email si tu token lo incluye así

    
    const tDescripcion = tiendas.find(t => t.id === Number(nuevo.tiendaId))?.descripcion;

    const auditoria = {
        usuarioEmail: email,
        accion: "CREAR_MOVIMIENTO",
        entidad: "movimiento",
        descripcion: `Movimiento creado para la tienda ${tDescripcion} con fecha ${nuevo.fecha}`
  }    
  
  try {
        if (!nuevo.fecha) {

      setAlerta({
        open: true,
        message: "Debe seleccionar una fecha.",
        severity: "error",
        });

          return;
        }

        const hoy = new Date().toLocaleDateString('en-CA');
        if (nuevo.fecha > hoy) {
          setAlerta({
          open: true,
          message: "La fecha no puede ser mayor a hoy.",
          severity: "error"
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
        
      const totalparcial = calcularTotalParcial(nuevo);
      const total = calcularTotal(nuevo);
      nuevo.totalparcial = totalparcial;
      nuevo.total = total;
      const diferencia = calcularDiferencia(nuevo);
      nuevo.diferencia = diferencia;
      const nuevoConTotal = { ...nuevo, totalparcial,total,diferencia };  

      await axios.post("/movimientos/crear", nuevoConTotal);
      await axios.post("/auditoria/registrar", auditoria);
      setAlerta({
        open: true,
        message: "El movimiento se ha creado satisfactoriamente.",
        severity: "success",});
      //setNuevo({ ...nuevo, fecha : "", tiendaId: "", cajaId: "" });
      setNuevo({ fecha: "", tiendaId: "", cajaId: "", efectivo: 0, cajaActual: 0, daviplata: 0, texito: 0,
      codensa: 0, addi: 0, sistecredito: 0, tc: 0, tefOgloba: 0, qrCuentaSraPaty: 0,
      tarjetaBigPass: 0, tarjetaSodexo: 0, bonoBigPass: 0, bonoSodexo: 0, certificadoDotacion: 0,
      ventaPaginaWeb: 0, tarjetaRegalo: 0, voucherUrban: 0, voucherStyle: 0, voucherDatafono4: 0,
      abonoSistet: 0, gastos: 0, totalparcial: 0, totalabosiste: 0, bonosvendidos: 0, cajaanterior: 0,
      venta: 0, total: 0, diferencia: 0, observaciones: ""});

      setExpanded(false);

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
    
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const email = decoded.sub; // o decoded.email si tu token lo incluye así

    console.log("Email del usuario conectado:", email);

    console.log("tiendaId", m.tienda?.id);

    console.log("tiendaDescripcion", m.tienda?.descripcion);
  
    const auditoria = {
          usuarioEmail: email,
          accion: "ACTUALIZAR_MOVIMIENTO",
          entidad: "movimiento",
          descripcion: `Movimiento ${m.id} actualizado para la tienda ${m.tienda?.descripcion} con fecha ${m.fecha}`
        };    

    console.log("auditoria", auditoria);

    try {
      const movimientoRequest = {
        id: m.id,
        fecha: m.fecha,
        tiendaId: m.tienda?.id,
        cajaId: m.caja?.id,
        efectivo: m.efectivo,
        cajaActual: m.cajaActual,
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
        totalparcial: m.totalparcial,
        totalabosiste: m.totalabosiste,
        bonosvendidos: m.bonosvendidos,
        cajaanterior: m.cajaanterior,
        venta: m.venta,
        total: m.total,
        diferencia: m.diferencia,
        observaciones: m.observaciones,
        editable: m.editable
      };
      if (!movimientoRequest.fecha) {
     setAlerta({
        open: true,
        message: "Debe seleccionar una fecha.",
        severity: "error",
    });
        return;
      }
      const totalparcial = calcularTotalParcial(movimientoRequest);
      const total = calcularTotal(movimientoRequest);
      movimientoRequest.totalparcial = totalparcial;
      movimientoRequest.total = total;
      const diferencia = calcularDiferencia(movimientoRequest);
      const nuevoConTotal = { ...movimientoRequest, totalparcial, total, diferencia };  
      await axios.put("/movimientos/actualizar", nuevoConTotal);
//*      await axios.put("/movimientos/actualizar", movimientoRequest);
      await axios.post("/auditoria/registrar", auditoria);
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
    "efectivo", "cajaActual", "daviplata", "texito", "codensa", "addi", "sistecredito",
    "tc", "tefOgloba", "qrCuentaSraPaty", "tarjetaBigPass", "tarjetaSodexo", "bonoBigPass",
    "bonoSodexo", "certificadoDotacion", "ventaPaginaWeb", "tarjetaRegalo", "voucherUrban",
    "voucherStyle", "voucherDatafono4", "abonoSistet", "gastos","totalparcial","totalabosiste",
    "bonosvendidos", "cajaanterior", "venta","total","diferencia"
  ];

  const eliminarMovimiento = async (id) => {
  
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const email = decoded.sub; // o decoded.email si tu token lo incluye así
    
    console.log("Email del usuario conectado:", email);
    
    const auditoria = {
          usuarioEmail: email,
          accion: "ELIMINAR_MOVIMIENTO",
          entidad: "movimiento",
          descripcion: `Movimiento ${id} eliminado exitosamente`
        };    

    console.log("auditoria", auditoria);

    if (!window.confirm("¿Eliminar este movimiento?")) return;

  try {
    await axios.delete(`/movimientos/${id}`);
    
    await axios.post("/auditoria/registrar", auditoria);

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


  const cajasFiltradas = filtros.tiendaId
    ? cajas.filter(c => c.tienda?.id.toString() === filtros.tiendaId.toString())
    : cajas;

  if (loading) {
    return (
      <Backdrop open={true} sx={{ zIndex: 9999 }}>
       <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  
  const descargarExcel = async () => {
  try {
    const response = await axios.get("/movimientos/exportar-excel", {
      responseType: "blob",
      params: {
        fecha: filtros.fecha,
        tiendaId: filtros.tiendaId,
        cajaId: filtros.cajaId
      }
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "movimientos.xlsx");
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

          {camposNumericos.map((campo) => {
            const esCajaAnterior = campo === "cajaanterior";
            return (
            <TextField
              key={campo}
              label={campo}
              name={campo}
              type="number"
              value={nuevo[campo]}
              onChange={handleChange}
              size="small"
              disabled={
                camposCalculados.includes(campo) || (esCajaAnterior && expanded) // ← sólo deshabilitado en "Nuevo"
              }
          // Opcional: feedback visual para cajaanterior
              helperText={esCajaAnterior ? (errorCajaAnterior || (loadingCajaAnterior ? "Cargando..." : "")) : ""}
              InputProps={{
              ...(esCajaAnterior && loadingCajaAnterior
              ? { endAdornment: <CircularProgress size={16} /> }
              : {}),
            }}
          />
            );  
          })}
          <TextField
              label="Observaciones"
               name="observaciones"
               type="text"
               value={nuevo.observaciones || ""}
               onChange={handleChange}
               size="small"
               fullWidth
          />
          <Button variant="contained" onClick={crearMovimiento}>Crear</Button>
        </Box>
      </Paper>
      )}

      <Box display="flex" gap={2} mb={2}>
        <Select
          name="tiendaId"
          value={filtros.tiendaId}
          onChange={handleFiltroChange}
          displayEmpty
          size="small"
          sx={{ height: 40 }}
        >
          <MenuItem value="">Todas las Tiendas</MenuItem>
          {tiendas.map(t => (
            <MenuItem key={t.id} value={t.id}>{t.descripcion}</MenuItem>
          ))}
        </Select>

        <Select
          name="cajaId"
          value={filtros.cajaId}
          onChange={handleFiltroChange}
          displayEmpty
          size="small"
          sx={{ height: 40 }}
        >
          <MenuItem value="">Todas las Cajas</MenuItem>
          {cajasFiltradas.map(c => (
            <MenuItem key={c.id} value={c.id}>{c.descripcion}</MenuItem>
          ))}
        </Select>

        <TextField
          name="fecha"
          type="date"
          value={filtros.fecha}
          onChange={handleFiltroChange}
          size="small"
          sx={{ height: 40 }}   // 👈 fuerza altura total
          InputProps={{ sx: { height: 40 } }} // 👈 asegura que el input interno también          
          InputLabelProps={{ shrink: true }}
        />

        {/*<Button
          variant="outlined"
          onClick={() => setFiltros({ fecha: "", cajaId: "", tiendaId: "" })}
        >
          Limpiar Filtros
        </Button>*/}

        <IconButton color="success" onClick={() => setFiltros({ fecha: "", cajaId: "", tiendaId: "" })} title="Limpiar filtros búsqueda">
          <CleaningServicesIcon />
        </IconButton>        

        {/*<Button variant="outlined" onClick={descargarExcel}>
          Exportar a Excel
        </Button>*/}

        <IconButton color="success" onClick={descargarExcel} title="Exportar a Excel">
          <FileDownloadIcon fontSize="large" />
        </IconButton>

      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 400, "& tbody tr:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}>
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={6} style={{ fontWeight: "bold", backgroundColor: "#CAD420",color: "black", }}>
                Detalles de Movimientos
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBodyMovimientosEditable
            movimientos={movimientos}
            tiendas={tiendas}
            cajas={cajas}
            handleInputChange={handleInputChange}
            guardarMovimiento={guardarMovimiento}
            eliminarMovimiento={eliminarMovimiento}
            cambiarEditable={cambiarEditable}
          />
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(e, val) => setPage(val - 1)}
          color="primary"
        />
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

export default Movimientos;