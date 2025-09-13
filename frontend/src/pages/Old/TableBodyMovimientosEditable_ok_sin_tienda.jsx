import React from "react";
import {
  TableBody, TableRow, TableCell, Typography,
  Grid, Box, Button, TextField
} from "@mui/material";

const TableBodyMovimientosEditable = ({
  movimientos,
  handleInputChange,
  guardarMovimiento,
  eliminarMovimiento
}) => (
  <TableBody>
    {movimientos.map((m) => (
      <TableRow key={m.id} sx={{ backgroundColor: "#f9f9f9" }}>
        <TableCell colSpan={6}>
          <Typography variant="subtitle1" gutterBottom>
            Fecha: {m.fecha} | Caja: {m.caja?.descripcion || "N/A"}
          </Typography>

          <Grid container spacing={1}>
            {[
              ["efectivo", "Efectivo"],
              ["cajaTipo", "Caja Tipo"],
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
              ["gastos", "Gastos"]
            ].map(([field, label]) => (
              <Grid item xs={4} key={field}>
                {m.editable ? (
                  <TextField
                    label={label}
                    name={field}
                    type="number"
                    value={m[field]}
                    onChange={(e) => handleInputChange(e, m.id)}
                    size="small"
                    fullWidth
                  />
                ) : (
                  <Typography variant="body2">
                    <strong>{label}:</strong> {m[field]}
                  </Typography>
                )}
              </Grid>
            ))}
          </Grid>

          <Box mt={2}>
            {m.editable && (
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => guardarMovimiento(m.id)}
                sx={{ mr: 1 }}
              >
                Guardar
              </Button>
            )}
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => eliminarMovimiento(m.id)}
            >
              Eliminar
            </Button>
          </Box>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
);

export default TableBodyMovimientosEditable;
