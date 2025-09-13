package com.tienda.controller;

import com.tienda.model.Caja;
import com.tienda.service.CajaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cajas")
public class CajaController {

    @Autowired
    private CajaService cajaService;

    @GetMapping
    public ResponseEntity<List<Caja>> listarCajas() {
        return ResponseEntity.ok(cajaService.listarCajas());
    }

    @PostMapping("/crear")
    public ResponseEntity<Caja> crearCaja(@RequestBody Map<String, Object> body) {
        String descripcion = (String) body.get("descripcion");
        String datafono = (String) body.get("datafono");
        Boolean eskoaj = Boolean.valueOf(body.get("eskoaj").toString());
        Long tiendaId = Long.valueOf(body.get("tiendaId").toString());

        return ResponseEntity.ok(cajaService.guardarCaja(tiendaId, descripcion, datafono,eskoaj));
    }

    @PutMapping("/actualizar")
    public ResponseEntity<Caja> actualizarCaja(@RequestBody Map<String, Object> body) {
        Long id = Long.valueOf(body.get("id").toString());
        String descripcion = (String) body.get("descripcion");
        String datafono = (String) body.get("datafono");
        Boolean eskoaj = Boolean.valueOf(body.get("eskoaj").toString());
        Long tiendaId = body.containsKey("tiendaId") ? Long.valueOf(body.get("tiendaId").toString()) : null;
        return ResponseEntity.ok(cajaService.actualizarCaja(id, descripcion, datafono, eskoaj, tiendaId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarCaja(@PathVariable Long id) {
    cajaService.eliminarCaja(id);

    return ResponseEntity.ok("Caja eliminada exitosamente");
}

}