package com.sgcc.sgccapi.controller;

import com.sgcc.sgccapi.dto.ActualizarReciboDTO;
import com.sgcc.sgccapi.service.IReciboService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/mantenimiento/recibos")
//@CrossOrigin(origins = "*")
public class ReciboController {
    private final IReciboService reciboService;

    public ReciboController(IReciboService reciboService) {
        this.reciboService = reciboService;
    }

    @GetMapping
    public ResponseEntity<?> listarRecibos() {
        Map<String, Object> response = new HashMap<>();
        response.put("data", reciboService.getAllRecibos());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{idRecibo}")
    public ResponseEntity<?> obtenerReciboByIdRecibo(@PathVariable Long idRecibo) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", reciboService.getReciboByIdRecibo(idRecibo, false));
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> crearRecibo(@RequestParam("crearReciboDTO") String crearReciboDTO,
                                         @RequestParam(value = "file") MultipartFile file) throws Exception {
        Map<String, Object> response = new HashMap<>();
        reciboService.createRecibo(crearReciboDTO, file);
        response.put("message", "Recibo creado correctamente.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{idRecibo}")
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

    @PutMapping("/file/{idRecibo}")
    public ResponseEntity<?> actualizarFileRecibo(@PathVariable Long idRecibo,
                                                  @Valid @RequestParam("file") MultipartFile file) throws Exception {
        Map<String, Object> response = new HashMap<>();
        reciboService.updateUrlRecibo(idRecibo, file);
        response.put("msg", "El archivo del recibo ha sido actualizado correctamente.");
        return ResponseEntity.ok(response);
    }
}
