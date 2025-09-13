package com.tienda.dto;

import java.time.LocalDate;

public class MovimientoRequest {

    private Long id;
    private LocalDate fecha;
    private Long caja_id;
    private Long tienda_id;
    private Double efectivo;
    private Double cajaActual;
    private Double daviplata;
    private Double texito;
    private Double codensa;
    private Double addi;
    private Double sistecredito;
    private Double tc;
    private Double tefOgloba;
    private Double qrCuentaSraPaty;
    private Double tarjetaBigPass;
    private Double tarjetaSodexo;
    private Double bonoBigPass;
    private Double bonoSodexo;
    private Double certificadoDotacion;
    private Double ventaPaginaWeb;
    private Double tarjetaRegalo;
    private Double voucherUrban;
    private Double voucherStyle;
    private Double voucherDatafono4;
    private Double abonoSistet;
    private Double gastos;
    private Double totalparcial;
    private Double totalabosiste;
    private Double bonosvendidos;
    private Double cajaanterior;
    private Double venta;
    private Double total;
    private Double diferencia;
    private String observaciones;
    private Boolean editable = true;

    public MovimientoRequest() {
        // Constructor vacío (requerido por Spring Boot para hacer el binding del JSON)
    }
    
    // Getters y setters
    public Long getId() {
        return id;
    }   
    public void setId(Long id) {
        this.id = id;
    }   

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Long getCajaId() {
        return caja_id;
    }

    public void setCajaId(Long caja_id) {
        this.caja_id = caja_id;
    }

    public Long getTiendaId() {
        return tienda_id;
    }

    public void setTiendaId(Long tienda_id) {
        this.tienda_id = tienda_id;
    }

    public Double getEfectivo() {
        return efectivo;
    }

    public void setEfectivo(Double efectivo) {
        this.efectivo = efectivo;
    }

    public Double getcajaActual() {
        return cajaActual;
    }

    public void setcajaActual(Double cajaActual) {
        this.cajaActual = cajaActual;
    }

    public Double getDaviplata() {
        return daviplata;
    }

    public void setDaviplata(Double daviplata) {
        this.daviplata = daviplata;
    }

    public Double getTexito() {
        return texito;
    }

    public void setTexito(Double texito) {
        this.texito = texito;
    }

    public Double getCodensa() {
        return codensa;
    }

    public void setCodensa(Double codensa) {
        this.codensa = codensa;
    }

    public Double getAddi() {
        return addi;
    }

    public void setAddi(Double addi) {
        this.addi = addi;
    }

    public Double getSistecredito() {
        return sistecredito;
    }

    public void setSistecredito(Double sistecredito) {
        this.sistecredito = sistecredito;
    }

    public Double getTc() {
        return tc;
    }

    public void setTc(Double tc) {
        this.tc = tc;
    }

    public Double getTefOgloba() {
        return tefOgloba;
    }

    public void setTefOgloba(Double tefOgloba) {
        this.tefOgloba = tefOgloba;
    }

    public Double getQrCuentaSraPaty() {
        return qrCuentaSraPaty;
    }

    public void setQrCuentaSraPaty(Double qrCuentaSraPaty) {
        this.qrCuentaSraPaty = qrCuentaSraPaty;
    }

    public Double getTarjetaBigPass() {
        return tarjetaBigPass;
    }

    public void setTarjetaBigPass(Double tarjetaBigPass) {
        this.tarjetaBigPass = tarjetaBigPass;
    }

    public Double getTarjetaSodexo() {
        return tarjetaSodexo;
    }

    public void setTarjetaSodexo(Double tarjetaSodexo) {
        this.tarjetaSodexo = tarjetaSodexo;
    }

    public Double getBonoBigPass() {
        return bonoBigPass;
    }

    public void setBonoBigPass(Double bonoBigPass) {
        this.bonoBigPass = bonoBigPass;
    }

    public Double getBonoSodexo() {
        return bonoSodexo;
    }

    public void setBonoSodexo(Double bonoSodexo) {
        this.bonoSodexo = bonoSodexo;
    }

    public Double getCertificadoDotacion() {
        return certificadoDotacion;
    }

    public void setCertificadoDotacion(Double certificadoDotacion) {
        this.certificadoDotacion = certificadoDotacion;
    }

    public Double getVentaPaginaWeb() {
        return ventaPaginaWeb;
    }

    public void setVentaPaginaWeb(Double ventaPaginaWeb) {
        this.ventaPaginaWeb = ventaPaginaWeb;
    }

    public Double getTarjetaRegalo() {
        return tarjetaRegalo;
    }

    public void setTarjetaRegalo(Double tarjetaRegalo) {
        this.tarjetaRegalo = tarjetaRegalo;
    }

    public Double getVoucherUrban() {
        return voucherUrban;
    }

    public void setVoucherUrban(Double voucherUrban) {
        this.voucherUrban = voucherUrban;
    }

    public Double getVoucherStyle() {
        return voucherStyle;
    }

    public void setVoucherStyle(Double voucherStyle) {
        this.voucherStyle = voucherStyle;
    }

    public Double getVoucherDatafono4() {
        return voucherDatafono4;
    }

    public void setVoucherDatafono4(Double voucherDatafono4) {
        this.voucherDatafono4 = voucherDatafono4;
    }

    public Double getAbonoSistet() {
        return abonoSistet;
    }

    public void setAbonoSistet(Double abonoSistet) {
        this.abonoSistet = abonoSistet;
    }

    public Double getGastos() {
        return gastos;
    }

    public void setGastos(Double gastos) {
        this.gastos = gastos;
    }
    public Double getTotalparcial() {
        return totalparcial;
    }   
    public void setTotalparcial(Double totalparcial) {
        this.totalparcial = totalparcial;
    }
    public Double getTotalabosiste() {
        return totalabosiste;
    }
    public void setTotalabosiste(Double totalabosiste) {
        this.totalabosiste = totalabosiste;
    }
    public Double getBonosvendidos() {
        return bonosvendidos;
    }
    public void setBonosvendidos(Double bonosvendidos) {
        this.bonosvendidos = bonosvendidos;
    }
    public Double getCajaanterior() {
        return cajaanterior;
    }
    public void setCajaanterior(Double cajaanterior) {
        this.cajaanterior = cajaanterior;
    }
    public Double getVenta() {
        return venta;
    }
    public void setVenta(Double venta) {
        this.venta = venta;
    }
    public Double getTotal() {
        return total;
    }
    public void setTotal(Double total) {
        this.total = total;
    }
    public Double getDiferencia() {
        return diferencia;
    }
    public void setDiferencia(Double diferencia) {
        this.diferencia = diferencia;
    }
    
    public String getObservaciones() {
        return observaciones;
    }
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    
    public Boolean getEditable() {
        return editable;
    }
    public void setEditable(Boolean editable) {
        this.editable = editable;
    }
}
