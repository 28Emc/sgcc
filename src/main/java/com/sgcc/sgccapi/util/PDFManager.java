package com.sgcc.sgccapi.util;

import com.sgcc.sgccapi.constant.TiposReciboSGCC;
import com.sgcc.sgccapi.dto.CrearReciboDTO;
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

@NoArgsConstructor
@Component
public class PDFManager {

    public CrearReciboDTO readFromMultipartFile(TiposReciboSGCC tipoRecibo, MultipartFile multipartFile)
            throws Exception {
        PDDocument document = PDDocument.load(multipartFile.getInputStream());
        CrearReciboDTO crearReciboDTO = extractDataByTipoRecibo(document, tipoRecibo);
        multipartFile.getInputStream().close();
        document.close();

        return crearReciboDTO;
    }

    public CrearReciboDTO readFromFile(TiposReciboSGCC tipoRecibo, String filePath) throws Exception {
        File file = new File(filePath);
        FileInputStream fileInputStream = new FileInputStream(file);
        PDDocument document = PDDocument.load(fileInputStream);
        CrearReciboDTO crearReciboDTO = extractDataByTipoRecibo(document, tipoRecibo);
        document.close();
        fileInputStream.close();

        return crearReciboDTO;
    }

    public CrearReciboDTO readFromURL(TiposReciboSGCC tipoRecibo, String urlString) throws Exception {
        URL url = new URL(urlString);
        PDDocument document = PDDocument.load(url.openStream());
        CrearReciboDTO crearReciboDTO = extractDataByTipoRecibo(document, tipoRecibo);
        document.close();

        return crearReciboDTO;
    }

    private CrearReciboDTO extractDataByTipoRecibo(PDDocument document, TiposReciboSGCC tipoRecibo)
            throws Exception {
        PDFTextStripper pdfTextStripper = new PDFTextStripper();
        CrearReciboDTO crearReciboDTO = new CrearReciboDTO();
        switch (tipoRecibo) {
            case LUZ:
                pdfTextStripper.setStartPage(1);
                pdfTextStripper.setEndPage(1);
                crearReciboDTO = getDataFromReciboLuz(pdfTextStripper.getText(document));
                break;
            case AGUA:
                pdfTextStripper.setStartPage(1);
                pdfTextStripper.setEndPage(1);
                crearReciboDTO = getDataFromReciboAgua(pdfTextStripper.getText(document));
            case GAS:
            default:
                break;
        }

        return crearReciboDTO;
    }

    private CrearReciboDTO getDataFromReciboLuz(String rawPDFText) {
        CrearReciboDTO crearReciboDTO = new CrearReciboDTO();

        if (rawPDFText.contains("\r")) {
            String mesRecibo = rawPDFText
                    .substring(0, rawPDFText.indexOf("\r"))
                    .replace("\r", "")
                    .split(" ")[0]
                    .trim()
                    .toUpperCase();
            crearReciboDTO.setMesRecibo(mesRecibo);
        }

        /*
        if (rawPDFText.contains("Número de cliente")) {
            String tempDireccionRecibo = rawPDFText
                    .substring(0, rawPDFText.indexOf("Número de cliente"));
            String direccionRecibo = (tempDireccionRecibo.split("\r")[5]
                    + tempDireccionRecibo.split("\r")[6])
                    .trim()
                    .toUpperCase();
            crearReciboDTO.setDireccionRecibo(direccionRecibo);
        }
        */

        if ((rawPDFText.contains("*") || rawPDFText.contains("_")) && rawPDFText.contains("FISE")) {
            String importe;

            if (rawPDFText.contains("No estás al día")) {
                importe = rawPDFText
                        .substring(rawPDFText.indexOf("Redondeo Mes Actual"), rawPDFText.indexOf("SUBTOTAL Mes Actual"))
                        .split("\r")[8]
                        .trim();
            } else {
                importe = rawPDFText
                        .substring(rawPDFText.indexOf("*"), rawPDFText.lastIndexOf("_"))
                        .replace("*", "")
                        .replace("_", "")
                        .trim();
            }

            crearReciboDTO.setImporte(Double.parseDouble(importe));

            String tempConsumoTotal = rawPDFText
                    .substring(0, rawPDFText.indexOf("FISE"))
                    .replace("  ", " ")
                    .replace("  ", " ");
            String[] tempConsumoTotal2 = tempConsumoTotal.split("\r");
            String[] tempConsumoTotal3 = tempConsumoTotal.split("\r")[tempConsumoTotal2.length - 2]
                    .split(" ");
            String consumoTotalRecibo = tempConsumoTotal3[tempConsumoTotal3.length - 1]
                    .trim();
            crearReciboDTO.setConsumoTotal(Integer.parseInt(consumoTotalRecibo));
            double consumoUnitario = crearReciboDTO.getImporte() / crearReciboDTO.getConsumoTotal();
            BigDecimal consumoUnitarioBigDec = new BigDecimal(consumoUnitario)
                    .setScale(3, RoundingMode.HALF_UP);
            crearReciboDTO.setConsumoUnitario(consumoUnitarioBigDec.doubleValue());
        }

        return crearReciboDTO;
    }

    private CrearReciboDTO getDataFromReciboAgua(String rawPDFText) throws Exception {
        CrearReciboDTO crearReciboDTO = new CrearReciboDTO();

        if (rawPDFText.contains("Mes facturado:")) {
            String mesRecibo = rawPDFText
                    .substring(rawPDFText.indexOf("Mes facturado:"), rawPDFText.indexOf("Medidor:"))
                    .split("\r")[1]
                    .split(" ")[0]
                    .trim()
                    .toUpperCase();
            crearReciboDTO.setMesRecibo(mesRecibo);
        }

        /*
        if (rawPDFText.contains("Dirección del suministro:")) {
            String direccionRecibo = rawPDFText
                    .substring(rawPDFText.indexOf("Dirección del suministro:"),
                            rawPDFText.indexOf("INFORMACIÓN GENERAL INFORMACIÓN DE PAGO"))
                    .split("\r")[1]
                    .trim()
                    .toUpperCase();
            crearReciboDTO.setDireccionRecibo(direccionRecibo);
        }
        */

        if (rawPDFText.contains("*") && rawPDFText.contains("Importe total a")) {
            String tempImporte = rawPDFText
                    .substring(rawPDFText.indexOf("*"))
                    .replace("*", "");
            String importe = tempImporte
                    .substring(0, tempImporte.indexOf("\r"))
                    .replaceAll("Importe total a", "")
                    .trim();
            crearReciboDTO.setImporte(Double.parseDouble(importe));
            String consumoTotal = rawPDFText
                    .substring(rawPDFText.indexOf("Tipo de descarga"),
                            rawPDFText.indexOf("Fecha de vencimiento"))
                    .split("\r\n")[2]
                    .trim();
            crearReciboDTO.setConsumoTotal(Integer.parseInt(consumoTotal));
            double consumoUnitario = crearReciboDTO.getImporte() / crearReciboDTO.getConsumoTotal();
            BigDecimal consumoUnitarioBigDec = new BigDecimal(consumoUnitario)
                    .setScale(3, RoundingMode.HALF_UP);
            crearReciboDTO.setConsumoUnitario(consumoUnitarioBigDec.doubleValue());
        }

        return crearReciboDTO;
    }
}
