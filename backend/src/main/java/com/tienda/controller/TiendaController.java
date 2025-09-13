package com.tienda.controller;

import com.tienda.model.Tienda;
import com.tienda.service.TiendaService;
import com.tienda.dto.TiendaRequest; // Assuming TiendaRequest is in the 'dto' package

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tiendas")
public class TiendaController {

    @Autowired
    private TiendaService tiendaService;
    @Autowired


    // GET /tiendas → Lista todas las tiendas
    // GET /tiendas → Lista todas las tiendas
    @GetMapping
    public ResponseEntity<List<Tienda>> listarTiendas() {
        return ResponseEntity.ok(tiendaService.listarTiendas());
    }

    // GET /tiendas/{id} → Obtiene una tienda por ID
    @GetMapping("/{id}")
    public ResponseEntity<Tienda> obtenerTiendaPorId(@PathVariable Long id) {
        try {
            Tienda tienda = tiendaService.obtenerTiendaPorId(id);
            return ResponseEntity.ok(tienda);
        } catch (Exception e) {
            return ResponseEntity.notFound().build(); // Manejo de errores
        }   
        
    }

// GET /tiendas/{id} → Obtiene una tienda por ID
//    @GetMapping("/{infoAddi}")
//    public ResponseEntity<Tienda> obtenerTiendaPorInfoAddi(@PathVariable String infoAddi ) {
//        try {
//            Tienda tienda = tiendaService.obtenerTiendaPorInfoAddi(infoAddi);
//            return ResponseEntity.ok(tienda);
//        } catch (Exception e) {
//            return ResponseEntity.notFound().build(); // Manejo de errores
//        }   
//        
//    }

//    @GetMapping("/{infoSiste}")
//    public ResponseEntity<Tienda> obtenerTiendaPorInfoSiste(@PathVariable String infoSiste ) {
//        try {
//            Tienda tienda = tiendaService.obtenerTiendaPorInfoSiste(infoSiste);
//            return ResponseEntity.ok(tienda);
//        } catch (Exception e) {
//            return ResponseEntity.notFound().build(); // Manejo de errores
//        }   
//        
//    }
    
    // POST /tiendas → Crea una tienda (usa @RequestBody)
    @PostMapping("/crear")
    public ResponseEntity<Tienda> crearTienda(@RequestBody TiendaRequest TiendaRequest) {
        try {
        Tienda tienda = new Tienda();
        tienda.setDescripcion(TiendaRequest.getDescripcion());
        Tienda nueva = tiendaService.crearTienda(tienda);
        return ResponseEntity.ok(nueva);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // Manejo de errores
        }
    }

    // Actualizar tienda 
    @PutMapping("/actualizar")
    public ResponseEntity<Tienda> actualizarTienda(@RequestBody TiendaRequest Request) {
        try {
        Tienda tiendaActualizada = tiendaService.actualizarTienda(Request.getId(), Request.getDescripcion(),
                Request.getinfoAddi(), Request.getinfoSiste());
        return ResponseEntity.ok(tiendaActualizada);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // Manejo de errores
        }
    }

    // PUT /tiendas/{id} → Actualiza una tienda (usa @RequestBody y @PathVariable)
    //@PutMapping("/{id}")
    //public ResponseEntity<Tienda> actualizarTienda(@PathVariable Long id, @RequestBody Tienda tienda) {
    //    Tienda actualizada = tiendaService.actualizarTienda(id, tienda);
    //    return ResponseEntity.ok(actualizada);
    //}

    // DELETE /tiendas/{id} → Elimina una tienda
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarTienda(@PathVariable Long id) {
    tiendaService.eliminarTienda(id);
    return ResponseEntity.ok("Tienda eliminada exitosamente");
}

}
