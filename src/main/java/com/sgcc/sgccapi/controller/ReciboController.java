package com.sgcc.sgccapi.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.sgcc.sgccapi.model.DTO.ActualizarReciboDTO;
import com.sgcc.sgccapi.model.entity.Recibo;
import com.sgcc.sgccapi.model.service.IReciboService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recibos")
public class ReciboController {
    private final IReciboService reciboService;

    public ReciboController(IReciboService reciboService) {
        this.reciboService = reciboService;
    }

    @GetMapping
    public ResponseEntity<?> listarRecibos() {
        Map<String, Object> response = new HashMap<>();
        List<Recibo> recibosEncontrados;

        try {
            recibosEncontrados = reciboService.getAllRecibos();
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(recibosEncontrados, HttpStatus.OK);
    }

    @GetMapping("/{idRecibo}")
    public ResponseEntity<?> obtenerReciboByIdRecibo(@PathVariable Long idRecibo) {
        Map<String, Object> response = new HashMap<>();
        Optional<Recibo> reciboEncontrado;

        try {
            reciboEncontrado = reciboService.getReciboByIdRecibo(idRecibo);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(reciboEncontrado, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> crearRecibo(@RequestParam("crearReciboDTO") String reciboDTO,
                                         @RequestParam(value = "file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        Recibo reciboCreado;

        try {
            reciboCreado = reciboService.createRecibo(reciboDTO, file);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(reciboCreado, HttpStatus.CREATED);
    }

    @PutMapping("/{idRecibo}")
    public ResponseEntity<?> actualizarRecibo(@PathVariable Long idRecibo,
                                              @Valid @RequestBody ActualizarReciboDTO actualizarReciboDTO,
                                              BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        Recibo reciboActualizado;

        try {
            if (result.hasErrors()) {
                List<String> errores = result.getFieldErrors()
                        .stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.toList());
                response.put("errors", errores);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            reciboActualizado = reciboService.updateRecibo(idRecibo, actualizarReciboDTO);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(reciboActualizado, HttpStatus.CREATED);
    }

    @PutMapping("/file/{idRecibo}")
    public ResponseEntity<?> actualizarFileRecibo(@PathVariable Long idRecibo,
                                                  @Valid @RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        Recibo reciboActualizado;

        try {
            reciboActualizado = reciboService.updateUrlRecibo(idRecibo, file);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(reciboActualizado, HttpStatus.CREATED);
    }
}
