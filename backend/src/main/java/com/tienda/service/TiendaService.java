package com.tienda.service;

import com.tienda.model.Tienda;
import com.tienda.repository.CajaRepository;
import com.tienda.repository.MovimientoRepository;
import com.tienda.repository.TiendaRepository;
import com.tienda.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TiendaService {

    @Autowired
    private TiendaRepository tiendaRepository;

    public List<Tienda> listarTiendas() {
        return tiendaRepository.findAll();
    }

    public Tienda crearTienda(Tienda tienda) {
        return tiendaRepository.save(tienda);
    }

    public Tienda actualizarTienda(Long id, String descripcion, String infoAddi, String infoSiste) {
        Tienda tienda = tiendaRepository.findById(id).orElseThrow(() -> new RuntimeException("Tienda no encontrada"));
        tienda.setDescripcion(descripcion);
        tienda.setinfoAddi(infoAddi); // Assuming you want to keep the same infoAddi
        tienda.setinfoSiste(infoSiste); // Assuming you want to keep the same infoSiste
        return tiendaRepository.save(tienda);
    }

    public Tienda obtenerTiendaPorId(Long id) {
        return tiendaRepository.findById(id).orElseThrow(() -> new RuntimeException("Tienda no encontrada"));
    }   

    public Tienda obtenerTiendaPorInfoAddi(String infoAddi) {
        return tiendaRepository.findByInfoAddi(infoAddi).orElseThrow(() -> new RuntimeException("Tienda no encontrada por infoAddi"));
    }   

    public Tienda obtenerTiendaPorInfoSiste(String infoSiste) {
        return tiendaRepository.findByInfoSiste(infoSiste).orElseThrow(() -> new RuntimeException("Tienda no encontrada por infoSiste"));
    }   

@Autowired
private UsuarioRepository usuarioRepository;

@Autowired
private CajaRepository cajaRepository;

@Autowired
private MovimientoRepository movimientoRepository;

public void eliminarTienda(Long id) {
    Tienda tienda = tiendaRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Tienda no encontrada"));

    boolean tieneUsuarios = usuarioRepository.existsByTienda(tienda);
    boolean tieneCajas = cajaRepository.existsByTienda(tienda);
    boolean tieneMovimientos = movimientoRepository.existsByTienda(tienda);

    if (tieneUsuarios || tieneCajas || tieneMovimientos) {
        throw new RuntimeException("No se puede eliminar la tienda. Tiene datos asociados.");
    }

    tiendaRepository.delete(tienda);
}

}