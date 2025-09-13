package com.tienda.controller;

import com.tienda.auth.*;
import com.tienda.model.Usuario;
import com.tienda.repository.UsuarioRepository;
import com.tienda.security.JwtUtil;
import com.tienda.service.UsuarioService;
// Ensure the correct package path for RegistroCorreoRequest
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import com.tienda.service.AuditoriaService; // Ensure this path matches the actual location of AuditoriaService
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuditoriaService auditoriaService;
    

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            System.out.println("👉 Iniciando autenticación...");
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            System.out.println("✅ Autenticación completada para: " + auth.getName());
            System.out.println("👉 Iniciando busqueda de email...");
            Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            System.out.println("✅ Usuario email  : " + usuario.getEmail());
            System.out.println("✅ Usuario rol    : " + usuario.getRol());
            if (usuario.getTienda() != null) {
                System.out.println("✅ Usuario tienda : " + usuario.getTienda().getId());
            }
            System.out.println("👉 Verificando estado de la cuenta...");    
            if (!usuario.getActivo()) {
                throw new RuntimeException("Tu cuenta aún no está activa. Espera autorización del administrador.");
            }
            System.out.println("✅ Usuario activo: " + usuario.getActivo());
            
            System.out.println("👉 Verificando token..."); 
            Long tiendaId = usuario.getTienda() != null ? usuario.getTienda().getId() : null;
            try {
                String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol(), tiendaId);
                System.out.println("✅ token: " + token);
                auditoriaService.registrar(
                   usuario.getEmail(),
                    "LOGIN",
                    "Auth",
                     "Usuario inició sesión exitosamente"
                );

                return ResponseEntity.ok(new LoginResponse(token, usuario.getRequiereCambioPassword(), tiendaId, usuario.getRol()));

            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body(new LoginResponse("❌ Error JWT: " + e.getMessage(), false, null, null));
            }
        // This line is removed as it is unreachable and causes a compile error
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(new LoginResponse("Credenciales inválidas", false, null, null));
        } catch (DisabledException e) {
            return ResponseEntity.status(403).body(new LoginResponse("Usuario inactivo", false, null, null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new LoginResponse("Error interno del servidor", false, null, null));
        }
    }

    @PutMapping("/cambiar-password")
    public ResponseEntity<String> cambiarPassword(@RequestBody CambiarPasswordRequest request) {
        System.out.println("✅ email     : " + request.getEmail());
        System.out.println("✅ nuevapasss: " + request.getNuevaPassword());
        usuarioService.cambiarPassword(request.getEmail(), request.getNuevaPassword());

                auditoriaService.registrar(
                   request.getEmail(),
                    "CAMBIAR_PASSWORD",
                    "Auth",
                     "Usuario cambió password exitosamente"
                );
        return ResponseEntity.ok("password cambiada exitosamente");
    }

    @PostMapping("/registrar-usuario")
    public ResponseEntity<String> registrarUsuario(@RequestBody RegistroUsuarioRequest request) {
        usuarioService.registrarNuevoUsuario(request);

                auditoriaService.registrar(
                   request.getEmail(),
                    "REGISTRO",
                    "Auth",
                     "Usuario se registró exitosamente"
                );

        return ResponseEntity.ok("Usuario registrado exitosamente. Espera activación por parte del administrador.");
    }
}
