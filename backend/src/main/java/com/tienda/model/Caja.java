package com.tienda.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "cajas")
public class Caja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descripcion;

    private String datafono;

    boolean eskoaj;

    @ManyToOne
    @JoinColumn(name = "tienda_id")
    private Tienda tienda;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @PrePersist
    protected void onCreate() {
    this.fechaCreacion = LocalDateTime.now();
    this.fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }

    public Caja() {}

    public Caja(String descripcion, String datafono,Boolean eskoaj,Tienda tienda) {
        this.descripcion = descripcion;
        this.datafono = datafono;
        this.eskoaj = eskoaj;
        this.tienda = tienda;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public String getDatafono() {
        return datafono;
    }
    public void setDatafono(String datafono) {
        this.datafono = datafono;
    }
    public boolean getEskoaj() {
        return eskoaj;
    }
    public void setEskoaj(boolean eskoaj) {
        this.eskoaj = eskoaj;
    }
    public Tienda getTienda() {
        return tienda;
    }

    public void setTienda(Tienda tienda) {
        this.tienda = tienda;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }        
}