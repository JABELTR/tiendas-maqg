import React from "react";
import {
  TableBody, TableRow, TableCell, Typography, Grid, Box, Button,
  TextField, Select, MenuItem, FormControlLabel, Checkbox
} from "@mui/material";

const TableBodyMovimientosConsolidado = ({
  movimientos,
  cajas,
  tiendas
}) => {
  const camposCalculados = [
    "totalparcial",
    "total",
    "diferencia"
  ];

const camposConEstilo = ["tienda","totalparcial", "total", "diferencia"];


  return (
    <TableBody>
      {movimientos.map((m) => (
        <TableRow key={m.id} sx={{ backgroundColor: "#f9f9f9" }}>
          <TableCell colSpan={6}>
          <Grid container spacing={1}>

            <Grid item xs={4}>
                <TextField
                  label="Tienda"
                  type="text"
                  name="tienda"
                  value={m.tienda}
                  size="small"
                  fullWidth
                  InputProps={{
                      style: camposConEstilo
                        ? {
                            color: "#d32f2f",           // rojo oscuro
                            fontWeight: "bold",         // negrita
                            backgroundColor: "#fff3e0"  // fondo anaranjado claro
                  }
                  : {}
                    }}
                  />
            </Grid>

            <Grid item xs={4}>
                <TextField
                  label="Caja"
                  name="caja"
                  value={m.caja}
                  size="small"
                  fullWidth
                  InputProps={{
                      style: camposConEstilo
                        ? {
                            color: "#d32f2f",           // rojo oscuro
                            fontWeight: "bold",         // negrita
                            backgroundColor: "#fff3e0"  // fondo anaranjado claro
                  }
                  : {}
                    }}
                />
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
                    type={"text"}
                        inputProps={{}}
                      value={
                       new Intl.NumberFormat("es-CO", {
                       minimumFractionDigits: 2,
                       maximumFractionDigits: 2,
                       }).format(m[field])
                      }
                    size="small"
                    fullWidth
                    disabled={camposCalculados.includes(field)}
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
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
  );
}

export default TableBodyMovimientosConsolidado;