// src/main/java/com/tienda/service/CruceAddiService.java
package com.tienda.service;

import com.tienda.dto.CruceAddiRow;
import com.tienda.repository.MovimientoRepository;
import com.tienda.repository.projection.SumaAddiPorEmail;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PushbackInputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.time.LocalDate;
import java.util.*;

import java.time.format.DateTimeFormatter;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.opencsv.CSVParser;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;

@Service
public class CruceAddiService {

    private final MovimientoRepository movimientoRepository;

    public CruceAddiService(MovimientoRepository movimientoRepository) {
        this.movimientoRepository = movimientoRepository;
    }

    public List<CruceAddiRow> ejecutarDesdeArchivo(MultipartFile file, LocalDate fechaInicio, LocalDate fechaFin, Character separator) throws Exception {
        System.out.println("Ejecutando CruceAddiService con archivo: " + file.getOriginalFilename());
        System.out.println("Fechas: " + fechaInicio + " a " + fechaFin);
        System.out.println("Separador: " + separator);
               
        
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Archivo CSV vacío o no recibido");
        }
        char sep = (separator == null) ? ',' : separator;
        System.out.println("Separador usado: '" + sep + "'");
        // 1) Lee y agrupa archivo por Email vendedor (Estado=exitosa, Fecha Creación en rango)
        Map<String, BigDecimal> sumaArchivo = leerYSumarPorEmail(file, fechaInicio, fechaFin, sep);

        if (sumaArchivo.isEmpty()) return Collections.emptyList();

        // 2) Consulta BD: addi por email en rango (usa tienda.infoAddi como email)
        List<String> emails = new ArrayList<>(sumaArchivo.keySet());
        List<SumaAddiPorEmail> bdRows = movimientoRepository.sumarAddiPorEmailEnRango(fechaInicio, fechaFin, emails);

        Map<String, BigDecimal> sumaBD = new HashMap<>();
        for (SumaAddiPorEmail r : bdRows) {
            String email = Optional.ofNullable(r.getEmail()).orElse("").trim().toLowerCase(Locale.ROOT);
            BigDecimal total = r.getTotalAddi() == null ? BigDecimal.ZERO : BigDecimal.valueOf(r.getTotalAddi());
            sumaBD.put(email, total);
        }

        // 3) Arma salida
        List<CruceAddiRow> salida = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> e : sumaArchivo.entrySet()) {
            String email = e.getKey();
            BigDecimal montoArchivo = e.getValue();
            BigDecimal montoMov = sumaBD.getOrDefault(email, BigDecimal.ZERO);
            salida.add(new CruceAddiRow(fechaInicio,fechaFin,email, montoArchivo, montoMov));
        }

        // Ordena por diferencia desc (opcional)
        salida.sort(Comparator.comparing(CruceAddiRow::getDiferencia).reversed());
         System.out.println("Total registros procesados: " + salida.size());
        return salida;
    }

private Map<String, BigDecimal> leerYSumarPorEmail(MultipartFile file, LocalDate inicio, LocalDate fin, char separatorOverride) throws Exception {
    try (BufferedReader br = new BufferedReader(new InputStreamReader(removeBOM(file.getInputStream()), StandardCharsets.UTF_8))) {

        // Construye un CSVReader que respeta comillas y autodetecta separador
        CSVReader reader = buildCsvReader(br, separatorOverride);

        String[] headers = reader.readNext();
        if (headers == null) return Collections.emptyMap();

        // Limpia y normaliza encabezados (quita comillas externas y NBSP)
        headers = Arrays.stream(headers).map(this::cleanCell).toArray(String[]::new);

        Map<String, Integer> idx = mapHeaders(headers);

        Integer iFecha = findHeaderIndex(idx, "Fecha Creación");
        Integer iEstado = findHeaderIndex(idx, "Estado");
        Integer iEmail  = findHeaderIndex(idx, "Email vendedor");
        Integer iMonto  = findHeaderIndex(idx, "Monto");

        if (iFecha == null || iEstado == null || iEmail == null || iMonto == null) {
            throw new IllegalArgumentException("Cabeceras requeridas no encontradas: [Fecha Creación, Estado, Email vendedor, Monto]");
        }

        Map<String, BigDecimal> sumas = new HashMap<>();
        String[] row;
        while ((row = reader.readNext()) != null) {
            // Limpia celdas (quita comillas externas, NBSP, recorta)
            row = Arrays.stream(row).map(this::cleanCell).toArray(String[]::new);
            if (row.length < headers.length) continue;

            String estado = safe(row[iEstado]).trim().toLowerCase(Locale.ROOT);
            if (!"exitosa".equals(estado)) continue;

            LocalDate fechaCreacion = parseFecha(safe(row[iFecha]));
            if (fechaCreacion == null || fechaCreacion.isBefore(inicio) || fechaCreacion.isAfter(fin)) continue;

            String email = safe(row[iEmail]).trim().toLowerCase(Locale.ROOT);
            if (email.isEmpty()) continue;

            BigDecimal monto = parseMonto(safe(row[iMonto]));
            if (monto == null) continue;

            sumas.merge(email, monto, BigDecimal::add);
        }
        return sumas;
    }
}

/** Construye un CSVReader que respeta comillas y autodetecta separador si no se pasa */
private CSVReader buildCsvReader(BufferedReader br, char separatorOverride) throws IOException {
    br.mark(1_000_000);
    String headerRaw = br.readLine();
    if (headerRaw == null) throw new IOException("CSV vacío");
    char sep = (separatorOverride == 0) ? detectarSeparadorRobusto(headerRaw) : separatorOverride;
    br.reset();

    CSVParser parser = new CSVParserBuilder()
            .withSeparator(sep)
            .withQuoteChar('"')            // respeta "dobles comillas"
            .withEscapeChar('\\')           // Excel «escapa» comillas doblándolas -> "" dentro del campo
            .withIgnoreQuotations(false)   // MUY importante: no ignorar comillas
            .withIgnoreLeadingWhiteSpace(true)
            .build();

    return new CSVReaderBuilder(br)
            .withCSVParser(parser)
            .build();
}

/** Autodetección simple del separador preferido evaluando número de columnas al hacer split respetuoso de comillas */
private char detectarSeparadorRobusto(String headerRaw) {
    char[] candidatos = new char[]{',',';','\t'};
    int bestCols = -1;
    char best = ',';
    for (char c : candidatos) {
        int cols = contarColumnasRespetandoComillas(headerRaw, c);
        if (cols > bestCols) { bestCols = cols; best = c; }
    }
    return best;
}

/** Cuenta columnas sin romper comillas (simple state machine) */
private int contarColumnasRespetandoComillas(String s, char sep) {
    boolean inQuotes = false;
    int cols = 1;
    for (int i = 0; i < s.length(); i++) {
        char ch = s.charAt(i);
        if (ch == '"') {
            // manejar comillas dobles escapadas ("")
            if (inQuotes && i+1 < s.length() && s.charAt(i+1) == '"') {
                i++; // salta comilla escapada
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch == sep && !inQuotes) {
            cols++;
        }
    }
    return cols;
}

/** Elimina BOM si existe */
private InputStream removeBOM(InputStream is) throws IOException {
    PushbackInputStream pis = new PushbackInputStream(is, 3);
    byte[] bom = new byte[3];
    int n = pis.read(bom, 0, 3);
    if (n == 3) {
        if (!(bom[0] == (byte)0xEF && bom[1] == (byte)0xBB && bom[2] == (byte)0xBF)) {
            pis.unread(bom, 0, 3);
        }
    } else if (n > 0) {
        pis.unread(bom, 0, n);
    }
    return pis;
}

/** Limpia celda: quita NBSP, recorta, quita comillas envolventes */
private String cleanCell(String s) {
    if (s == null) return "";
    String t = s.replace('\u00A0', ' ').trim(); // NBSP -> espacio normal
    if (t.length() >= 2 && t.startsWith("\"") && t.endsWith("\"")) {
        t = t.substring(1, t.length()-1);
    }
    return t.trim();
}

/** Igual que antes, pero normaliza para hallar índices aunque el header venga entre comillas o con tildes */
private Map<String, Integer> mapHeaders(String[] headers) {
    Map<String, Integer> map = new HashMap<>();
    for (int i = 0; i < headers.length; i++) {
        map.put(cleanCell(headers[i]).trim(), i);
    }
    return map;
}

private Integer findHeaderIndex(Map<String, Integer> idx, String header) {
    if (idx.containsKey(header)) return idx.get(header);
    String needle = normalize(header);
    for (Map.Entry<String,Integer> e : idx.entrySet()) {
        if (normalize(e.getKey()).equals(needle)) return e.getValue();
    }
    return null;
}

private String normalize(String s) {
    if (s == null) return "";
    s = s.replace('\u00A0', ' ').trim().toLowerCase(Locale.ROOT);
    s = Normalizer.normalize(s, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
    return s;
}

private String safe(String s) { return s == null ? "" : s; }

private LocalDate parseFecha(String s) {
    s = s.trim();
    try {
        // yyyy-MM-dd
        if (s.matches("\\d{4}-\\d{2}-\\d{2}")) {
            return LocalDate.parse(s);
        }
        // dd/MM/yyyy
        if (s.matches("\\d{2}/\\d{2}/\\d{4}")) {
            String[] p = s.split("/");
            return LocalDate.of(
                Integer.parseInt(p[2]),
                Integer.parseInt(p[1]),
                Integer.parseInt(p[0])
            );
        }
        // Caso 3: formato con coma (ej: "14 jun 2025, 04:07 p. m. GMT-5")
        if (s.contains(",")) {
            String antesDeComa = s.split(",")[0].trim();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d MMM uuuu", new Locale("es", "ES"));
            return LocalDate.parse(antesDeComa, formatter);
        }
        // Caso 4: dd-MM-yyyy HH:mm:ss
        if (s.matches("\\d{2}-\\d{2}-\\d{4} \\d{2}:\\d{2}:\\d{2}")) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-uuuu HH:mm:ss");
            return LocalDate.parse(s, formatter);
        }

    } catch (Exception ignored) {}
    return null;
}


    private BigDecimal parseMonto(String s) {
        if (s.isBlank()) return null;
        try {
            String clean = s.replace("$","").replace(" ","");
            // Formatos con miles/decimales: "1.234.567,89" => "1234567.89"
            if (clean.contains(",")) clean = clean.replace(".", "").replace(",", ".");
            else clean = clean.replace(",", "");
            return new BigDecimal(clean);
        } catch (Exception e) {
            return null;
        }
    }

public void exportToExcel(List<CruceAddiRow> resultados,
                          OutputStream os,
                          LocalDate fechaInicio,
                          LocalDate fechaFin) {
    try (Workbook workbook = new XSSFWorkbook()) {
        Sheet sheet = workbook.createSheet("Cruce Addi");

        // === Estilo encabezado ===
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);

        // === Estilo moneda (positivo normal, negativo rojo) ===
        CellStyle currencyStyle = workbook.createCellStyle();
        DataFormat df = workbook.createDataFormat();
        // Patrón: números positivos con $, negativos en rojo con $
        currencyStyle.setDataFormat(df.getFormat("$ #,##0.00; [Red]-$ #,##0.00"));

        // === Encabezados ===
        String[] columnas = {
            "Fecha Inicio",
            "Fecha Fin",
            "Email Vendedor",
            "Monto Archivo",
            "Monto Movimientos",
            "Diferencia"
        };

        Row header = sheet.createRow(0);
        for (int i = 0; i < columnas.length; i++) {
            Cell cell = header.createCell(i);
            cell.setCellValue(columnas[i]);
            cell.setCellStyle(headerStyle); // aplica negrilla
        }

        // === Contenido ===
        int rowIdx = 1;
        for (CruceAddiRow r : resultados) {
            Row row = sheet.createRow(rowIdx++);

            row.createCell(0).setCellValue(fechaInicio.toString());
            row.createCell(1).setCellValue(fechaFin.toString());
            row.createCell(2).setCellValue(r.getEmailVendedor());

            Cell cMontoArchivo = row.createCell(3);
            cMontoArchivo.setCellValue(r.getMontoArchivo() != null ? r.getMontoArchivo().doubleValue() : 0);
            cMontoArchivo.setCellStyle(currencyStyle);

            Cell cMontoMov = row.createCell(4);
            cMontoMov.setCellValue(r.getMontoMovimientos() != null ? r.getMontoMovimientos().doubleValue() : 0);
            cMontoMov.setCellStyle(currencyStyle);

            Cell cDif = row.createCell(5);
            cDif.setCellValue(r.getDiferencia() != null ? r.getDiferencia().doubleValue() : 0);
            cDif.setCellStyle(currencyStyle);
        }

        // Ajustar ancho de columnas automáticamente
        for (int i = 0; i < columnas.length; i++) {
            sheet.autoSizeColumn(i);
        }

        workbook.write(os);
        os.flush();
    } catch (IOException e) {
        throw new RuntimeException("Error exportando Excel Cruce Addi", e);
    }
}


    
}
