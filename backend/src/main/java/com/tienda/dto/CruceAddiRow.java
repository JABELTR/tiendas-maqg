// src/main/java/com/tienda/dto/CruceAddiRow.java
package com.tienda.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CruceAddiRow {
    private LocalDate fechaInicio;
    private LocalDate fechaFin;    
    private String emailVendedor;
    private BigDecimal montoArchivo;      // suma Monto por Email vendedor (CSV)
    private BigDecimal montoMovimientos;  // suma addi en BD por tiendas con infoAddi=email
    private BigDecimal diferencia;        // archivo - movimientos

    public CruceAddiRow() {}

    public CruceAddiRow(LocalDate fechaInicio, LocalDate fechaFin, String emailVendedor, BigDecimal montoArchivo, BigDecimal montoMovimientos) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.emailVendedor = emailVendedor;
        this.montoArchivo = montoArchivo;
        this.montoMovimientos = montoMovimientos;
        this.diferencia = montoArchivo.subtract(montoMovimientos);
    }
    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }
    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }
    public String getEmailVendedor() { return emailVendedor; }
    public void setEmailVendedor(String emailVendedor) { this.emailVendedor = emailVendedor; }
    public BigDecimal getMontoArchivo() { return montoArchivo; }
    public void setMontoArchivo(BigDecimal montoArchivo) { this.montoArchivo = montoArchivo; }
    public BigDecimal getMontoMovimientos() { return montoMovimientos; }
    public void setMontoMovimientos(BigDecimal montoMovimientos) { this.montoMovimientos = montoMovimientos; }
    public BigDecimal getDiferencia() { return diferencia; }
    public void setDiferencia(BigDecimal diferencia) { this.diferencia = diferencia; }
}
