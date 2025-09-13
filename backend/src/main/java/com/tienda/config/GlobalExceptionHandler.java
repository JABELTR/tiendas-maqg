package com.tienda.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAll(Exception ex) {
        ex.printStackTrace(); // Te muestra el error en consola
        return ResponseEntity.status(500).body("❌ Error interno: " + ex.getMessage());
    }
}
