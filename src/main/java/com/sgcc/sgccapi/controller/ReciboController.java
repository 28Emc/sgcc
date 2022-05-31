package com.sgcc.sgccapi.controller;

import com.sgcc.sgccapi.constant.TiposReciboSGCC;
import com.sgcc.sgccapi.dto.ActualizarReciboDTO;
import com.sgcc.sgccapi.service.IReciboService;
import com.sgcc.sgccapi.util.PDFManager;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.File;
import java.io.FileInputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.sgcc.sgccapi.constant.SecurityConstants.MANTENIMIENTO_PATH;

@RestController
@RequestMapping(MANTENIMIENTO_PATH)
public class ReciboController {
    private final IReciboService reciboService;

    @Autowired
    private PDFManager pdfManager;

    public ReciboController(IReciboService reciboService) {
        this.reciboService = reciboService;
    }

    @GetMapping("/recibos")
    public ResponseEntity<?> listarRecibos() {
        Map<String, Object> response = new HashMap<>();
        response.put("data", reciboService.getAllRecibos());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recibos/{idRecibo}")
    public ResponseEntity<?> obtenerReciboByIdRecibo(@PathVariable Long idRecibo) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", reciboService.getReciboByIdRecibo(idRecibo, false));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/recibos")
    public ResponseEntity<?> crearRecibo(@RequestParam("crearReciboDTO") String crearReciboDTO,
                                         @RequestParam(value = "file") MultipartFile file) throws Exception {
        Map<String, Object> response = new HashMap<>();
        reciboService.createRecibo(crearReciboDTO, file);
        response.put("message", "Recibo creado correctamente.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/recibos/test/{tipoRecibo}")
    public ResponseEntity<?> cargarArchivo(@PathVariable TiposReciboSGCC tipoRecibo,
                                           @RequestParam(value = "file") MultipartFile multipartFile)
            throws Exception {
        Map<String, Object> response = new HashMap<>();
        response = pdfManager.readFromMultipartFile(tipoRecibo, multipartFile);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/recibos/{idRecibo}")
    public ResponseEntity<?> actualizarRecibo(@PathVariable Long idRecibo,
                                              @Valid @RequestBody ActualizarReciboDTO actualizarReciboDTO,
                                              BindingResult result) throws Exception {
        Map<String, Object> response = new HashMap<>();

        if (result.hasErrors()) {
            List<String> errores = result.getFieldErrors()
                    .stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.toList());
            response.put("errors", errores);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        reciboService.updateRecibo(idRecibo, actualizarReciboDTO);
        response.put("message", "Datos del recibo actualizados correctamente.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/recibos/file/{idRecibo}")
    public ResponseEntity<?> actualizarFileRecibo(@PathVariable Long idRecibo,
                                                  @Valid @RequestParam("file") MultipartFile file) throws Exception {
        Map<String, Object> response = new HashMap<>();
        reciboService.updateUrlRecibo(idRecibo, file);
        response.put("msg", "El archivo del recibo ha sido actualizado correctamente.");
        return ResponseEntity.ok(response);
    }
}
