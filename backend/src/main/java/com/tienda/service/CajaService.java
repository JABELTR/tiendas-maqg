package com.tienda.service;

import com.tienda.model.Caja;
import com.tienda.model.Tienda;
import com.tienda.repository.CajaRepository;
import com.tienda.repository.MovimientoRepository;
import com.tienda.repository.TiendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CajaService {

    @Autowired
    private CajaRepository cajaRepository;

    @Autowired
    private TiendaRepository tiendaRepository;

    public List<Caja> listarCajas() {
        return cajaRepository.findAll();
    }

    public Caja guardarCaja(Long tiendaId, String descripcion, String datafono, Boolean eskoaj) {
        Tienda tienda = tiendaRepository.findById(tiendaId)
            .orElseThrow(() -> new RuntimeException("Tienda no encontrada"));
        Caja caja = new Caja(descripcion, datafono, eskoaj, tienda);
        return cajaRepository.save(caja);
    }

    public Caja actualizarCaja(Long id, String descripcion, String datafono, Boolean eskoaj,Long tiendaId) {
        Caja caja = cajaRepository.findById(id).orElseThrow(() -> new RuntimeException("Caja no encontrada"));
        caja.setDescripcion(descripcion);
        caja.setDatafono(datafono);
        caja.setEskoaj(eskoaj);
        if (tiendaId != null) {
            Tienda tienda = tiendaRepository.findById(tiendaId)
                .orElseThrow(() -> new RuntimeException("Tienda no encontrada"));
            caja.setTienda(tienda);
        }
        return cajaRepository.save(caja);
    }

    @Autowired
    private MovimientoRepository movimientoRepository;

    public void eliminarCaja(Long id) {
    Caja caja = cajaRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Caja no encontrada"));

    boolean tieneMovimientos = movimientoRepository.existsByCaja(caja);
    
    System.out.println("Caja tiene Movimientos? " + tieneMovimientos);

    if (tieneMovimientos) {
        throw new RuntimeException("No se puede eliminar la caja. Tiene movimientos asociados.");
    }

    cajaRepository.delete(caja);
}

}