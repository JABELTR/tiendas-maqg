package com.tienda.controller;

import com.tienda.model.Caja;
import com.tienda.repository.CajaRepository;
import com.tienda.repository.TiendaRepository;

import com.tienda.model.Movimiento;
import com.tienda.model.Tienda;
import com.tienda.service.MovimientoService;

import java.time.LocalDate;
import java.util.List;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;

import com.tienda.dto.MovimientoConsolidadoDTO;
import com.tienda.dto.MovimientoRequest; // Replace with the correct package if different

@RestController
@RequestMapping("/movimientos")
public class MovimientoController {

    @Autowired
    private MovimientoService movimientoService;


    @Autowired
    private CajaRepository cajaRepository;
    @Autowired
    private TiendaRepository tiendaRepository;

//    @GetMapping
//    public ResponseEntity<List<Movimiento>> listar() {
//        return ResponseEntity.ok(movimientoService.listarMovimientos());
//    }

    @GetMapping
    public Page<Movimiento> obtenerMovimientos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String fecha,
            @RequestParam(required = false) Long tiendaId,
            @RequestParam(required = false) Long cajaId
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("fecha").descending().and(Sort.by("tienda.id")).and(Sort.by("caja.id")));
        return movimientoService.obtenerMovimientosConFiltros(fecha, tiendaId, cajaId, pageable);
    }


    @PostMapping("/crear")
    public ResponseEntity<Movimiento> crear(@RequestBody MovimientoRequest request) {
        
        try {
             Caja caja1 = cajaRepository.findById(request.getCajaId())
            .orElseThrow(() -> new RuntimeException("Caja no encontrada"));

            Tienda tienda1 = tiendaRepository.findById(request.getTiendaId())
            .orElseThrow(() -> new RuntimeException("Tienda no encontrada"));

    // Validación: ¿la caja pertenece a esa tienda?
            if (!caja1.getTienda().getId().equals(tienda1.getId())) {
            throw new RuntimeException("La caja no pertenece a la tienda especificada");
            }
        
        Movimiento movimiento = new Movimiento();
        movimiento.setFecha(request.getFecha());
        movimiento.setCaja(caja1);
        movimiento.setTienda(tienda1);
        movimiento.setEfectivo(request.getEfectivo() != null ? java.math.BigDecimal.valueOf(request.getEfectivo()) : null);
        movimiento.setcajaActual(request.getcajaActual() != null ? java.math.BigDecimal.valueOf(request.getcajaActual()) : null);
        movimiento.setDaviplata(request.getDaviplata() != null ? java.math.BigDecimal.valueOf(request.getDaviplata()) : null);
        movimiento.setTexito(request.getTexito() != null ? java.math.BigDecimal.valueOf(request.getTexito()) : null);
        movimiento.setCodensa(request.getCodensa() != null ? java.math.BigDecimal.valueOf(request.getCodensa()) : null);
        movimiento.setAddi(request.getAddi() != null ? java.math.BigDecimal.valueOf(request.getAddi()) : null);
        movimiento.setSistecredito(request.getSistecredito() != null ? java.math.BigDecimal.valueOf(request.getSistecredito()) : null);
        movimiento.setTc(request.getTc() != null ? java.math.BigDecimal.valueOf(request.getTc()) : null);
        movimiento.setTefOgloba(request.getTefOgloba() != null ? java.math.BigDecimal.valueOf(request.getTefOgloba()) : null);
        movimiento.setQrCuentaSraPaty(request.getQrCuentaSraPaty() != null ? java.math.BigDecimal.valueOf(request.getQrCuentaSraPaty()) : null);
        movimiento.setTarjetaBigPass(request.getTarjetaBigPass() != null ? java.math.BigDecimal.valueOf(request.getTarjetaBigPass()) : null);
        movimiento.setTarjetaSodexo(request.getTarjetaSodexo() != null ? java.math.BigDecimal.valueOf(request.getTarjetaSodexo()) : null);
        movimiento.setBonoBigPass(request.getBonoBigPass() != null ? java.math.BigDecimal.valueOf(request.getBonoBigPass()) : null);
        movimiento.setBonoSodexo(request.getBonoSodexo() != null ? java.math.BigDecimal.valueOf(request.getBonoSodexo()) : null);
        movimiento.setCertificadoDotacion(request.getCertificadoDotacion() != null ? java.math.BigDecimal.valueOf(request.getCertificadoDotacion()) : null);
        movimiento.setVentaPaginaWeb(request.getVentaPaginaWeb() != null ? java.math.BigDecimal.valueOf(request.getVentaPaginaWeb()) : null);
        movimiento.setTarjetaRegalo(request.getTarjetaRegalo() != null ? java.math.BigDecimal.valueOf(request.getTarjetaRegalo()) : null);
        movimiento.setVoucherUrban(request.getVoucherUrban() != null ? java.math.BigDecimal.valueOf(request.getVoucherUrban()) : null);
        movimiento.setVoucherStyle(request.getVoucherStyle() != null ? java.math.BigDecimal.valueOf(request.getVoucherStyle()) : null);
        movimiento.setVoucherDatafono4(request.getVoucherDatafono4() != null ? java.math.BigDecimal.valueOf(request.getVoucherDatafono4()) : null);
        movimiento.setAbonoSistet(request.getAbonoSistet() != null ? java.math.BigDecimal.valueOf(request.getAbonoSistet()) : null);
        movimiento.setGastos(request.getGastos() != null ? java.math.BigDecimal.valueOf(request.getGastos()) : null);
        movimiento.setTotalparcial(request.getTotalparcial() != null ? java.math.BigDecimal.valueOf(request.getTotalparcial()) : null);
        movimiento.setTotalabosiste(request.getTotalabosiste() != null ? java.math.BigDecimal.valueOf(request.getTotalabosiste()) : null);
        movimiento.setBonosvendidos(request.getBonosvendidos() != null ? java.math.BigDecimal.valueOf(request.getBonosvendidos()) : null);
        movimiento.setCajaanterior(request.getCajaanterior() != null ? java.math.BigDecimal.valueOf(request.getCajaanterior()) : null);
        movimiento.setVenta(request.getVenta() != null ? java.math.BigDecimal.valueOf(request.getVenta()) : null);
        movimiento.setTotal(request.getTotal() != null ? java.math.BigDecimal.valueOf(request.getTotal()) : null);
        movimiento.setDiferencia(request.getDiferencia() != null ? java.math.BigDecimal.valueOf(request.getDiferencia()) : null);
        movimiento.setObservaciones(request.getObservaciones() != null ? request.getObservaciones() : "");        
        movimiento.setEditable(true); // Establece el movimiento como editable por defecto
        // Aquí puedes agregar la lógica para guardar el movimiento en la base de datos
        Movimiento actualizado = movimientoService.crear(movimiento);  

//               auditoriaService.registrar(
//                   "admin@admin.com",
//                     "CREAR_MOVIMIENTO",
//                      "movimiento",
//                      "Movimiento creado exitosamente " + actualizado.getId() );
        
        return ResponseEntity.ok(actualizado);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(400).build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // Manejo de errores
        }
    }

    @PutMapping("/actualizar")
    public ResponseEntity<Movimiento> actualizar(@RequestBody MovimientoRequest request) {
        Movimiento movimientoExistente = movimientoService.buscarPorId(request.getId());
        if (movimientoExistente == null) {
            return ResponseEntity.notFound().build();
        }
        // Validación: ¿la caja pertenece a esa tienda?
        Caja caja1 = cajaRepository.findById(request.getCajaId())
            .orElseThrow(() -> new RuntimeException("Caja no encontrada"));
        Tienda tienda1 = tiendaRepository.findById(request.getTiendaId())
            .orElseThrow(() -> new RuntimeException("Tienda no encontrada"));
        if (!caja1.getTienda().getId().equals(tienda1.getId())) {
            throw new RuntimeException("La caja no pertenece a la tienda especificada");
        }
        // Actualiza los campos de la entidad existente
        movimientoExistente.setFecha(request.getFecha());
        movimientoExistente.setCaja(caja1);
        movimientoExistente.setTienda(tienda1);
        movimientoExistente.setEfectivo(request.getEfectivo() != null ? java.math.BigDecimal.valueOf(request.getEfectivo()) : null);
        movimientoExistente.setcajaActual(request.getcajaActual() != null ? java.math.BigDecimal.valueOf(request.getcajaActual()) : null);
        movimientoExistente.setDaviplata(request.getDaviplata() != null ? java.math.BigDecimal.valueOf(request.getDaviplata()) : null);
        movimientoExistente.setTexito(request.getTexito() != null ? java.math.BigDecimal.valueOf(request.getTexito()) : null);
        movimientoExistente.setCodensa(request.getCodensa() != null ? java.math.BigDecimal.valueOf(request.getCodensa()) : null);
        movimientoExistente.setAddi(request.getAddi() != null ? java.math.BigDecimal.valueOf(request.getAddi()) : null);
        movimientoExistente.setSistecredito(request.getSistecredito() != null ? java.math.BigDecimal.valueOf(request.getSistecredito()) : null);
        movimientoExistente.setTc(request.getTc() != null ? java.math.BigDecimal.valueOf(request.getTc()) : null);
        movimientoExistente.setTefOgloba(request.getTefOgloba() != null ? java.math.BigDecimal.valueOf(request.getTefOgloba()) : null);
        movimientoExistente.setQrCuentaSraPaty(request.getQrCuentaSraPaty() != null ? java.math.BigDecimal.valueOf(request.getQrCuentaSraPaty()) : null);
        movimientoExistente.setTarjetaBigPass(request.getTarjetaBigPass() != null ? java.math.BigDecimal.valueOf(request.getTarjetaBigPass()) : null);
        movimientoExistente.setTarjetaSodexo(request.getTarjetaSodexo() != null ? java.math.BigDecimal.valueOf(request.getTarjetaSodexo()) : null);
        movimientoExistente.setBonoBigPass(request.getBonoBigPass() != null ? java.math.BigDecimal.valueOf(request.getBonoBigPass()) : null);
        movimientoExistente.setBonoSodexo(request.getBonoSodexo() != null ? java.math.BigDecimal.valueOf(request.getBonoSodexo()) : null);
        movimientoExistente.setCertificadoDotacion(request.getCertificadoDotacion() != null ? java.math.BigDecimal.valueOf(request.getCertificadoDotacion()) : null);
        movimientoExistente.setVentaPaginaWeb(request.getVentaPaginaWeb() != null ? java.math.BigDecimal.valueOf(request.getVentaPaginaWeb()) : null);
        movimientoExistente.setTarjetaRegalo(request.getTarjetaRegalo() != null ? java.math.BigDecimal.valueOf(request.getTarjetaRegalo()) : null);
        movimientoExistente.setVoucherUrban(request.getVoucherUrban() != null ? java.math.BigDecimal.valueOf(request.getVoucherUrban()) : null);
        movimientoExistente.setVoucherStyle(request.getVoucherStyle() != null ? java.math.BigDecimal.valueOf(request.getVoucherStyle()) : null);
        movimientoExistente.setVoucherDatafono4(request.getVoucherDatafono4() != null ? java.math.BigDecimal.valueOf(request.getVoucherDatafono4()) : null);
        movimientoExistente.setAbonoSistet(request.getAbonoSistet() != null ? java.math.BigDecimal.valueOf(request.getAbonoSistet()) : null);
        movimientoExistente.setGastos(request.getGastos() != null ? java.math.BigDecimal.valueOf(request.getGastos()) : null);
        movimientoExistente.setTotalparcial(request.getTotalparcial() != null ? java.math.BigDecimal.valueOf(request.getTotalparcial()) : null);
        movimientoExistente.setTotalabosiste(request.getTotalabosiste() != null ? java.math.BigDecimal.valueOf(request.getTotalabosiste()) : null);
        movimientoExistente.setBonosvendidos(request.getBonosvendidos() != null ? java.math.BigDecimal.valueOf(request.getBonosvendidos()) : null);
        movimientoExistente.setCajaanterior(request.getCajaanterior() != null ? java.math.BigDecimal.valueOf(request.getCajaanterior()) : null);
        movimientoExistente.setVenta(request.getVenta() != null ? java.math.BigDecimal.valueOf(request.getVenta()) : null);
        movimientoExistente.setTotal(request.getTotal() != null ? java.math.BigDecimal.valueOf(request.getTotal()) : null);
        movimientoExistente.setDiferencia(request.getDiferencia() != null ? java.math.BigDecimal.valueOf(request.getDiferencia()) : null);
        movimientoExistente.setObservaciones(request.getObservaciones());
        movimientoExistente.setEditable(request.getEditable()); // Establece el movimiento como editable por defecto
        
        Movimiento actualizado = movimientoService.actualizar(movimientoExistente);

//               auditoriaService.registrar(
//                   "admin@admin.com",
//                     "ACTUALIZAR_MOVIMIENTO",
//                      "movimiento",
//                      "Movimiento actualizado exitosamente " + actualizado.getId() );

        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarMovimiento(@PathVariable Long id) {
    movimientoService.eliminarMovimiento(id);

//               auditoriaService.registrar(
//                   "admin@admin.com",
//                     "ELIMINAR_MOVIMIENTO",
//                      "movimiento",
//                      "Movimiento eliminado exitosamente " + id);

    return ResponseEntity.ok("Movimiento eliminado exitosamente");
}

@GetMapping("/consolidado")
public ResponseEntity<List<MovimientoConsolidadoDTO>> getConsolidado(
  @RequestParam String fechaInicio,
  @RequestParam String fechaFin,
  @RequestParam(required = false) Long tiendaId,
  @RequestParam(required = false) Long cajaId
) {
  LocalDate inicio = LocalDate.parse(fechaInicio);
  LocalDate fin = LocalDate.parse(fechaFin);
  List<MovimientoConsolidadoDTO> data = movimientoService.obtenerConsolidado(inicio, fin, tiendaId, cajaId);
  return ResponseEntity.ok(data);
}

@GetMapping("/exportar-excel")
public ResponseEntity<?> exportarMovimientosExcel(
    @RequestParam(required = false) String fecha,
    @RequestParam(required = false) Long tiendaId,
    @RequestParam(required = false) Long cajaId) {

    List<Movimiento> lista = movimientoService.filtrarMovimientos(fecha, tiendaId, cajaId); // Usa el mismo filtro
    try {
        return movimientoService.exportarMovimientosExcel(lista);
    } catch (IOException e) {
        return ResponseEntity.status(500).body("Error al generar Excel");
    }
}

@GetMapping("/consolidado/exportar-excel")
public ResponseEntity<?> exportarConsolidadosExcel(
        @RequestParam LocalDate fechaInicio,
        @RequestParam LocalDate fechaFin,
        @RequestParam(required = false) Long tiendaId,
        @RequestParam(required = false) Long cajaId
) {
    List<MovimientoConsolidadoDTO> lista = movimientoService.obtenerConsolidado(fechaInicio, fechaFin, tiendaId, cajaId); // Usa el mismo filtro
    try{
        return movimientoService.exportarConsolidadosExcel(lista);
    } catch (IOException e) {
        return ResponseEntity.status(500).body("Error al generar Excel");
    }
    }

@GetMapping("/caja-anterior")
public ResponseEntity<Map<String, BigDecimal>> obtenerCajaAnterior(
    @RequestParam("tiendaId") Long tiendaId,
    @RequestParam("cajaId") Long cajaId,
    @RequestParam("fecha") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha
) {
    BigDecimal valor = movimientoService.obtenerCajaAnterior(tiendaId, cajaId, fecha);
    return ResponseEntity.ok(Map.of("cajaAnterior", valor));
} 

}
