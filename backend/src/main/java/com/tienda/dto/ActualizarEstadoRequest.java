package com.tienda.dto;

public class ActualizarEstadoRequest {
    private String email;
    private Boolean activo;

    public String getEmail() {
        return email;
    }

    public void setemail(String email) {
        this.email = email;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}
