import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Button, Select, MenuItem
} from "@mui/material";
import MensajeAlert from "./MensajeAlert";


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

  const handleChange = (e) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
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

	const actualizarMovimiento = async (mov) => {
	  try {
	    const movimientoRequest = {
	      id: mov.id,
	      fecha: mov.fecha,
	      tiendaId: mov.tienda?.id,
	      cajaId: mov.caja?.id,
	      efectivo: mov.efectivo,
	      cajaTipo: mov.cajaTipo,
	      daviplata: mov.daviplata,
	      texito: mov.texito,
	      codensa: mov.codensa,
	      addi: mov.addi,
	      sistecredito: mov.sistecredito,
	      tc: mov.tc,
	      tefOgloba: mov.tefOgloba,
	      qrCuentaSraPaty: mov.qrCuentaSraPaty,
	      tarjetaBigPass: mov.tarjetaBigPass,
	      tarjetaSodexo: mov.tarjetaSodexo,
	      bonoBigPass: mov.bonoBigPass,
	      bonoSodexo: mov.bonoSodexo,
	      certificadoDotacion: mov.certificadoDotacion,
	      ventaPaginaWeb: mov.ventaPaginaWeb,
	      tarjetaRegalo: mov.tarjetaRegalo,
	      voucherUrban: mov.voucherUrban,
	      voucherStyle: mov.voucherStyle,
	      voucherDatafono4: mov.voucherDatafono4,
	      abonoSistet: mov.abonoSistet,
	      gastos: mov.gastos,
	      editable: mov.editable,
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

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Gestión de Movimientos</Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Nuevo movimiento</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <TextField type="date" label="Fecha" name="fecha" value={nuevo.fecha} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <Select name="tiendaId" value={nuevo.tiendaId} onChange={handleChange} displayEmpty>
            <MenuItem value="">Seleccione tienda</MenuItem>
            {tiendas.map(t => <MenuItem key={t.id} value={t.id}>{t.descripcion}</MenuItem>)}
            cajaId: ""
          </Select>
          <Select
            name="cajaId"
            value={nuevo.cajaId}
            onChange={handleChange}
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
              onChange={handleChange}
              size="small"
            />
          ))}
          <Button variant="contained" onClick={crearMovimiento}>Crear</Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ maxHeight: 400, "& tbody tr:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}>
        <Table >
          <TableHead
                sx={{
                  "& th": {
                backgroundColor: "#d32f2f",
                color: "white",
                fontWeight: "bold"
                }
            }}>
          
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Tienda</TableCell>
              <TableCell>Caja</TableCell>
              {camposNumericos.map((campo) => (
                <TableCell key={campo}>{campo}</TableCell>
              ))}
              <TableCell>Editable</TableCell>
              <TableCell>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movimientos.map((m) => (
              <TableRow key={m.id}>
					    <TableCell>
                  {m.id} 
              </TableCell>
              <TableCell>                                                               
					    <TextField                                                              
					    type="date"                                                           
					    value={m.fecha}                                                       
					    disabled={!m.editable}                                                
					    size="small"                                                          
					    onChange={(e) => {                                                    
					      m.fecha = e.target.value;                                           
					      setMovimientos([...movimientos]);                                   
					    }}                                                                    
					                                     
					  />                                                                      
					</TableCell>                                                              
					                                                                          
					<TableCell>                                                               
					  <Select                                                                 
					    value={m.tienda?.id || ""}                                            
					    disabled={!m.editable}                                                
					    onChange={(e) => {                                                    
					      const tienda = tiendas.find(t => t.id === parseInt(e.target.value));
					      m.tienda = tienda;
                m.caja = null; // Reset caja when tienda changes                                                  
					      setMovimientos([...movimientos]);                                   
					    }}                                                                    
					    size="small"
              sx={campoStyle}                                                          
					  >                                                                       
					    {tiendas.map(t => (                                                   
					      <MenuItem key={t.id} value={t.id}>{t.descripcion}</MenuItem>        
					    ))}                                                                   
					  </Select>                                                               
					</TableCell>                                                              
					                                                                          
					<TableCell>                                                               
					<Select
					  value={m.caja?.id || ""}
					  disabled={!m.editable || !m.tienda}
					  onChange={(e) => {
					    const disponibles = cajas.filter(c => c.tienda?.id === m.tienda?.id);  // ? ?? filtrado aquí
					    const caja = disponibles.find(c => c.id === parseInt(e.target.value));
					    m.caja = caja;
					    setMovimientos([...movimientos]);
					  }}
					  size="small"
            sx={campoStyle}
					>
					  {cajas
					    .filter(c => c.tienda?.id === m.tienda?.id) // ? también aquí se muestra solo las válidas
					    .map(c => (
					      <MenuItem key={c.id} value={c.id}>{c.descripcion}</MenuItem>
					    ))}
					</Select>
          				</TableCell>                                                              
                {camposNumericos.map((campo) => (
                  <TableCell key={campo}>
                    <TextField
                      value={m[campo] || 0}
                      type="number"
                      onChange={(e) => {
                        m[campo] = parseFloat(e.target.value);
                        setMovimientos([...movimientos]);
                      }}
                      disabled={!m.editable}
                      size="small"
                      sx={campoStyle}
                    />
                  </TableCell>
                ))}
                  <TableCell>
                  <Select
                    value={m.editable}
                    onChange={(e) => {
                      m.editable = e.target.value === "true";
                      setMovimientos([...movimientos]);
                    }}
                    size="small"
                    
                  >
                    <MenuItem value="true">Sí</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => actualizarMovimiento(m)}
                    disabled={!m.editable}
                  >
                    Guardar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => eliminarMovimiento(m.id)}
            >
                    Eliminar
                  </Button>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
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