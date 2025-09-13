package com.tienda.service;

import com.tienda.dto.MovimientoConsolidadoDTO;
import com.tienda.model.Movimiento;
import com.tienda.repository.MovimientoRepository;

import jakarta.persistence.criteria.Predicate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.core.io.ByteArrayResource;
import java.io.IOException;
import java.io.ByteArrayOutputStream;

@Service
public class MovimientoService {

    @Autowired
    private MovimientoRepository movimientoRepository;

       public Page<Movimiento> obtenerMovimientosConFiltros(String fecha, Long tiendaId, Long cajaId, Pageable pageable) {
        Specification<Movimiento> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (fecha != null && !fecha.isEmpty()) {
                predicates.add(cb.equal(root.get("fecha"), LocalDate.parse(fecha)));
            }
            if (tiendaId != null) {
                predicates.add(cb.equal(root.get("tienda").get("id"), tiendaId));
            }
            if (cajaId != null) {
                predicates.add(cb.equal(root.get("caja").get("id"), cajaId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return movimientoRepository.findAll(spec, pageable);
    }

    public List<Movimiento> listarMovimientos() {
        return movimientoRepository.findAll();
    }

    public Movimiento crear(Movimiento movimiento) {
        
        if (movimiento.getFecha() == null || 
            movimiento.getTienda() == null || 
            movimiento.getCaja() == null) {
            throw new IllegalArgumentException("Fecha, tienda y caja son obligatorios");
        }

        LocalDate fecha = movimiento.getFecha();
        Long tiendaId = movimiento.getTienda().getId();
        Long cajaId = movimiento.getCaja().getId();

        List<BigDecimal> resultados = movimientoRepository.encontrarcajaActualUltimoAntesDeFecha(tiendaId, cajaId,fecha);
        BigDecimal cajaAnterior = resultados.isEmpty() ? BigDecimal.ZERO : resultados.get(0);

        movimiento.setCajaanterior(cajaAnterior);        
        return movimientoRepository.save(movimiento);
    }

    public Movimiento actualizar(Movimiento movimiento) {
        return movimientoRepository.save(movimiento);
    }

    public Movimiento buscarPorId(Long id) {
        return movimientoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimiento no encontrado con ID: " + id));
    }

    public void eliminarMovimiento(Long id) {
    Movimiento movimiento = movimientoRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Movimiento no encontrado"));
    movimientoRepository.delete(movimiento);
    }

    public List<MovimientoConsolidadoDTO> obtenerConsolidado(LocalDate inicio, LocalDate fin, Long tiendaId, Long cajaId) {
        if (tiendaId == null && cajaId == null) {
           return movimientoRepository.consolidarTodos(inicio, fin);
        } else {
            if (tiendaId != null && cajaId == null) {
                return movimientoRepository.consolidarTienda(inicio, fin, tiendaId);
            } else
              return movimientoRepository.consolidarMovimientos(inicio, fin, tiendaId, cajaId);
        }
        
    }

    public List<Movimiento> filtrarMovimientos(String fecha, Long tiendaId, Long cajaId) {
        if (fecha != null && !fecha.isEmpty()) {
            LocalDate fechaFiltro = LocalDate.parse(fecha);
            if (tiendaId != null && cajaId != null) {
                return movimientoRepository.findByFechaAndTiendaIdAndCajaId(fechaFiltro, tiendaId, cajaId);
            } else if (tiendaId != null) {
                return movimientoRepository.findByFechaAndTiendaId(fechaFiltro, tiendaId);
            } else if (cajaId != null) {
                return movimientoRepository.findByFechaAndCajaId(fechaFiltro, cajaId);
            } else {
                return movimientoRepository.findByFecha(fechaFiltro);
            }
        } else {
            if (tiendaId != null && cajaId != null) {
                return movimientoRepository.findByTiendaIdAndCajaId(tiendaId, cajaId);
            } else if (tiendaId != null) {
                return movimientoRepository.findByTiendaId(tiendaId);
            } else if (cajaId != null) {
                return movimientoRepository.findByCajaId(cajaId);
            } else {
                return movimientoRepository.findAll();
            }
        }
    }

public BigDecimal obtenerCajaAnterior(Long tiendaId, Long cajaId, LocalDate fecha) {
        List<BigDecimal> resultados = movimientoRepository.encontrarcajaActualUltimoAntesDeFecha(tiendaId, cajaId,fecha);
        // System.out.println("resultados: " + resultados); // Moved or commented out to avoid unreachable code
        return resultados.isEmpty() ? BigDecimal.ZERO : resultados.get(0);
    }
    
public ResponseEntity<ByteArrayResource> exportarMovimientosExcel(List<Movimiento> movimientos) throws IOException {
    Workbook workbook = new XSSFWorkbook();
    Sheet sheet = workbook.createSheet("Movimientos");

    // Estilo para encabezado
    CellStyle headerStyle = workbook.createCellStyle();
    Font font = workbook.createFont();
    font.setBold(true);
    headerStyle.setFont(font);

    // Estilo para moneda
    CellStyle currencyStyle = workbook.createCellStyle();
    DataFormat format = workbook.createDataFormat();
    currencyStyle.setDataFormat(format.getFormat("$ #,##0.00")); // Formato moneda

    // Total resaltado: moneda + negrilla + naranja suave
    CellStyle totalStyle = workbook.createCellStyle();
    totalStyle.cloneStyleFrom(currencyStyle);
    Font totalFont = workbook.createFont();
    totalFont.setBold(true);
    totalStyle.setFont(totalFont);
    totalStyle.setFillForegroundColor(IndexedColors.LIGHT_ORANGE.getIndex());
    totalStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

    // Encabezados
    Row header = sheet.createRow(0);
    String[] columnas = { "ID", "Fecha", "Tienda", "Caja", "Efectivo", "Caja Actual", 
                        "Daviplata","Éxito","Codensa","Addi","Sistecrédito",      
                        "TC","Tef Ogloba","QR Sra Paty","Big Pass","Sodexo",            
                        "Bono BigPass","Cert. Dotación","Venta Web","Voucher Urban",     
                        "Voucher Style","Abono Sistet","Gastos","Total Parcial",     
                        "Total Abono Siste","Bonos Vendidos","Caja Anterior","Venta",
                        "Total","Diferencia","Observaciones"                   
        };
    for (int i = 0; i < columnas.length; i++) {
    //    header.createCell(i).setCellValue(columnas[i]);
        Cell cell = header.createCell(i);
        cell.setCellValue(columnas[i]);
        cell.setCellStyle(headerStyle); // Aplicar estilo de encabezado 
    }

    // Datos
    int fila = 1;
    for (Movimiento m : movimientos) {
        Row row = sheet.createRow(fila++);
        row.createCell(0).setCellValue(m.getId());
        row.createCell(1).setCellValue(m.getFecha().toString());
        row.createCell(2).setCellValue(m.getTienda().getDescripcion());
        row.createCell(3).setCellValue(m.getCaja().getDescripcion());
        
        //row.createCell(4).setCellValue(m.getEfectivo() != null ? m.getEfectivo().doubleValue() : 0.0);
        Cell cellEfectivo = row.createCell(4);                                                     
        cellEfectivo.setCellValue(m.getEfectivo() != null ? m.getEfectivo().doubleValue() : 0);
        cellEfectivo.setCellStyle(currencyStyle);                                                  
        Cell cellCajaActual = row.createCell(5);
        cellCajaActual.setCellValue(m.getcajaActual() != null ? m.getcajaActual().doubleValue() : 0);
        cellCajaActual.setCellStyle(currencyStyle);

        Cell cellDaviplata = row.createCell(6);
        cellDaviplata.setCellValue(m.getDaviplata() != null ? m.getDaviplata().doubleValue() : 0);
        cellDaviplata.setCellStyle(currencyStyle);

        Cell cellTexito = row.createCell(7);
        cellTexito.setCellValue(m.getTexito() != null ? m.getTexito().doubleValue() : 0);
        cellTexito.setCellStyle(currencyStyle); 

        Cell cellCodensa = row.createCell(8);
        cellCodensa.setCellValue(m.getCodensa() != null ? m.getCodensa().doubleValue() : 0);
        cellCodensa.setCellStyle(currencyStyle);

        Cell cellAddi = row.createCell(9);
        cellAddi.setCellValue(m.getAddi() != null ? m.getAddi().doubleValue() : 0);
        cellAddi.setCellStyle(currencyStyle);

        Cell cellSistecredito = row.createCell(10);
        cellSistecredito.setCellValue(m.getSistecredito() != null ? m.getSistecredito().doubleValue() : 0);
        cellSistecredito.setCellStyle(currencyStyle);

        Cell cellTc = row.createCell(11);
        cellTc.setCellValue(m.getTc() != null ? m.getTc().doubleValue() : 0);
        cellTc.setCellStyle(currencyStyle); 

        Cell cellTefOgloba = row.createCell(12);
        cellTefOgloba.setCellValue(m.getTefOgloba() != null ? m.getTefOgloba().doubleValue() : 0);
        cellTefOgloba.setCellStyle(currencyStyle);

        Cell cellQrCuentaSraPaty = row.createCell(13);
        cellQrCuentaSraPaty.setCellValue(m.getQrCuentaSraPaty() != null ? m.getQrCuentaSraPaty().doubleValue() : 0);
        cellQrCuentaSraPaty.setCellStyle(currencyStyle);
        
        Cell cellTarjetaBigPass = row.createCell(14);
        cellTarjetaBigPass.setCellValue(m.getTarjetaBigPass() != null ? m.getTarjetaBigPass().doubleValue() : 0);
        cellTarjetaBigPass.setCellStyle(currencyStyle);

        Cell cellTarjetaSodexo = row.createCell(15);
        cellTarjetaSodexo.setCellValue(m.getTarjetaSodexo() != null ? m.getTarjetaSodexo().doubleValue() : 0);
        cellTarjetaSodexo.setCellStyle(currencyStyle);

        Cell cellBonoBigPass = row.createCell(16);
        cellBonoBigPass.setCellValue(m.getBonoBigPass() != null ? m.getBonoBigPass().doubleValue() : 0);
        cellBonoBigPass.setCellStyle(currencyStyle);

        Cell cellCertificadoDotacion = row.createCell(17);
        cellCertificadoDotacion.setCellValue(m.getCertificadoDotacion() != null ? m.getCertificadoDotacion().doubleValue() : 0);
        cellCertificadoDotacion.setCellStyle(currencyStyle);

        Cell cellVentaPaginaWeb = row.createCell(18);
        cellVentaPaginaWeb.setCellValue(m.getVentaPaginaWeb() != null ? m.getVentaPaginaWeb().doubleValue() : 0);
        cellVentaPaginaWeb.setCellStyle(currencyStyle);

        Cell cellVoucherUrban = row.createCell(19);
        cellVoucherUrban.setCellValue(m.getVoucherUrban() != null ? m.getVoucherUrban().doubleValue() : 0);
        cellVoucherUrban.setCellStyle(currencyStyle);

        Cell cellVoucherStyle = row.createCell(20);
        cellVoucherStyle.setCellValue(m.getVoucherStyle() != null ? m.getVoucherStyle().doubleValue() : 0);
        cellVoucherStyle.setCellStyle(currencyStyle);

        Cell cellAbonoSistet = row.createCell(21);
        cellAbonoSistet.setCellValue(m.getAbonoSistet() != null ? m.getAbonoSistet().doubleValue() : 0);
        cellAbonoSistet.setCellStyle(currencyStyle);

        Cell cellGastos = row.createCell(22);
        cellGastos.setCellValue(m.getGastos() != null ? m.getGastos().doubleValue() : 0);
        cellGastos.setCellStyle(currencyStyle);

        Cell cellTotalParcial = row.createCell(23);
        cellTotalParcial.setCellValue(m.getTotalparcial() != null ? m.getTotalparcial().doubleValue() : 0);
        //cellTotalParcial.setCellStyle(currencyStyle);
        cellTotalParcial.setCellStyle(totalStyle); // Aplicar estilo de total resaltado

        Cell cellTotalAbonoSiste = row.createCell(24);
        cellTotalAbonoSiste.setCellValue(m.getTotalabosiste() != null ? m.getTotalabosiste().doubleValue() : 0);
        cellTotalAbonoSiste.setCellStyle(currencyStyle);

        Cell cellBonosVendidos = row.createCell(25);
        cellBonosVendidos.setCellValue(m.getBonosvendidos() != null ? m.getBonosvendidos().doubleValue() : 0);
        cellBonosVendidos.setCellStyle(currencyStyle);

        Cell cellCajaAnterior = row.createCell(26);
        cellCajaAnterior.setCellValue(m.getCajaanterior() != null ? m.getCajaanterior().doubleValue() : 0);
        cellCajaAnterior.setCellStyle(currencyStyle);

        Cell cellVenta = row.createCell(27);
        cellVenta.setCellValue(m.getVenta() != null ? m.getVenta().doubleValue() : 0);
        cellVenta.setCellStyle(currencyStyle);  

        Cell cellTotal = row.createCell(28);
        cellTotal.setCellValue(m.getTotal() != null ? m.getTotal().doubleValue() : 0);
        //cellTotal.setCellStyle(currencyStyle);
        cellTotal.setCellStyle(totalStyle); // Aplicar estilo de total resaltado

        Cell cellDiferencia = row.createCell(29);
        cellDiferencia.setCellValue(m.getDiferencia() != null ? m.getDiferencia().doubleValue() : 0);
        //cellDiferencia.setCellStyle(currencyStyle); 
        cellDiferencia.setCellStyle(totalStyle); // Aplicar estilo de total resaltado

        Cell cellObservaciones = row.createCell(30);
        cellObservaciones.setCellValue(m.getObservaciones() != null ? m.getObservaciones() : "");
        
    }
    // Autosize
    for (int i = 0; i < columnas.length; i++) sheet.autoSizeColumn(i);
    
    // Convertir a recurso
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    workbook.write(out);
    workbook.close();
    ByteArrayResource resource = new ByteArrayResource(out.toByteArray());

    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=movimientos.xlsx")
        .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
        .body(resource);
}

public ResponseEntity<ByteArrayResource> exportarConsolidadosExcel(List<MovimientoConsolidadoDTO> datos ) throws IOException {
    
    Workbook workbook = new XSSFWorkbook();
    Sheet sheet = workbook.createSheet("Consolidado");

    // Estilo para encabezado                                                  
    CellStyle headerStyle = workbook.createCellStyle();                           
    Font font = workbook.createFont();                                            
    font.setBold(true);                                                           
    headerStyle.setFont(font);                                                    
                                                                                  
    // Estilo para moneda                                                      
    CellStyle currencyStyle = workbook.createCellStyle();                         
    DataFormat format = workbook.createDataFormat();                              
    currencyStyle.setDataFormat(format.getFormat("$ #,##0.00")); // Formato moneda

    // Total resaltado: moneda + negrilla + naranja suave
    CellStyle totalStyle = workbook.createCellStyle();
    totalStyle.cloneStyleFrom(currencyStyle);
    Font totalFont = workbook.createFont();
    totalFont.setBold(true);
    totalStyle.setFont(totalFont);
    totalStyle.setFillForegroundColor(IndexedColors.LIGHT_ORANGE.getIndex());
    totalStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);    

    // Encabezados
    Row header = sheet.createRow(0);
    String[] columnas = {"Fecini","Fecfin","Tienda", "Caja", "Efectivo", "Caja Actual", 
                        "Daviplata","Éxito","Codensa","Addi","Sistecrédito",      
                        "TC","Tef Ogloba","QR Sra Paty","Big Pass","Sodexo",            
                        "Bono BigPass","Cert. Dotación","Venta Web","Voucher Urban",     
                        "Voucher Style","Abono Sistet","Gastos","Total Parcial",     
                        "Total Abono Siste","Bonos Vendidos","Caja Anterior","Venta",
                        "Total","Diferencia"                   
        };
    for (int i = 0; i < columnas.length; i++) {
        //header.createCell(i).setCellValue(columnas[i]);
        Cell cell = header.createCell(i);
        cell.setCellValue(columnas[i]);
        cell.setCellStyle(headerStyle); // Aplicar estilo de encabezado        
    }

    // Datos
    int fila = 1;
    for (MovimientoConsolidadoDTO dto : datos) {
        Row row = sheet.createRow(fila++);
        row.createCell(0).setCellValue(dto.getFechaInicio() != null ? dto.getFechaInicio().toString() : "");
        row.createCell(1).setCellValue(dto.getFechaFin() != null ? dto.getFechaFin().toString() : "");

        row.createCell(2).setCellValue(dto.getTienda());
        row.createCell(3).setCellValue(dto.getCaja());
        
        Cell cellEfectivo = row.createCell(4);                                                     
        cellEfectivo.setCellValue(dto.getEfectivo() != null ? dto.getEfectivo().doubleValue() : 0);
        cellEfectivo.setCellStyle(currencyStyle);                                                  

        Cell cellCajaActual = row.createCell(5);
        cellCajaActual.setCellValue(dto.getcajaActual() != null ? dto.getcajaActual().doubleValue() : 0);
        cellCajaActual.setCellStyle(currencyStyle);

        Cell cellDaviplata = row.createCell(6);
        cellDaviplata.setCellValue(dto.getDaviplata() != null ? dto.getDaviplata().doubleValue() : 0);
        cellDaviplata.setCellStyle(currencyStyle);

        Cell cellTexito = row.createCell(7);
        cellTexito.setCellValue(dto.getTexito() != null ? dto.getTexito().doubleValue() : 0);
        cellTexito.setCellStyle(currencyStyle); 

        Cell cellCodensa = row.createCell(8);
        cellCodensa.setCellValue(dto.getCodensa() != null ? dto.getCodensa().doubleValue() : 0);
        cellCodensa.setCellStyle(currencyStyle);

        Cell cellAddi = row.createCell(9);
        cellAddi.setCellValue(dto.getAddi() != null ? dto.getAddi().doubleValue() : 0);
        cellAddi.setCellStyle(currencyStyle);

        Cell cellSistecredito = row.createCell(10);
        cellSistecredito.setCellValue(dto.getSistecredito() != null ? dto.getSistecredito().doubleValue() : 0);
        cellSistecredito.setCellStyle(currencyStyle);

        Cell cellTc = row.createCell(11);
        cellTc.setCellValue(dto.getTc() != null ? dto.getTc().doubleValue() : 0);
        cellTc.setCellStyle(currencyStyle); 

        Cell cellTefOgloba = row.createCell(12);
        cellTefOgloba.setCellValue(dto.getTefOgloba() != null ? dto.getTefOgloba().doubleValue() : 0);
        cellTefOgloba.setCellStyle(currencyStyle);

        Cell cellQrCuentaSraPaty = row.createCell(13);
        cellQrCuentaSraPaty.setCellValue(dto.getQrCuentaSraPaty() != null ? dto.getQrCuentaSraPaty().doubleValue() : 0);
        cellQrCuentaSraPaty.setCellStyle(currencyStyle);
        
        Cell cellTarjetaBigPass = row.createCell(14);
        cellTarjetaBigPass.setCellValue(dto.getTarjetaBigPass() != null ? dto.getTarjetaBigPass().doubleValue() : 0);
        cellTarjetaBigPass.setCellStyle(currencyStyle);

        Cell cellTarjetaSodexo = row.createCell(15);
        cellTarjetaSodexo.setCellValue(dto.getTarjetaSodexo() != null ? dto.getTarjetaSodexo().doubleValue() : 0);
        cellTarjetaSodexo.setCellStyle(currencyStyle);

        Cell cellBonoBigPass = row.createCell(16);
        cellBonoBigPass.setCellValue(dto.getBonoBigPass() != null ? dto.getBonoBigPass().doubleValue() : 0);
        cellBonoBigPass.setCellStyle(currencyStyle);

        Cell cellCertificadoDotacion = row.createCell(17);
        cellCertificadoDotacion.setCellValue(dto.getCertificadoDotacion() != null ? dto.getCertificadoDotacion().doubleValue() : 0);
        cellCertificadoDotacion.setCellStyle(currencyStyle);

        Cell cellVentaPaginaWeb = row.createCell(18);
        cellVentaPaginaWeb.setCellValue(dto.getVentaPaginaWeb() != null ? dto.getVentaPaginaWeb().doubleValue() : 0);
        cellVentaPaginaWeb.setCellStyle(currencyStyle);

        Cell cellVoucherUrban = row.createCell(19);
        cellVoucherUrban.setCellValue(dto.getVoucherUrban() != null ? dto.getVoucherUrban().doubleValue() : 0);
        cellVoucherUrban.setCellStyle(currencyStyle);

        Cell cellVoucherStyle = row.createCell(20);
        cellVoucherStyle.setCellValue(dto.getVoucherStyle() != null ? dto.getVoucherStyle().doubleValue() : 0);
        cellVoucherStyle.setCellStyle(currencyStyle);

        Cell cellAbonoSistet = row.createCell(21);
        cellAbonoSistet.setCellValue(dto.getAbonoSistet() != null ? dto.getAbonoSistet().doubleValue() : 0);
        cellAbonoSistet.setCellStyle(currencyStyle);

        Cell cellGastos = row.createCell(22);
        cellGastos.setCellValue(dto.getGastos() != null ? dto.getGastos().doubleValue() : 0);
        cellGastos.setCellStyle(currencyStyle);

        Cell cellTotalParcial = row.createCell(23);
        cellTotalParcial.setCellValue(dto.getTotalparcial() != null ? dto.getTotalparcial().doubleValue() : 0);
        //cellTotalParcial.setCellStyle(currencyStyle);
        cellTotalParcial.setCellStyle(totalStyle); // Aplicar estilo de total resaltado

        Cell cellTotalAbonoSiste = row.createCell(24);
        cellTotalAbonoSiste.setCellValue(dto.getTotalabosiste() != null ? dto.getTotalabosiste().doubleValue() : 0);
        cellTotalAbonoSiste.setCellStyle(currencyStyle);

        Cell cellBonosVendidos = row.createCell(25);
        cellBonosVendidos.setCellValue(dto.getBonosvendidos() != null ? dto.getBonosvendidos().doubleValue() : 0);
        cellBonosVendidos.setCellStyle(currencyStyle);

        Cell cellCajaAnterior = row.createCell(26);
        cellCajaAnterior.setCellValue(dto.getCajaanterior() != null ? dto.getCajaanterior().doubleValue() : 0);
        cellCajaAnterior.setCellStyle(currencyStyle);

        Cell cellVenta = row.createCell(27);
        cellVenta.setCellValue(dto.getVenta() != null ? dto.getVenta().doubleValue() : 0);
        cellVenta.setCellStyle(currencyStyle);  

        Cell cellTotal = row.createCell(28);
        cellTotal.setCellValue(dto.getTotal() != null ? dto.getTotal().doubleValue() : 0);
        //cellTotal.setCellStyle(currencyStyle);
        cellTotal.setCellStyle(totalStyle); // Aplicar estilo de total resaltado

        Cell cellDiferencia = row.createCell(29);
        cellDiferencia.setCellValue(dto.getDiferencia() != null ? dto.getDiferencia().doubleValue() : 0);
        //cellDiferencia.setCellStyle(currencyStyle); 
        cellDiferencia.setCellStyle(totalStyle); // Aplicar estilo de total resaltado
    }
    // Autosize
    for (int i = 0; i < columnas.length; i++) sheet.autoSizeColumn(i);    

    // Convertir a recurso
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    workbook.write(out);
    workbook.close();
    ByteArrayResource resource = new ByteArrayResource(out.toByteArray());

    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=consolidado.xlsx")
        .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
        .body(resource);
}


}
