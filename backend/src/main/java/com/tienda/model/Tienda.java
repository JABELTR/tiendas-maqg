package com.tienda.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "tiendas")
public class Tienda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descripcion;

    private String infoAddi;

    private String infoSiste;


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


    public Tienda() {
    }

    public Tienda(String descripcion, String infoAddi, String infoSiste) {
        this.descripcion = descripcion;
        this.infoAddi = infoAddi;
        this.infoSiste = infoSiste;
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

    public String getinfoAddi() {
        return infoAddi;
    }   

    public void setinfoAddi(String infoAddi) {
        this.infoAddi = infoAddi;
    }   

    public String getinfoSiste() {
        return infoSiste;
    }

    public void setinfoSiste(String infoSiste) {
        this.infoSiste = infoSiste;
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