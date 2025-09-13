package com.tienda.service;

import com.tienda.model.Auditoria;
import com.tienda.repository.AuditoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuditoriaService {

    @Autowired
    private AuditoriaRepository auditoriaRepository;

    public void registrar(String usuarioEmail, String accion, String entidad, String descripcion) {
        auditoriaRepository.save(new Auditoria(usuarioEmail, accion, entidad, descripcion));
    }
}
