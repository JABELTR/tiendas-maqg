package com.tienda.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(
    name = "movimientos",
    uniqueConstraints = @UniqueConstraint(columnNames = { "fecha", "tienda_id", "caja_id" } )
)
public class Movimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fecha;

    @ManyToOne
    @JoinColumn(name = "tienda_id")
    private Tienda tienda;

    @ManyToOne
    @JoinColumn(name = "caja_id")
    private Caja caja;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal efectivo;

    @Column(precision = 15, scale = 2)
    private BigDecimal cajaActual;
    @Column(precision = 15, scale = 2)
    private BigDecimal daviplata;
    @Column(precision = 15, scale = 2)
    private BigDecimal texito;
    @Column(precision = 15, scale = 2)
    private BigDecimal codensa;
    @Column(precision = 15, scale = 2)
    private BigDecimal addi;
    @Column(precision = 15, scale = 2)
    private BigDecimal sistecredito;
    @Column(precision = 15, scale = 2)
    private BigDecimal tc;
    @Column(precision = 15, scale = 2)
    private BigDecimal tefOgloba;
    @Column(precision = 15, scale = 2)
    private BigDecimal qrCuentaSraPaty;
    @Column(precision = 15, scale = 2)
    private BigDecimal tarjetaBigPass;
    @Column(precision = 15, scale = 2)
    private BigDecimal tarjetaSodexo;
    @Column(precision = 15, scale = 2)
    private BigDecimal bonoBigPass;
    @Column(precision = 15, scale = 2)
    private BigDecimal bonoSodexo;
    @Column(precision = 15, scale = 2)
    private BigDecimal certificadoDotacion;
    @Column(precision = 15, scale = 2)
    private BigDecimal ventaPaginaWeb;
    @Column(precision = 15, scale = 2)
    private BigDecimal tarjetaRegalo;
    @Column(precision = 15, scale = 2)
    private BigDecimal voucherUrban;
    @Column(precision = 15, scale = 2)
    private BigDecimal voucherStyle;
    @Column(precision = 15, scale = 2)
    private BigDecimal voucherDatafono4;
    @Column(precision = 15, scale = 2)
    private BigDecimal abonoSistet;
    @Column(precision = 15, scale = 2)
    private BigDecimal gastos;
    @Column(precision = 15, scale = 2)
    private BigDecimal totalparcial;
    @Column(precision = 15, scale = 2)
    private BigDecimal totalabosiste;
    @Column(precision = 15, scale = 2)
    private BigDecimal bonosvendidos;
    @Column(precision = 15, scale = 2)
    private BigDecimal cajaanterior;
    @Column(precision = 15, scale = 2)
    private BigDecimal venta;
    @Column(precision = 15, scale = 2)
    private BigDecimal total;
    @Column(precision = 15, scale = 2)
    private BigDecimal diferencia;
    private String observaciones;
    private Boolean editable = true;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

    @PrePersist
    protected void onCreate() {
        if (this.editable == null) {
            this.editable = true;
        }
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }


    // Getters and Setters

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

    public Caja getCaja() {
        return caja;
    }

    public void setCaja(Caja caja) {
        this.caja = caja;
    }

    public Tienda getTienda() {
        return tienda;
    }

    public void setTienda(Tienda tienda) {
        this.tienda = tienda;
    }

    public BigDecimal getEfectivo() {
        return efectivo;
    }

    public void setEfectivo(BigDecimal efectivo) {
        this.efectivo = efectivo;
    }

    public BigDecimal getcajaActual() {
        return cajaActual;
    }

    public void setcajaActual(BigDecimal cajaActual) {
        this.cajaActual = cajaActual;
    }

    public BigDecimal getDaviplata() {
        return daviplata;
    }

    public void setDaviplata(BigDecimal daviplata) {
        this.daviplata = daviplata;
    }

    public BigDecimal getTexito() {
        return texito;
    }

    public void setTexito(BigDecimal texito) {
        this.texito = texito;
    }

    public BigDecimal getCodensa() {
        return codensa;
    }

    public void setCodensa(BigDecimal codensa) {
        this.codensa = codensa;
    }

    public BigDecimal getAddi() {
        return addi;
    }

    public void setAddi(BigDecimal addi) {
        this.addi = addi;
    }

    public BigDecimal getSistecredito() {
        return sistecredito;
    }

    public void setSistecredito(BigDecimal sistecredito) {
        this.sistecredito = sistecredito;
    }

    public BigDecimal getTc() {
        return tc;
    }

    public void setTc(BigDecimal tc) {
        this.tc = tc;
    }

    public BigDecimal getTefOgloba() {
        return tefOgloba;
    }

    public void setTefOgloba(BigDecimal tefOgloba) {
        this.tefOgloba = tefOgloba;
    }

    public BigDecimal getQrCuentaSraPaty() {
        return qrCuentaSraPaty;
    }

    public void setQrCuentaSraPaty(BigDecimal qrCuentaSraPaty) {
        this.qrCuentaSraPaty = qrCuentaSraPaty;
    }

    public BigDecimal getTarjetaBigPass() {
        return tarjetaBigPass;
    }

    public void setTarjetaBigPass(BigDecimal tarjetaBigPass) {
        this.tarjetaBigPass = tarjetaBigPass;
    }

    public BigDecimal getTarjetaSodexo() {
        return tarjetaSodexo;
    }

    public void setTarjetaSodexo(BigDecimal tarjetaSodexo) {
        this.tarjetaSodexo = tarjetaSodexo;
    }

    public BigDecimal getBonoBigPass() {
        return bonoBigPass;
    }

    public void setBonoBigPass(BigDecimal bonoBigPass) {
        this.bonoBigPass = bonoBigPass;
    }

    public BigDecimal getBonoSodexo() {
        return bonoSodexo;
    }

    public void setBonoSodexo(BigDecimal bonoSodexo) {
        this.bonoSodexo = bonoSodexo;
    }

    public BigDecimal getCertificadoDotacion() {
        return certificadoDotacion;
    }

    public void setCertificadoDotacion(BigDecimal certificadoDotacion) {
        this.certificadoDotacion = certificadoDotacion;
    }

    public BigDecimal getVentaPaginaWeb() {
        return ventaPaginaWeb;
    }

    public void setVentaPaginaWeb(BigDecimal ventaPaginaWeb) {
        this.ventaPaginaWeb = ventaPaginaWeb;
    }

    public BigDecimal getTarjetaRegalo() {
        return tarjetaRegalo;
    }

    public void setTarjetaRegalo(BigDecimal tarjetaRegalo) {
        this.tarjetaRegalo = tarjetaRegalo;
    }

    public BigDecimal getVoucherUrban() {
        return voucherUrban;
    }

    public void setVoucherUrban(BigDecimal voucherUrban) {
        this.voucherUrban = voucherUrban;
    }

    public BigDecimal getVoucherStyle() {
        return voucherStyle;
    }

    public void setVoucherStyle(BigDecimal voucherStyle) {
        this.voucherStyle = voucherStyle;
    }

    public BigDecimal getVoucherDatafono4() {
        return voucherDatafono4;
    }

    public void setVoucherDatafono4(BigDecimal voucherDatafono4) {
        this.voucherDatafono4 = voucherDatafono4;
    }

    public BigDecimal getAbonoSistet() {
        return abonoSistet;
    }

    public void setAbonoSistet(BigDecimal abonoSistet) {
        this.abonoSistet = abonoSistet;
    }

    public BigDecimal getGastos() {
        return gastos;
    }

    public void setGastos(BigDecimal gastos) {
        this.gastos = gastos;
    }

    public BigDecimal getTotalparcial() {
        return totalparcial;
    }
    public void setTotalparcial(BigDecimal totalparcial) {
        this.totalparcial = totalparcial;
    }
    public BigDecimal getTotalabosiste() {
        return totalabosiste;
    }
    public void setTotalabosiste(BigDecimal totalabosiste) {
        this.totalabosiste = totalabosiste;
    }
    public BigDecimal getBonosvendidos() {
        return bonosvendidos;
    }
    public void setBonosvendidos(BigDecimal bonosvendidos) {
        this.bonosvendidos = bonosvendidos;
    }
    public BigDecimal getCajaanterior() {
        return cajaanterior;
    }
    public void setCajaanterior(BigDecimal cajaanterior) {
        this.cajaanterior = cajaanterior;
    }
    public BigDecimal getVenta() {
        return venta;
    }
    public void setVenta(BigDecimal venta) {
        this.venta = venta;
    }
    public BigDecimal getTotal() {
        return total;
    }
    public void setTotal(BigDecimal total) {
        this.total = total;
    }
    public BigDecimal getDiferencia() {
        return diferencia;
    }
    public void setDiferencia(BigDecimal diferencia) {
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
    
    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }

}