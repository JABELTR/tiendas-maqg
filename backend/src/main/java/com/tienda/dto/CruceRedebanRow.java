package com.tienda.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CruceRedebanRow {
    private LocalDate fechaInicio;
    private LocalDate fechaFin;    
    private String terminal;
    private BigDecimal montoArchivo;      // suma Monto por Terminal (CSV)
    private BigDecimal montoMovimientos;  // suma Redeban en BD por tiendas con caja.datafono=terminal
    private BigDecimal diferencia;

    public CruceRedebanRow(LocalDate fechaInicio, LocalDate fechaFin, String terminal, BigDecimal montoArchivo, BigDecimal montoMovimientos) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;  
        this.terminal = terminal;
        this.montoArchivo = montoArchivo;
        this.montoMovimientos = montoMovimientos;
        this.diferencia = montoArchivo.subtract(montoMovimientos);
    }

    // getters y setters
    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }
    public LocalDate getFechaFin() { return fechaFin; } 
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }
    public String getTerminal() { return terminal; }
    public void setTerminal(String terminal) { this.terminal = terminal; }
    public BigDecimal getMontoArchivo() { return montoArchivo; }
    public void setMontoArchivo(BigDecimal montoArchivo) { this.montoArchivo = montoArchivo; }
    public BigDecimal getMontoMovimientos() { return montoMovimientos; }
    public void setMontoMovimientos(BigDecimal montoMovimientos) { this.montoMovimientos = montoMovimientos; }
    public BigDecimal getDiferencia() { return diferencia; }
    public void setDiferencia(BigDecimal diferencia) { this.diferencia = diferencia; }
}
