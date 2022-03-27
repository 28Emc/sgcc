package com.sgcc.sgccapi.controller;

import com.sgcc.sgccapi.model.DTO.ActualizarLecturaDTO;
import com.sgcc.sgccapi.model.DTO.CambioEstadoDTO;
import com.sgcc.sgccapi.model.DTO.CrearLecturaDTO;
import com.sgcc.sgccapi.model.entity.Lectura;
import com.sgcc.sgccapi.model.service.ILecturaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lecturas")
public class LecturaController {
    private final ILecturaService lecturaService;

    public LecturaController(ILecturaService lecturaService) {
        this.lecturaService = lecturaService;
    }

    @GetMapping
    public ResponseEntity<?> listarLecturas() {
        Map<String, Object> response = new HashMap<>();
        List<Lectura> lecturasEncontradas;

        try {
            lecturasEncontradas = lecturaService.getAllLecturas();
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(lecturasEncontradas, HttpStatus.OK);
    }

    @GetMapping("/{idLectura}")
    public ResponseEntity<?> obtenerLecturaByIdLectura(@PathVariable Long idLectura) {
        Map<String, Object> response = new HashMap<>();
        Optional<Lectura> lecturaEncontrada;

        try {
            lecturaEncontrada = lecturaService.getLecturaByIdLectura(idLectura);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(lecturaEncontrada, HttpStatus.OK);
    }

    @GetMapping("/inquilino/{idInquilino}")
    public ResponseEntity<?> obtenerLecturasByIdInquilino(@PathVariable Long idInquilino) {
        Map<String, Object> response = new HashMap<>();
        List<Lectura> lecturasEncontradas;

        try {
            lecturasEncontradas = lecturaService.getAllLecturasByIdInquilino(idInquilino);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(lecturasEncontradas, HttpStatus.OK);
    }

    @GetMapping("/recibo/{idRecibo}")
    public ResponseEntity<?> obtenerLecturasByIdRecibo(@PathVariable Long idRecibo) {
        Map<String, Object> response = new HashMap<>();
        List<Lectura> lecturasEncontradas;

        try {
            lecturasEncontradas = lecturaService.getAllLecturasByIdRecibo(idRecibo);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(lecturasEncontradas, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> crearLectura(@Valid @RequestBody CrearLecturaDTO crearLecturaDTO,
                                          BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        Lectura lecturaCreada;

        try {
            if (result.hasErrors()) {
                List<String> errores = result.getFieldErrors()
                        .stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.toList());
                response.put("errors", errores);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            lecturaCreada = lecturaService.createLectura(crearLecturaDTO);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(lecturaCreada, HttpStatus.CREATED);
    }

    @PutMapping("/{idLectura}")
    public ResponseEntity<?> actualizarLectura(@PathVariable Long idLectura,
                                               @Valid @RequestBody ActualizarLecturaDTO actualizarLecturaDTO,
                                               BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        Lectura lecturaActualizada;

        try {
            if (result.hasErrors()) {
                List<String> errores = result.getFieldErrors()
                        .stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.toList());
                response.put("errors", errores);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            lecturaActualizada = lecturaService.updateLectura(idLectura, actualizarLecturaDTO);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(lecturaActualizada, HttpStatus.CREATED);
    }

    @PutMapping("/estado")
    public ResponseEntity<?> actualizarEstadoLectura(@Valid @RequestBody CambioEstadoDTO cambioEstadoDTO,
                                                     BindingResult result) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (result.hasErrors()) {
                List<String> errores = result.getFieldErrors()
                        .stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.toList());
                response.put("errors", errores);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            lecturaService.updateEstadoLectura(cambioEstadoDTO);
            response.put("msg", "La lectura ha sido actualizada correctamente.");
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
