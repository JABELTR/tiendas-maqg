package com.tienda.auth;

public class LoginRequest {

    private String email;
    private String password;

    // Constructor vacío (requerido por Spring Boot para hacer el binding del JSON)
    public LoginRequest() {
    }

    // Getters y Setters

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setpassword(String password) {
        this.password = password;
    }
}
