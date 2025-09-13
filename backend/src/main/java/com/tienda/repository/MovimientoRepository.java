package com.tienda.repository;

import com.tienda.model.Caja;
import com.tienda.model.Movimiento;
import com.tienda.model.Tienda;
import com.tienda.repository.projection.SumaAddiPorEmail;
import com.tienda.repository.projection.SumaRedebanPorDatafono;
import com.tienda.repository.projection.SumaSistePorEmail;
import com.tienda.dto.MovimientoConsolidadoDTO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface MovimientoRepository extends JpaRepository<Movimiento, Long>, JpaSpecificationExecutor<Movimiento> {

    boolean existsByTienda(Tienda tienda);
    boolean existsByCaja(Caja caja);

    @Query("SELECT m FROM Movimiento m ORDER BY m.fecha, m.tienda DESC")
    List<Movimiento> findAllOrderByFechaAndTiendaDesc();

    // NUEVO: Consulta para consolidado de movimientos
    
    @Query("""
        SELECT new com.tienda.dto.MovimientoConsolidadoDTO(
            :fechaInicio,
            :fechaFin,
            
            m.tienda.descripcion,
            m.caja.descripcion,
            SUM(m.efectivo),
            SUM(m.cajaActual),
            SUM(m.daviplata),
            SUM(m.texito),
            SUM(m.codensa),
            SUM(m.addi),
            SUM(m.sistecredito),
            SUM(m.tc),
            SUM(m.tefOgloba),
            SUM(m.qrCuentaSraPaty),
            SUM(m.tarjetaBigPass),
            SUM(m.tarjetaSodexo),
            SUM(m.bonoBigPass),
            SUM(m.bonoSodexo),
            SUM(m.certificadoDotacion),
            SUM(m.ventaPaginaWeb),
            SUM(m.tarjetaRegalo),
            SUM(m.voucherUrban),
            SUM(m.voucherStyle),
            SUM(m.voucherDatafono4),
            SUM(m.abonoSistet),
            SUM(m.gastos),
            SUM(m.totalparcial),
            SUM(m.totalabosiste),
            SUM(m.bonosvendidos),
            SUM(m.cajaanterior),
            SUM(m.venta),
            SUM(m.total),
            SUM(m.diferencia)
        )
        FROM Movimiento m
        WHERE m.fecha BETWEEN :fechaInicio AND :fechaFin
          AND (:tiendaId IS NULL OR m.tienda.id = :tiendaId)
          AND (:cajaId IS NULL OR m.caja.id = :cajaId)
        GROUP BY m.tienda.descripcion, m.caja.descripcion
        ORDER BY m.tienda.descripcion, m.caja.descripcion
    """)
    List<MovimientoConsolidadoDTO> consolidarMovimientos(
        @Param("fechaInicio") LocalDate fechaInicio,
        @Param("fechaFin") LocalDate fechaFin,
        @Param("tiendaId") Long tiendaId,
        @Param("cajaId") Long cajaId
    );
    @Query("""
        SELECT new com.tienda.dto.MovimientoConsolidadoDTO(
            :fechaInicio,
            :fechaFin,
            
            'Todas las Tiendas',
            'Todas las Cajas',
            SUM(m.efectivo),
            SUM(m.cajaActual),
            SUM(m.daviplata),
            SUM(m.texito),
            SUM(m.codensa),
            SUM(m.addi),
            SUM(m.sistecredito),
            SUM(m.tc),
            SUM(m.tefOgloba),
            SUM(m.qrCuentaSraPaty),
            SUM(m.tarjetaBigPass),
            SUM(m.tarjetaSodexo),
            SUM(m.bonoBigPass),
            SUM(m.bonoSodexo),
            SUM(m.certificadoDotacion),
            SUM(m.ventaPaginaWeb),
            SUM(m.tarjetaRegalo),
            SUM(m.voucherUrban),
            SUM(m.voucherStyle),
            SUM(m.voucherDatafono4),
            SUM(m.abonoSistet),
            SUM(m.gastos),
            SUM(m.totalparcial),
            SUM(m.totalabosiste),
            SUM(m.bonosvendidos),
            SUM(m.cajaanterior),
            SUM(m.venta),
            SUM(m.total),
            SUM(m.diferencia)
        )
        FROM Movimiento m
            WHERE m.fecha BETWEEN :fechaInicio AND :fechaFin
        """)
    List<MovimientoConsolidadoDTO> consolidarTodos(
        @Param("fechaInicio") LocalDate fechaInicio,
        @Param("fechaFin") LocalDate fechaFin
    );

    @Query("""
        SELECT new com.tienda.dto.MovimientoConsolidadoDTO(
            :fechaInicio,
            :fechaFin,
            
            m.tienda.descripcion,
            'Todas las Cajas',
            SUM(m.efectivo),
            SUM(m.cajaActual),
            SUM(m.daviplata),
            SUM(m.texito),
            SUM(m.codensa),
            SUM(m.addi),
            SUM(m.sistecredito),
            SUM(m.tc),
            SUM(m.tefOgloba),
            SUM(m.qrCuentaSraPaty),
            SUM(m.tarjetaBigPass),
            SUM(m.tarjetaSodexo),
            SUM(m.bonoBigPass),
            SUM(m.bonoSodexo),
            SUM(m.certificadoDotacion),
            SUM(m.ventaPaginaWeb),
            SUM(m.tarjetaRegalo),
            SUM(m.voucherUrban),
            SUM(m.voucherStyle),
            SUM(m.voucherDatafono4),
            SUM(m.abonoSistet),
            SUM(m.gastos),
            SUM(m.totalparcial),
            SUM(m.totalabosiste),
            SUM(m.bonosvendidos),
            SUM(m.cajaanterior),
            SUM(m.venta),
            SUM(m.total),
            SUM(m.diferencia)
        )
        FROM Movimiento m
            WHERE m.fecha BETWEEN :fechaInicio AND :fechaFin
            AND (:tiendaId IS NULL OR m.tienda.id = :tiendaId)
        GROUP BY m.tienda.descripcion
        ORDER BY m.tienda.descripcion                
            """)
    List<MovimientoConsolidadoDTO> consolidarTienda(
        @Param("fechaInicio") LocalDate fechaInicio,
        @Param("fechaFin") LocalDate fechaFin,
        @Param("tiendaId") Long tiendaId
    );

    @Query("SELECT m.cajaActual FROM Movimiento m " +
           "WHERE m.fecha < :fecha AND m.tienda.id = :tiendaId AND m.caja.id = :cajaId " +
           "ORDER BY m.fecha DESC LIMIT 1")
    List<BigDecimal> encontrarcajaActualUltimoAntesDeFecha(@Param("tiendaId") Long tiendaId,
                                                     @Param("cajaId") Long cajaId,
                                                        @Param("fecha") LocalDate fecha);
    List<Movimiento> findByFecha(LocalDate fecha);
    List<Movimiento> findByFechaAndTiendaId(LocalDate fecha, Long tiendaId);
    List<Movimiento> findByFechaAndCajaId(LocalDate fecha, Long cajaId);
    List<Movimiento> findByFechaAndTiendaIdAndCajaId(LocalDate fecha, Long tiendaId, Long cajaId);

    List<Movimiento> findByTiendaId(Long tiendaId);
    List<Movimiento> findByCajaId(Long cajaId);
    List<Movimiento> findByTiendaIdAndCajaId(Long tiendaId, Long cajaId);

    @Query("""
           SELECT t.infoAddi AS email, COALESCE(SUM(m.addi), 0) AS totalAddi
           FROM Movimiento m
           JOIN m.tienda t
           WHERE m.fecha BETWEEN :inicio AND :fin
             AND t.infoAddi IN :emails
           GROUP BY t.infoAddi
           """)
    List<SumaAddiPorEmail> sumarAddiPorEmailEnRango(
            @Param("inicio") LocalDate inicio,
            @Param("fin") LocalDate fin,
            @Param("emails") List<String> emails
    );

    @Query("""
           SELECT t.infoSiste AS email, COALESCE(SUM(m.sistecredito), 0) AS totalSiste
           FROM Movimiento m
           JOIN m.tienda t
           WHERE m.fecha BETWEEN :inicio AND :fin
             AND t.infoSiste IN :emails
           GROUP BY t.infoSiste
           """)
    List<SumaSistePorEmail> sumarSistePorEmailEnRango(
            @Param("inicio") LocalDate inicio,
            @Param("fin") LocalDate fin,
            @Param("emails") List<String> emails
    );

@Query(value = """
        SELECT c.datafono AS datafono,
               SUM(
                   CASE WHEN c.eskoaj = true
                        THEN COALESCE(m.tc,0) + COALESCE(m.daviplata,0) + COALESCE(m.codensa,0)
                             + COALESCE(m.tarjeta_sodexo,0) + COALESCE(m.tarjeta_big_pass,0)
                        ELSE COALESCE(m.tc,0) + COALESCE(m.daviplata,0) + COALESCE(m.codensa,0)
                   END
               ) AS totalRedeban
        FROM movimientos m
        INNER JOIN cajas c ON m.caja_id = c.id
        WHERE m.fecha BETWEEN :inicio AND :fin
          AND c.datafono IN (:datafonos)
        GROUP BY c.datafono
        """, nativeQuery = true)
List<SumaRedebanPorDatafono> sumarRedebanPorTerminal(
    @Param("inicio") LocalDate inicio,
    @Param("fin") LocalDate fin,
    @Param("datafonos") List<String> datafonos);
}
