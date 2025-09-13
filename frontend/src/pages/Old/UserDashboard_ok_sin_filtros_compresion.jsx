import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Button, Select, MenuItem
} from "@mui/material";
import MensajeAlert from "./MensajeAlert";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [movimientos, setMovimientos] = useState([]);
  const [nuevo, setNuevo] = useState({
    fecha: "", tiendaId: "", cajaId: "", efectivo: 0, cajaTipo: 0, daviplata: 0, texito: 0,
    codensa: 0, addi: 0, sistecredito: 0, tc: 0, tefOgloba: 0, qrCuentaSraPaty: 0,
    tarjetaBigPass: 0, tarjetaSodexo: 0, bonoBigPass: 0, bonoSodexo: 0, certificadoDotacion: 0,
    ventaPaginaWeb: 0, tarjetaRegalo: 0, voucherUrban: 0, voucherStyle: 0, voucherDatafono4: 0,
    abonoSistet: 0, gastos: 0
  });

  const [cajas, setCajas] = useState([]);
  const campoStyle = { width: '160px' };
  
  const [tiendaId, setTiendaId] = useState(null);
  const [tiendaDescripcion, setTiendaDescripcion] = useState("");
  const [alerta, setAlerta] = useState({ open: false, message: "", severity: "info" });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.tiendaId != null) {
    setTiendaId(Number(user.tiendaId));
    
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("tiendaId--> ", tiendaId);
    if (tiendaId !== null) {
      try{
      axios.get(`/tiendas/${tiendaId}`).then(res => {
      setTiendaDescripcion(res.data.descripcion);
      });
      } catch (err) { 
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
//        alert("Error al cargar al buscar la descripcion de la tienda");
      }
    }
  }, [tiendaId]);

  console.log("tiendaDescripcion--> ", tiendaDescripcion);
  
  useEffect(() => {
   if (tiendaId !== null) {
      cargarDatos();
    }
  }, [tiendaId]);

  const cargarDatos = async () => {
    console.log("Cargando datos...");
        
    try {
      console.log("Cargando movimientos y cajas...");
      const [movs, cjs] = await Promise.all([
        axios.get("/movimientos"),
        axios.get("/cajas")
      ]);
      console.log("TiendaId: ", tiendaId);
      console.log("Cajas           ", cjs.data);
      console.log("Cajas filtradas:", cjs.data.filter(c => c.tienda?.id === tiendaId));
      console.log("Movimientos     ", movs.data);
      console.log("Movimientos filtrados:", movs.data.filter(m => m.tienda?.id === tiendaId));
      setMovimientos(movs.data.filter(m => m.tienda?.id === tiendaId));
      setCajas(cjs.data.filter(c => c.tienda?.id === tiendaId));
    } catch (err) {
      console.error(err);
//      alert("Error al cargar datos del usuario o movimientos.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  
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
        if (!nuevo.cajaId) {

     setAlerta({
        open: true,
        message: "Debe seleccionar una caja.",
        severity: "error",
    });
          return;
        }
          
          
      nuevo.tiendaId = tiendaId;
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
        severity: "error",});
        return;
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

      if (!nuevo.cajaId) {
        setAlerta({
        open: true,
        message: "Debe seleccionar una caja.",
        severity: "error",
      });
        return;
      }

	    await axios.put("/movimientos/actualizar", movimientoRequest);

      setAlerta({
        open: true,
        message: "El movimiento se ha actualizado satisfactoriamente.",
        severity: "success",});
      
      cargarDatos();
	  } catch (err) {
	    console.error(err);
      setAlerta({
        open: true,
        message: "Ya existe un movimiento para tienda/fecha/oficina.",
        severity: "error",
	  });
      return;
    }
	};

  const camposNumericos = [
    "efectivo", "cajaTipo", "daviplata", "texito", "codensa", "addi", "sistecredito",
    "tc", "tefOgloba", "qrCuentaSraPaty", "tarjetaBigPass", "tarjetaSodexo", "bonoBigPass",
    "bonoSodexo", "certificadoDotacion", "ventaPaginaWeb", "tarjetaRegalo", "voucherUrban",
    "voucherStyle", "voucherDatafono4", "abonoSistet", "gastos"
  ];

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Panel de Usuario</Typography>
      <Box mb={2}>
        <Typography variant="h6">
          Tienda {" "}
          <span style={{ fontWeight: "bold", color: "#1976d2", textTransform: "uppercase" }}>
            {tiendaDescripcion}
          </span>
        </Typography>
      </Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Nuevo movimiento</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <TextField type="date" label="Fecha" name="fecha" value={nuevo.fecha} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <Select
            name="cajaId"
            value={nuevo.cajaId}
            onChange={handleChange}
            displayEmpty
            >
            <MenuItem value="">Seleccione caja</MenuItem>
            {cajas
              .filter(c => c.tienda?.id === tiendaId)
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

      <TableContainer component={Paper}>
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
					  <TextField                                                                 
					    value={m.tienda?.descripcion || ""}                                           
					    disabled                                                
					    size="small"
              sx={campoStyle}                                                          
					  />                                                               
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
                  <TextField
                    value={m.editable ? "Sí" : "No"}
                    disabled
//                    onChange={(e) => {
//                      m.editable = e.target.value === "true";
//                      setMovimientos([...movimientos]);
//                    }}
                    size="small"
                  />
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
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

export default UserDashboard;