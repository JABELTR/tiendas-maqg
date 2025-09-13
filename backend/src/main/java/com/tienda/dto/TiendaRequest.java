package com.tienda.dto;

public class TiendaRequest {
    
    private Long id;
    private String descripcion;
    private String infoAddi;
    private String infoSiste;
    
    // Getters and Setters
    
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
}
