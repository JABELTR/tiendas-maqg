package com.tienda.controller;

import com.tienda.model.Auditoria;
import com.tienda.repository.AuditoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auditoria")
public class AuditoriaController {

    @Autowired
    private AuditoriaRepository auditoriaRepository;

    // Obtener todos los registros
    @GetMapping
    public List<Auditoria> listar() {
        return auditoriaRepository.findAll();
    }

    // Filtrar por usuario (optimizadamente)
    @GetMapping("/usuario/{email}")
    public List<Auditoria> buscarPorUsuario(@PathVariable String email) {
        return auditoriaRepository.findByUsuarioEmailIgnoreCase(email);
    }

    // Registrar una auditoría desde un JSON
    @PostMapping("/registrar")
    public Auditoria registrarAuditoria(@RequestBody Auditoria auditoria) {
        return auditoriaRepository.save(auditoria);
    }
}
