package com.sgcc.sgccapi.util;

import com.sgcc.sgccapi.constant.TiposReciboSGCC;
import lombok.NoArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@NoArgsConstructor
@Component
public class PDFManager {

    public Map<String, Object> readFromMultipartFile(TiposReciboSGCC tipoRecibo, MultipartFile multipartFile)
            throws Exception {
        PDDocument document = PDDocument.load(multipartFile.getInputStream());
        Map<String, Object> map = extractDataByTipoRecibo(document, tipoRecibo);
        multipartFile.getInputStream().close();
        document.close();

        return map;
    }

    public Map<String, Object> readFromFile(TiposReciboSGCC tipoRecibo, String filePath) throws Exception {
        File file = new File(filePath);
        FileInputStream fileInputStream = new FileInputStream(file);
        PDDocument document = PDDocument.load(fileInputStream);
        Map<String, Object> map = extractDataByTipoRecibo(document, tipoRecibo);
        document.close();
        fileInputStream.close();

        return map;
    }

    public Map<String, Object> readFromURL(TiposReciboSGCC tipoRecibo, String urlString) throws Exception {
        URL url = new URL(urlString);
        PDDocument document = PDDocument.load(url.openStream());
        Map<String, Object> map = extractDataByTipoRecibo(document, tipoRecibo);
        document.close();

        return map;
    }

    private Map<String, Object> extractDataByTipoRecibo(PDDocument document, TiposReciboSGCC tipoRecibo)
            throws Exception {
        PDFTextStripper pdfTextStripper = new PDFTextStripper();
        Map<String, Object> map = new HashMap<>();
        switch (tipoRecibo) {
            case LUZ:
                pdfTextStripper.setStartPage(1);
                pdfTextStripper.setEndPage(1);
                map = getDataFromReciboLuz(pdfTextStripper.getText(document));
                break;
            case AGUA:
                pdfTextStripper.setStartPage(1);
                pdfTextStripper.setEndPage(1);
                map = getDataFromReciboAgua(pdfTextStripper.getText(document));
            case GAS:
            default:
                break;
        }

        return map;
    }

    private Map<String, Object> getDataFromReciboLuz(String rawPDFText) throws Exception {
        Map<String, Object> map = new HashMap<>();

        if (rawPDFText.contains("\r")) {
            String mesRecibo = rawPDFText
                    .substring(0, rawPDFText.indexOf("\r"))
                    .replace("\r", "");
            map.put("mes (número)", stringMonthDateToIntMonthDate(mesRecibo));
            map.put("mes (detalle)", mesRecibo.trim());
        }

        if (rawPDFText.contains("Número de cliente")) {
            String tempDireccionRecibo = rawPDFText
                    .substring(0, rawPDFText.indexOf("Número de cliente"));
            String direccionRecibo = tempDireccionRecibo.split("\r")[5]
                    + tempDireccionRecibo.split("\r")[6];
            map.put("dirección", direccionRecibo.trim());
        }

        if ((rawPDFText.contains("*") || rawPDFText.contains("_")) && rawPDFText.contains("FISE")) {
            String importe = rawPDFText
                    .substring(rawPDFText.indexOf("*"), rawPDFText.lastIndexOf("_"))
                    .replace("*", "")
                    .replace("_", "");
            map.put("importe", Double.parseDouble(importe.trim()));
            String tempConsumoTotal = rawPDFText
                    .substring(0, rawPDFText.indexOf("FISE"))
                    .replace("  ", " ")
                    .replace("  ", " ");
            String[] tempConsumoTotal2 = tempConsumoTotal.split("\r");
            String[] tempConsumoTotal3 = tempConsumoTotal.split("\r")[tempConsumoTotal2.length - 2]
                    .split(" ");
            String consumoTotalRecibo = tempConsumoTotal3[tempConsumoTotal3.length - 1];
            map.put("consumoTotal", Integer.parseInt(consumoTotalRecibo.trim()));
            double consumoUnitario = Double.parseDouble(map.get("importe").toString()) /
                    Integer.parseInt(map.get("consumoTotal").toString());
            BigDecimal consumoUnitarioBigDec = new BigDecimal(consumoUnitario)
                    .setScale(3, RoundingMode.HALF_UP);
            map.put("consumoUnitario", consumoUnitarioBigDec);
        }

        if (map.size() == 6) {
            map.put("message", "Información del recibo obtenida correctamente.");
        } else {
            map.put("error", "Uno o más valores no se han podido obtener.");
        }

        return map;
    }

    private Map<String, Object> getDataFromReciboAgua(String rawPDFText) throws Exception {
        Map<String, Object> map = new HashMap<>();

        if (rawPDFText.contains("Mes facturado:")) {
            String mesRecibo = rawPDFText
                    .substring(rawPDFText.indexOf("Mes facturado:"), rawPDFText.indexOf("Medidor:"))
                    .split("\r")[1]
                    .split(" ")[0]
                    .trim()
                    .toUpperCase();
            map.put("mes (número)", stringMonthDateToIntMonthDate(mesRecibo));
            map.put("mes (detalle)", mesRecibo);
        }

        if (rawPDFText.contains("Dirección del suministro:")) {
            String direccionRecibo = rawPDFText
                    .substring(rawPDFText.indexOf("Dirección del suministro:"),
                            rawPDFText.indexOf("INFORMACIÓN GENERAL INFORMACIÓN DE PAGO"))
                    .split("\r")[1]
                    .trim()
                    .toUpperCase();
            map.put("dirección", direccionRecibo);
        }

        if (rawPDFText.contains("*") && rawPDFText.contains("Importe total a")) {
            String tempImporte = rawPDFText
                    .substring(rawPDFText.indexOf("*"))
                    .replace("*", "");
            String importe = tempImporte
                    .substring(0, tempImporte.indexOf("\r"))
                    .replaceAll("Importe total a", "")
                    .trim();
            map.put("importe", Double.parseDouble(importe));
            String consumoTotal = rawPDFText
                    .substring(rawPDFText.indexOf("Tipo de descarga"),
                            rawPDFText.indexOf("Fecha de vencimiento"))
                    .split("\r\n")[2]
                    .trim();
            map.put("consumoTotal", Integer.parseInt(consumoTotal));
            double consumoUnitario = Double.parseDouble(map.get("importe").toString()) /
                    Integer.parseInt(map.get("consumoTotal").toString());
            BigDecimal consumoUnitarioBigDec = new BigDecimal(consumoUnitario)
                    .setScale(3, RoundingMode.HALF_UP);
            map.put("consumoUnitario", consumoUnitarioBigDec);
        }

        return map;
    }

    private int stringMonthDateToIntMonthDate(String month) throws ParseException {
        Date date = new SimpleDateFormat("MMMM", Locale.getDefault()).parse(month);
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);

        return calendar.get(Calendar.MONTH) + 1;
    }

}
