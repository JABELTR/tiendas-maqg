package com.tienda.auth;

public class LoginResponse {

    private String token;
    private Boolean requiereCambioPassword;
    private Long tiendaId;
    private String rol;

    // Constructor vacío (opcional para frameworks como Spring)
    public LoginResponse() {
    }

    // Constructor con parámetros
    public LoginResponse(String token, Boolean requiereCambioPassword, Long tiendaId, String rol) {
        this.token = token;
        this.requiereCambioPassword = requiereCambioPassword;
        this.tiendaId = tiendaId;
        this.rol = rol;
    }

    // Getters y Setters

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Boolean getRequiereCambioPassword() {
        return requiereCambioPassword;
    }

    public void setRequiereCambioPassword(Boolean requiereCambioPassword) {
        this.requiereCambioPassword = requiereCambioPassword;
    }
    public Long getTiendaId() {
        return tiendaId;
    }   
    public void setTiendaId(Long tiendaId) {
        this.tiendaId = tiendaId;
    }
    public String getRol() {
        return rol;
    }
    public void setRol(String rol) {
        this.rol = rol;
    }    
}

