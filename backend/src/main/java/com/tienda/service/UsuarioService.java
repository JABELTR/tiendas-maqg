package com.tienda.service;

import com.tienda.model.Tienda;
import com.tienda.model.Usuario;
import com.tienda.repository.UsuarioRepository;
import com.tienda.repository.TiendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.tienda.auth.RegistroUsuarioRequest; // Adjust the package path if necessary

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TiendaRepository tiendaRepository;

    // Buscar un usuario por su email
    public Usuario buscarPoremail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public void registrarNuevoUsuario(RegistroUsuarioRequest request) {
        // Validar si el correo ya existe
        if (usuarioRepository.existsByemail(request.getEmail())) {
            throw new RuntimeException("El correo ya está registrado");
        }
    
        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword())); // Encriptar la password
        usuario.setActivo(true); // Por defecto, el usuario está activo
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setRol(request.getRol()); // Asignar rol por defecto);
        if (request.getTienda() != null) {
            Tienda tienda = tiendaRepository.findById(request.getTienda())
                .orElseThrow(() -> new RuntimeException("Tienda no encontrada"));
            usuario.setTienda(tienda);
        } 
        usuario.setRequiereCambioPassword(true); // Forzar cambio en primer login
        usuario.setFechaCreacion(java.time.LocalDateTime.now());
        usuario.setFechaActualizacion(java.time.LocalDateTime.now());
    
        usuarioRepository.save(usuario);
    

        // Aquí debes llamar al servicio de correo para enviar el passwordTemporal
        // emailService.enviarCorreo(email, "password temporal", "Tu password es: " + passwordTemporal);
    }


    // Cambiar la password de un usuario
    public void cambiarPassword(String email, String nuevaPassword) {
        Usuario usuario = buscarPoremail(email);
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuario.setRequiereCambioPassword(false); // Si estaba pendiente de cambiar password, ya no
        usuarioRepository.save(usuario);
    }

    // Marcar usuario para que cambie la password en el próximo login
    public void forzarCambioPassword(String email) {
        Usuario usuario = buscarPoremail(email);
        usuario.setRequiereCambioPassword(true);
        usuarioRepository.save(usuario);
    }

    // Activar o desactivar usuario
    public void actualizarEstadoUsuario(String email, boolean activo) {
        Usuario usuario = buscarPoremail(email);
        usuario.setActivo(activo);
        usuarioRepository.save(usuario);
    }

    // Actualizar rol usuario
    public void actualizarRolUsuario(String email, String rol) {
        Usuario usuario = buscarPoremail(email);
        usuario.setRol(rol);
        usuario.setFechaActualizacion(java.time.LocalDateTime.now());   
        usuarioRepository.save(usuario);
    }

    // Restablecer password a un usuario (por admin)
    public void resetearPassword(String email) {
        Usuario usuario = buscarPoremail(email);
        String nuevaPasswordEncriptada = passwordEncoder.encode("1234");
        usuario.setPassword(nuevaPasswordEncriptada);
        usuario.setRequiereCambioPassword(true); // fuerza cambio en próximo login
        usuarioRepository.save(usuario);
    }

    public void actualizarNombre(String email, String nombre, String apellido) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        usuario.setFechaActualizacion(java.time.LocalDateTime.now());
        usuarioRepository.save(usuario);
    }
    public void asignarTienda(String email, Long tiendaId) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setTienda(tiendaRepository.findById(tiendaId)
            .orElseThrow(() -> new RuntimeException("Tienda no encontrada")));
        usuario.setFechaActualizacion(java.time.LocalDateTime.now());
        usuarioRepository.save(usuario);
    }

    // Listar usuarios activos
    public List<Usuario> listarUsuariosActivos() {
        return usuarioRepository.findByActivo(true);
    }

    // Listar usuarios inactivos
    public List<Usuario> listarUsuariosInactivos() {
        return usuarioRepository.findByActivo(false);
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public void eliminarUsuarioPorEmail(String email) {
    Usuario usuario = usuarioRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    usuarioRepository.delete(usuario);
}

}
