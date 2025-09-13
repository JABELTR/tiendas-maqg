// src/main/java/com/tienda/dto/CruceSisteRow.java
package com.tienda.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CruceSisteRow {
    private LocalDate fechaInicio;
    private LocalDate fechaFin;    
    private String asesor;
    private BigDecimal montoArchivo;      // suma Monto por Email vendedor (CSV)
    private BigDecimal montoMovimientos;  // suma Siste en BD por tiendas con infoSiste=email
    private BigDecimal diferencia;        // archivo - movimientos

    public CruceSisteRow() {}

    public CruceSisteRow(LocalDate fechaInicio, LocalDate fechaFin, String asesor, BigDecimal montoArchivo, BigDecimal montoMovimientos) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;        
        this.asesor = asesor;
        this.montoArchivo = montoArchivo;
        this.montoMovimientos = montoMovimientos;
        this.diferencia = montoArchivo.subtract(montoMovimientos);
    }
    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }
    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }
    public String getasesor() { return asesor; }
    public void setasesor(String asesor) { this.asesor = asesor; }
    public BigDecimal getMontoArchivo() { return montoArchivo; }
    public void setMontoArchivo(BigDecimal montoArchivo) { this.montoArchivo = montoArchivo; }
    public BigDecimal getMontoMovimientos() { return montoMovimientos; }
    public void setMontoMovimientos(BigDecimal montoMovimientos) { this.montoMovimientos = montoMovimientos; }
    public BigDecimal getDiferencia() { return diferencia; }
    public void setDiferencia(BigDecimal diferencia) { this.diferencia = diferencia; }
}
