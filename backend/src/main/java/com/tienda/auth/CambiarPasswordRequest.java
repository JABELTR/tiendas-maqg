package com.tienda.auth;

public class CambiarPasswordRequest {

    private String email;
    private String nuevaPassword;

    // Constructor vacío (opcional para frameworks como Spring)
    public CambiarPasswordRequest() {
    }

    // Getters y Setters

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNuevaPassword() {
        return nuevaPassword;
    }

    public void setNuevaPassword(String nuevaPassword) {
        this.nuevaPassword = nuevaPassword;
    }
}

