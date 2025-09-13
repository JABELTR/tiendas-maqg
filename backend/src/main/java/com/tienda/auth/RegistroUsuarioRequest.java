package com.tienda.auth;



public class RegistroUsuarioRequest {

    private String email;
    private String password;
    private String nombre;
    private String apellido;
    private String rol = "USER"; // Asignar el rol por defecto
    private Long tienda; // Asignar la tienda desde el request
    
    

    // Constructor vacío
    public RegistroUsuarioRequest() {}

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

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }
    public String getRol() {
        return rol;
    }
    public void setRol(String rol) {
        this.rol = rol;
    }

    public Long getTienda() {
        return tienda;
    }

    public void setTienda(Long tienda) {
        this.tienda = tienda;
    }
}
