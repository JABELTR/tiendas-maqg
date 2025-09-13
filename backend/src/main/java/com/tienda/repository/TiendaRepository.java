package com.tienda.repository;

import com.tienda.model.Tienda;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

public interface TiendaRepository extends JpaRepository<Tienda, Long> {
    // Buscar usuario por id (clave primaria)
    @NonNull
    Optional<Tienda> findById(@NonNull Long id);

    // Buscar usuario por infoAddi (clave primaria)
    @NonNull
    Optional<Tienda> findByInfoAddi(String infoAddi);

    // Buscar usuario por infoAddi (clave primaria)
    @NonNull
    Optional<Tienda> findByInfoSiste(String infoSiste);

    // Listar todos las tiendas
    @NonNull
    List<Tienda> findAll();
}