package com.tienda.repository;

import com.tienda.model.Caja;
import com.tienda.model.Tienda;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;

public interface CajaRepository extends JpaRepository<Caja, Long> {


    // Aquí puedes agregar métodos personalizados si es necesario
    // Por ejemplo, para buscar cajas por tienda o por estado
    // Buscar usuario por id (clave primaria)
    @NonNull
    Optional<Caja> findById(@NonNull Long id);

    // Listar todos las tiendas
    @NonNull
    @Query("SELECT c FROM Caja c ORDER BY c.tienda, c.descripcion ASC")
    List<Caja> findAll();

    boolean existsByTienda(Tienda tienda);

}