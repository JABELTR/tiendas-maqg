package com.tienda.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test-auth")
public class TestAuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping
    public String testAuth(@RequestParam String email, @RequestParam String contraseña) {
        
        try {
            
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, contraseña)
            );
            return "✅ Autenticación exitosa: " + auth.getName();
        } catch (BadCredentialsException e) {
            return "❌ Credenciales incorrectas";
        } catch (DisabledException e) {
            return "❌ Usuario inactivo";
        } catch (Exception e) {
            e.printStackTrace();
            return "❌ Error: " + e.getMessage();
        }
    }
}

