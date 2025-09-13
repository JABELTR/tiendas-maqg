package com.tienda.repository;

import com.tienda.model.Tienda;
import com.tienda.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.lang.NonNull;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Buscar usuario por su email (clave primaria)
    Optional<Usuario> findByEmail(String email);

    // Validar si un email ya existe
    boolean existsByemail(String email);

    boolean existsByTienda(Tienda tienda);


    // Listar usuarios activos
    List<Usuario> findByActivo(Boolean activo);

    // Listar todos los usuarios
    @NonNull
    List<Usuario> findAll();
}
