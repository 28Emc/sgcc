package com.sgcc.sgccapi.controller;

import com.sgcc.sgccapi.model.entity.TipoRecibo;
import com.sgcc.sgccapi.model.service.ITipoReciboService;
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
@RequestMapping("/api/tipos-recibo")
public class TipoReciboController {
    private final ITipoReciboService tipoReciboService;

    public TipoReciboController(ITipoReciboService tipoReciboService) {
        this.tipoReciboService = tipoReciboService;
    }

    @GetMapping
    public ResponseEntity<?> listarTiposRecibo() {
        Map<String, Object> response = new HashMap<>();
        List<TipoRecibo> tiposReciboEncontrados;

        try {
            tiposReciboEncontrados = tipoReciboService.getAllTiposRecibo();
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(tiposReciboEncontrados, HttpStatus.OK);
    }

    @GetMapping("/{idTipoRecibo}")
    public ResponseEntity<?> obtenerTipoReciboByIdTipoRecibo(@PathVariable Long idTipoRecibo) {
        Map<String, Object> response = new HashMap<>();
        Optional<TipoRecibo> tipoReciboEncontrado;

        try {
            tipoReciboEncontrado = tipoReciboService.getTipoReciboByIdTipoRecibo(idTipoRecibo);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(tipoReciboEncontrado, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> crearTipoRecibo(@Valid @RequestBody TipoRecibo tipoRecibo,
                                             BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        TipoRecibo tipoReciboCreado;

        try {
            if (result.hasErrors()) {
                List<String> errores = result.getFieldErrors()
                        .stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.toList());
                response.put("errors", errores);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            tipoReciboCreado = tipoReciboService.createTipoRecibo(tipoRecibo);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(tipoReciboCreado, HttpStatus.CREATED);
    }

    @PutMapping("/{idTipoRecibo}")
    public ResponseEntity<?> actualizarTipoRecibo(@PathVariable Long idTipoRecibo,
                                                  @Valid @RequestBody TipoRecibo tipoRecibo,
                                                  BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        TipoRecibo tipoReciboActualizado;

        try {
            if (result.hasErrors()) {
                List<String> errores = result.getFieldErrors()
                        .stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.toList());
                response.put("errors", errores);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            tipoReciboActualizado = tipoReciboService.updateTipoRecibo(idTipoRecibo, tipoRecibo);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(tipoReciboActualizado, HttpStatus.CREATED);
    }
}
