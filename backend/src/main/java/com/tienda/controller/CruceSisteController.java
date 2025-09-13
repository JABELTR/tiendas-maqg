// src/main/java/com/tienda/controller/CruceSisteController.java
package com.tienda.controller;

import com.tienda.dto.CruceSisteRow;
import com.tienda.service.CruceSisteService;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cruce-Siste")
@CrossOrigin(origins = "*")
public class CruceSisteController {

    private final CruceSisteService service;

    public CruceSisteController(CruceSisteService service) {
        this.service = service;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> upload(
            @RequestPart("file") MultipartFile file,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam(required = false) Character separator // ',' por defecto
    ) {
        try {
            List<CruceSisteRow> resp = service.ejecutarDesdeArchivo(file, fechaInicio, fechaFin, separator);
            return ResponseEntity.ok(resp);
        //} catch (Exception e) {
        //} catch (Exception e) {
        //    e.printStackTrace();
        //    return ResponseEntity.internalServerError().build();
        //}
        } catch (IllegalArgumentException e) {
            // Errores de cabeceras, fechas, formato
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error procesando CSV", "detalle", e.getMessage()));
        }
    }

@PostMapping(value = "/export-excel", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public void exportToExcel(
        @RequestPart("file") MultipartFile file,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
        @RequestParam(required = false) Character separator,
        HttpServletResponse response
) {
    try {
        List<CruceSisteRow> resp = service.ejecutarDesdeArchivo(file, fechaInicio, fechaFin, separator);

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=cruce-siste.xlsx");

        service.exportToExcel(resp, response.getOutputStream(), fechaInicio, fechaFin);

        response.flushBuffer(); // 👈 asegúrate que se escriba todo
    } catch (Exception e) {
        try {
            response.reset();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("text/plain;charset=UTF-8");
            response.getWriter().write("Error al generar Excel: " + e.getMessage());
            response.flushBuffer();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}


}

