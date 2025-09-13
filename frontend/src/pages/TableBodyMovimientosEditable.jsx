import React from "react";
import {
  TableBody, TableRow, TableCell, Typography, Grid, Box, Button,
  TextField, Select, MenuItem, FormControlLabel, Checkbox
} from "@mui/material";

const TableBodyMovimientosEditable = ({
  movimientos,
  handleChange,
  handleInputChange,
  guardarMovimiento,
  eliminarMovimiento,
  cambiarEditable,
  cajas,
  tiendas
}) => {
  const camposCalculados = [
    "totalparcial",
    "total",
    "diferencia"
  ];

const camposConEstilo = ["totalparcial", "total", "diferencia"];


  return (
    <TableBody>
      {movimientos.map((m) => (
        <TableRow key={m.id} sx={{ backgroundColor: "#f9f9f9" }}>
          <TableCell colSpan={6}>
            <Typography variant="subtitle1" gutterBottom>
              Movimiento ID: {m.id}
            </Typography>

          <Grid container spacing={1}>
            <Grid item xs={4}>

                <TextField
                  type="date"
                  name="fecha"
                  label="Fecha"
                  value={m.fecha}
                  onChange={(e) => handleInputChange(e, m.id)}
                  size="small"
                  fullWidth
                  disabled={!m.editable}
                  InputLabelProps={{ shrink: true }}
                />
 
            </Grid>

            <Grid item xs={4}>

                <Select
                  name="tiendaId"
                  value={m.tienda?.id || ""}
//                  onChange={(e) => handleInputChange(e, m.id)}
                  onChange={(e) => {                                                    
                    const tienda = tiendas.find(t => t.id === parseInt(e.target.value));
                    m.tienda = tienda;                                                  
                    m.caja = null; 
                    handleInputChange(e, m.id)    
                }}// Reset caja when tienda changes                    
//                    setMovimientos([...movimientos]);                                   
                  size="small"
                  fullWidth
                  disabled={!m.editable}
                >
                  {tiendas.map(t => (
                    <MenuItem key={t.id} value={t.id}>{t.descripcion}</MenuItem>
                  ))}
                </Select>
 
            </Grid>

            <Grid item xs={4}>

                <Select
                  name="cajaId"
                  value={m.caja?.id || ""}
//                  onChange={(e) => handleInputChange(e, m.id)}
                    onChange={(e) => {                                                                            
                        const disponibles = cajas.filter(c => c.tienda?.id === m.tienda?.id);  // ? ?? filtrado aquí
                        const caja = disponibles.find(c => c.id === parseInt(e.target.value));                      
                        m.caja = caja;
                        handleInputChange(e, m.id)                                                                             
//                        setMovimientos([...movimientos]);                                                           
                    }} // Reset caja when tienda changes                                                                                      
                    
                    size="small"
                  fullWidth
                  disabled={!m.editable}
                >
                  {cajas
                    .filter(c => c.tienda?.id === m.tienda?.id)
                    .map(c => (
                      <MenuItem key={c.id} value={c.id}>{c.descripcion}</MenuItem>
                    ))}
                </Select>
 
            </Grid>

            {[
              ["efectivo", "Efectivo"],
              ["cajaActual", "Caja Actual"],
              ["daviplata", "Daviplata"],
              ["texito", "Éxito"],
              ["codensa", "Codensa"],
              ["addi", "Addi"],
              ["sistecredito", "Sistecrédito"],
              ["tc", "TC"],
              ["tefOgloba", "Tef Ogloba"],
              ["qrCuentaSraPaty", "QR Sra Paty"],
              ["tarjetaBigPass", "Big Pass"],
              ["tarjetaSodexo", "Sodexo"],
              ["bonoBigPass", "Bono BigPass"],
              ["certificadoDotacion", "Cert. Dotación"],
              ["ventaPaginaWeb", "Venta Web"],
              ["voucherUrban", "Voucher Urban"],
              ["voucherStyle", "Voucher Style"],
              ["abonoSistet", "Abono Sistet"],
              ["gastos", "Gastos"],
              ["totalparcial", "Total Parcial"],
              ["totalabosiste", "Total Abono Siste"],
              ["bonosvendidos", "Bonos Vendidos"],
              ["cajaanterior", "Caja Anterior"],
              ["venta", "Venta"],
              ["total", "Total"],
              ["diferencia", "Diferencia"]
              
            ].map(([field, label]) => (
              <Grid item xs={4} key={field}>

                  <TextField
                    label={label}
                    name={field}
                      type={m.editable ? "number" : "text"}
                        inputProps={m.editable ? { step: "0.01" } : {}}
                      value={
                       !m.editable
                        ? new Intl.NumberFormat("es-CO", {
                       minimumFractionDigits: 2,
                       maximumFractionDigits: 2,
                       }).format(m[field])
                    : m[field]
                }
                    onChange={(e) => handleInputChange(e, m.id)}
                    size="small"
                    fullWidth
                    disabled={!m.editable || camposCalculados.includes(field)}
                    InputProps={{
                      style: camposConEstilo.includes(field)
                        ? {
                            color: "#d32f2f",           // rojo oscuro
                            fontWeight: "bold",         // negrita
                            backgroundColor: "#fff3e0"  // fondo anaranjado claro
                  }
                  : {}
                    }}
                  />

              </Grid>
            ))}

          </Grid>
             <Grid item xs={4} mt={2}>
                  <TextField
                    label="Observaciones"
                    name="observaciones"
                    type="text"
                    value={m.observaciones || ""}
                    onChange={(e) => handleInputChange(e, m.id)}
                    size="small"
                    fullWidth
                    disabled={!m.editable}
                  />
              </Grid>

          <Box mt={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={m.editable}
                  onChange={() => cambiarEditable(m.id)}
                />
              }
              label="¿Editable?"
                />
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => guardarMovimiento(m)}
                sx={{ mr: 1 }}
                
              >
                Guardar
              </Button>

            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => eliminarMovimiento(m.id)}
              disabled={!m.editable}
            >
              Eliminar
            </Button>
          </Box>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
  );
}

export default TableBodyMovimientosEditable;