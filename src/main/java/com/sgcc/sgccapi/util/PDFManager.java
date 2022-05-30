package com.sgcc.sgccapi.util;

import com.sgcc.sgccapi.constant.TiposReciboSGCC;
import lombok.NoArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@NoArgsConstructor
@Component
public class PDFManager {

    public void readPDF(TiposReciboSGCC tipoRecibo) throws Exception {
        File file = new File("C:\\Users\\Edi\\OneDrive\\Documentos\\Historial Lecturas Local Tío Juan\\2022\\Mayo 2022\\Recibo-Luz-Mayo.pdf");
        FileInputStream fileInputStream = new FileInputStream(file);
        PDDocument document = PDDocument.load(fileInputStream);
        readPDFFromTipoRecibo(document, tipoRecibo);
        document.close();
        fileInputStream.close();
    }

    private void readPDFFromTipoRecibo(PDDocument document, TiposReciboSGCC tipoRecibo) throws IOException,
            ParseException {
        PDFTextStripper pdfTextStripper = new PDFTextStripper();
        switch (tipoRecibo) {
            case LUZ:
            case AGUA:
            case GAS:
                pdfTextStripper.setStartPage(1);
                pdfTextStripper.setEndPage(1);
                String pdfText = pdfTextStripper.getText(document);
                System.out.println(pdfText);
                Map<String, String> map = getDataFromReciboLuz(pdfText);
                System.out.println("-----------");
                System.out.println(map);
                break;
            default:
                break;
        }
    }

    private Map<String, String> getDataFromReciboLuz(String rawPDFText) throws ParseException {
        Map<String, String> map = new HashMap<>();
        if (rawPDFText.contains("*") || rawPDFText.contains("_")) {
            String importe = rawPDFText
                    .substring(rawPDFText.indexOf("*"), rawPDFText.lastIndexOf("_"))
                    .replace("*", "")
                    .replace("_", "");
            map.put("importe", importe.trim());
        }

        if (rawPDFText.contains("\r")) {
            String mesRecibo = rawPDFText
                    .substring(0, rawPDFText.indexOf("\r"))
                    .replace("\r", "");
            map.put("mes (número)", String.valueOf(stringMonthDateToIntMonthDate(mesRecibo)));
            map.put("mes (detalle)", mesRecibo.trim());
        }

        if (rawPDFText.contains("Número de cliente")) {
            String tempDireccionRecibo = rawPDFText
                    .substring(0, rawPDFText.indexOf("Número de cliente"));
            String direccionRecibo = tempDireccionRecibo.split("\r")[5]
                    + tempDireccionRecibo.split("\r")[6];
            map.put("dirección", direccionRecibo.trim());
        }

        if (rawPDFText.contains("FISE")) {
            String tempConsumoTotalRecibo = rawPDFText
                    .substring(0, rawPDFText.indexOf("FISE"))
                    .replace("  ", " ")
                    .replace("  ", " ");
            String[] tempConsumoTotalRecibo2 = tempConsumoTotalRecibo.split("\r");
            String[] tempConsumoTotalRecibo3 = tempConsumoTotalRecibo.split("\r")[tempConsumoTotalRecibo2.length - 2]
                    .split(" ");
            String consumoTotalRecibo = tempConsumoTotalRecibo3[tempConsumoTotalRecibo3.length - 1];
            map.put("consumoTotal", consumoTotalRecibo.trim());
            double consumoUnitario = Double.parseDouble(map.get("importe")) / Double.parseDouble(map.get("consumoTotal"));
            BigDecimal consumoUnitarioBigDec = new BigDecimal(consumoUnitario).setScale(2, RoundingMode.HALF_UP);
            map.put("consumoUnitario", String.valueOf(consumoUnitarioBigDec));
        }

        return map;
    }

    private int stringMonthDateToIntMonthDate(String month) throws ParseException {
        Date date = new SimpleDateFormat("MMMM", Locale.getDefault()).parse(month);
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.MONTH);
    }

}
