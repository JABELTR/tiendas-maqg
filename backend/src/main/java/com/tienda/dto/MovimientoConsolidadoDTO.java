package com.tienda.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class MovimientoConsolidadoDTO {
    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    private String tienda;
    private String caja;

    private BigDecimal efectivo;
    private BigDecimal cajaActual;
    private BigDecimal daviplata;
    private BigDecimal texito;
    private BigDecimal codensa;
    private BigDecimal addi;
    private BigDecimal sistecredito;
    private BigDecimal tc;
    private BigDecimal tefOgloba;
    private BigDecimal qrCuentaSraPaty;
    private BigDecimal tarjetaBigPass;
    private BigDecimal tarjetaSodexo;
    private BigDecimal bonoBigPass;
    private BigDecimal bonoSodexo;
    private BigDecimal certificadoDotacion;
    private BigDecimal ventaPaginaWeb;
    private BigDecimal tarjetaRegalo;
    private BigDecimal voucherUrban;
    private BigDecimal voucherStyle;
    private BigDecimal voucherDatafono4;
    private BigDecimal abonoSistet;
    private BigDecimal gastos;
    private BigDecimal totalparcial;
    private BigDecimal totalabosiste;
    private BigDecimal bonosvendidos;
    private BigDecimal cajaanterior;
    private BigDecimal venta;
    private BigDecimal total;
    private BigDecimal diferencia;
    
    public MovimientoConsolidadoDTO(
        LocalDate fechaInicio,
        LocalDate fechaFin,
    
        String tienda,
        String caja,
        BigDecimal efectivo,
        BigDecimal cajaActual,
        BigDecimal daviplata,
        BigDecimal texito,
        BigDecimal codensa,
        BigDecimal addi,
        BigDecimal sistecredito,
        BigDecimal tc,
        BigDecimal tefOgloba,
        BigDecimal qrCuentaSraPaty,
        BigDecimal tarjetaBigPass,
        BigDecimal tarjetaSodexo,
        BigDecimal bonoBigPass,
        BigDecimal bonoSodexo,
        BigDecimal certificadoDotacion,
        BigDecimal ventaPaginaWeb,
        BigDecimal tarjetaRegalo,
        BigDecimal voucherUrban,
        BigDecimal voucherStyle,
        BigDecimal voucherDatafono4,
        BigDecimal abonoSistet,
        BigDecimal gastos,
        BigDecimal totalparcial,
        BigDecimal totalabosiste,
        BigDecimal bonosvendidos,
        BigDecimal cajaanterior,
        BigDecimal venta,
        BigDecimal total,
        BigDecimal diferencia
        
    ) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        
        this.tienda = tienda;
        this.caja = caja;
        this.efectivo = efectivo;
        this.cajaActual = cajaActual;
        this.daviplata = daviplata;
        this.texito = texito;
        this.codensa = codensa;
        this.addi = addi;
        this.sistecredito = sistecredito;
        this.tc = tc;
        this.tefOgloba = tefOgloba;
        this.qrCuentaSraPaty = qrCuentaSraPaty;
        this.tarjetaBigPass = tarjetaBigPass;
        this.tarjetaSodexo = tarjetaSodexo;
        this.bonoBigPass = bonoBigPass;
        this.bonoSodexo = bonoSodexo;
        this.certificadoDotacion = certificadoDotacion;
        this.ventaPaginaWeb = ventaPaginaWeb;
        this.tarjetaRegalo = tarjetaRegalo;
        this.voucherUrban = voucherUrban;
        this.voucherStyle = voucherStyle;
        this.voucherDatafono4 = voucherDatafono4;
        this.abonoSistet = abonoSistet;
        this.gastos = gastos;
        this.totalparcial = totalparcial;
        this.totalabosiste = totalabosiste;
        this.bonosvendidos = bonosvendidos;
        this.cajaanterior = cajaanterior;
        this.venta = venta;
        this.total = total;
        this.diferencia = diferencia;
    }

    // Getters
    public LocalDate getFechaInicio() { return fechaInicio; }
    public LocalDate getFechaFin() { return fechaFin; }
    
    public String getTienda() { return tienda; }
    public String getCaja() { return caja; }
    public BigDecimal getEfectivo() { return efectivo; }
    public BigDecimal getcajaActual() { return cajaActual; }
    public BigDecimal getDaviplata() { return daviplata; }
    public BigDecimal getTexito() { return texito; }
    public BigDecimal getCodensa() { return codensa; }
    public BigDecimal getAddi() { return addi; }
    public BigDecimal getSistecredito() { return sistecredito; }
    public BigDecimal getTc() { return tc; }
    public BigDecimal getTefOgloba() { return tefOgloba; }
    public BigDecimal getQrCuentaSraPaty() { return qrCuentaSraPaty; }
    public BigDecimal getTarjetaBigPass() { return tarjetaBigPass; }
    public BigDecimal getTarjetaSodexo() { return tarjetaSodexo; }
    public BigDecimal getBonoBigPass() { return bonoBigPass; }
    public BigDecimal getBonoSodexo() { return bonoSodexo; }
    public BigDecimal getCertificadoDotacion() { return certificadoDotacion; }
    public BigDecimal getVentaPaginaWeb() { return ventaPaginaWeb; }
    public BigDecimal getTarjetaRegalo() { return tarjetaRegalo; }
    public BigDecimal getVoucherUrban() { return voucherUrban; }
    public BigDecimal getVoucherStyle() { return voucherStyle; }
    public BigDecimal getVoucherDatafono4() { return voucherDatafono4; }
    public BigDecimal getAbonoSistet() { return abonoSistet; }
    public BigDecimal getGastos() { return gastos; }
    public BigDecimal getTotalparcial() { return totalparcial; }
    public BigDecimal getTotalabosiste() { return totalabosiste; }
    public BigDecimal getBonosvendidos() { return bonosvendidos; }
    public BigDecimal getCajaanterior() { return cajaanterior; }
    public BigDecimal getVenta() { return venta; }
    public BigDecimal getTotal() { return total; }
    public BigDecimal getDiferencia() { return diferencia; }
    
}
