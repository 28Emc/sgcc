package com.sgcc.sgccapi.controller;

import com.sgcc.sgccapi.dto.ActualizarLecturaDTO;
import com.sgcc.sgccapi.dto.CambioEstadoDTO;
import com.sgcc.sgccapi.dto.CrearLecturaDTO;
import com.sgcc.sgccapi.service.ILecturaService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.sgcc.sgccapi.constant.SecurityConstants.MANTENIMIENTO_PATH;

@RestController
@RequestMapping(MANTENIMIENTO_PATH)
public class LecturaController {
    private final ILecturaService lecturaService;

    public LecturaController(ILecturaService lecturaService) {
        this.lecturaService = lecturaService;
    }

    @GetMapping("/lecturas")
    public ResponseEntity<?> listarLecturas() {
        Map<String, Object> response = new HashMap<>();
        response.put("data", lecturaService.getAllLecturas());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/lecturas/details")
    public ResponseEntity<?> listarLecturasWithDetails() {
        Map<String, Object> response = new HashMap<>();
        response.put("data", lecturaService.getAllLecturasWithDetails());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/lecturas/{idLectura}")
    public ResponseEntity<?> obtenerLecturaByIdLectura(@PathVariable Long idLectura) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", lecturaService.getLecturaByIdLectura(idLectura));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/lecturas/inquilino/{idInquilino}")
    public ResponseEntity<?> obtenerLecturasByIdInquilino(@PathVariable Long idInquilino) throws Exception {
        Map<String, Object> response = new HashMap<>();
        response.put("data", lecturaService.getAllLecturasByIdInquilino(idInquilino));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/lecturas/recibo/{idRecibo}")
    public ResponseEntity<?> obtenerLecturasByIdRecibo(@PathVariable Long idRecibo) throws Exception {
        Map<String, Object> response = new HashMap<>();
        response.put("data", lecturaService.getAllLecturasByIdRecibo(idRecibo));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/lecturas")
    public ResponseEntity<?> crearLectura(@Valid @RequestBody CrearLecturaDTO crearLecturaDTO,
                                          BindingResult result) throws Exception {
        Map<String, Object> response = new HashMap<>();

        if (result.hasErrors()) {
            List<String> errores = result.getFieldErrors()
                    .stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.toList());
            response.put("errors", errores);
            return ResponseEntity.badRequest().body(response);
        }

        lecturaService.createLectura(crearLecturaDTO);
        response.put("message", "Lectura creada correctamente.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/lecturas/{idLectura}")
    public ResponseEntity<?> actualizarLectura(@PathVariable Long idLectura,
                                               @Valid @RequestBody ActualizarLecturaDTO actualizarLecturaDTO,
                                               BindingResult result) throws Exception {
        Map<String, Object> response = new HashMap<>();

        if (result.hasErrors()) {
            List<String> errores = result.getFieldErrors()
                    .stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.toList());
            response.put("errors", errores);
            return ResponseEntity.badRequest().body(response);
        }

        lecturaService.updateLectura(idLectura, actualizarLecturaDTO);
        response.put("message", "Datos de la lectura actualizados correctamente.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/lecturas/estado")
    public ResponseEntity<?> actualizarEstadoLectura(@Valid @RequestBody CambioEstadoDTO cambioEstadoDTO,
                                                     BindingResult result) throws Exception {
        Map<String, Object> response = new HashMap<>();

        if (result.hasErrors()) {
            List<String> errores = result.getFieldErrors()
                    .stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.toList());
            response.put("errors", errores);
            return ResponseEntity.badRequest().body(response);
        }

        lecturaService.updateEstadoLectura(cambioEstadoDTO);
        response.put("msg", "El estado de la lectura ha sido actualizada correctamente.");
        return ResponseEntity.ok(response);
    }
}
