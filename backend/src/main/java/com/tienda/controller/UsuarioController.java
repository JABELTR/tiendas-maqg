package com.tienda.controller;

import com.tienda.dto.CambiarRolRequest;
import com.tienda.dto.ResetearPasswordRequest;
import com.tienda.dto.ActualizarEstadoRequest;
import com.tienda.dto.ActualizarNombreRequest;
import com.tienda.dto.AsignarTiendaRequest;
import com.tienda.model.Usuario;
import com.tienda.service.UsuarioService;
import com.tienda.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private UsuarioRepository usuarioRepository;

    
    

    // Obtener un usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuarioPorId(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(usuario);
    }

    // Listar todos los usuarios
    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }

    // Listar usuarios activos
    @GetMapping("/activos")
    public ResponseEntity<List<Usuario>> listarUsuariosActivos() {
        return ResponseEntity.ok(usuarioService.listarUsuariosActivos());
    }

    // Listar usuarios inactivos
    @GetMapping("/inactivos")
    public ResponseEntity<List<Usuario>> listarUsuariosInactivos() {
        return ResponseEntity.ok(usuarioService.listarUsuariosInactivos());
    }

    // Activar usuario (por admin)
    @PutMapping("/{id}/activar")
    public ResponseEntity<String> activarUsuario(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setActivo(true);
        usuario.setFechaActualizacion(java.time.LocalDateTime.now());
        usuarioRepository.save(usuario);

        return ResponseEntity.ok("Usuario activado exitosamente");
    }

    // Desactivar usuario (por admin)
    @PutMapping("/{id}/desactivar")
    public ResponseEntity<String> desactivarUsuario(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setActivo(false);
        usuario.setFechaActualizacion(java.time.LocalDateTime.now());
        usuarioRepository.save(usuario);

        return ResponseEntity.ok("Usuario desactivado exitosamente");
    }

    // Actualizar estado de usuario
    @PutMapping("/estado")
    public ResponseEntity<String> actualizarEstado(@RequestBody ActualizarEstadoRequest request) {
    usuarioService.actualizarEstadoUsuario(request.getEmail(), request.getActivo());

//                auditoriaService.registrar(
//                   request.getEmail(),
//                    "ACTUALIZAR_ESTADO",
//                     "Usuario",
//                     "Estado actualizado exitosamente a " + request.getActivo()
//                );

    return ResponseEntity.ok("Estado actualizado correctamente");
    }

    // Actualizar rol de usuario
    @PutMapping("/rol")
    public ResponseEntity<String> cambiarRol(@RequestBody CambiarRolRequest request) {
    usuarioService.actualizarRolUsuario(request.getEmail(), request.getRol());

//                auditoriaService.registrar(
//                   request.getEmail(),
//                    "CAMBIAR_ROL",
//                     "Usuario",
//                     "Rol actualizado exitosamente a " + request.getRol()
//                );

    return ResponseEntity.ok("Rol actualizado correctamente");
    }

    // Restablecer password (por admin)
    @PutMapping("/resetear-password")
    public ResponseEntity<String> resetearPassword(@RequestBody ResetearPasswordRequest request) {
        try {
            usuarioRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));          
            usuarioService.resetearPassword(request.getEmail());

//                auditoriaService.registrar(
//                   request.getEmail(),
//                    "RESET_PASSWORD",
//                    "Usuario",
//                     "Usuario reseteó su contraseña exitosamente"
//                );

            return ResponseEntity.ok("Contraseña actualizada correctamente");
        }catch (Exception e) {
        return ResponseEntity.status(500).body("Error al restablecer la contraseña: " + e.getMessage());
    }
    }
    
    @PutMapping("/actualizar-nombre")
    public ResponseEntity<String> actualizarNombre(@RequestBody ActualizarNombreRequest request) {
    usuarioService.actualizarNombre(request.getemail(), request.getNombre(), request.getApellido());

//                auditoriaService.registrar(
//                   request.getemail(),
//                    "ACTUALIZAR_NOMBRE",
//                     "Usuario",
//                     "Nombre y/o Apellido actualizado exitosamente" 
//                );
    return ResponseEntity.ok("Nombre actualizado correctamente");
    }
    
    @PutMapping("/asignar-tienda")
    public ResponseEntity<String> asignarTienda(@RequestBody AsignarTiendaRequest request) {
    usuarioService.asignarTienda(request.getemail(), request.gettiendaId());

//                auditoriaService.registrar(
//                   request.getemail(),
//                    "ASIGNAR_TIENDA",
//                     "Usuario",
//                     "Tienda actualizada exitosamente a " + request.gettiendaId()
//                );

    return ResponseEntity.ok("Tienda asignada");
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<String> eliminarUsuario(@PathVariable String email) {
    usuarioService.eliminarUsuarioPorEmail(email);

//                auditoriaService.registrar(
//                   email,
//                     "ELIMINAR_USUARIO",
//                     "Usuario",
//                     "Usuario eliminado exitosamente"
//                    
//                );

    return ResponseEntity.ok("Usuario eliminado exitosamente");
}

}
