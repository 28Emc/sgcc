package com.sgcc.sgccapi.controller;

import com.sgcc.sgccapi.dto.ActualizarMedidorDTO;
import com.sgcc.sgccapi.dto.CrearMedidorDTO;
import com.sgcc.sgccapi.service.IMedidorService;
import org.springframework.http.HttpStatus;
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
public class MedidorController {
    private final IMedidorService medidorService;

    public MedidorController(IMedidorService medidorService) {
        this.medidorService = medidorService;
    }

    @GetMapping("/medidores")
    public ResponseEntity<?> listarMedidores() {
        Map<String, Object> response = new HashMap<>();
        response.put("data", medidorService.getAllMedidores());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/medidores/{idMedidor}")
    public ResponseEntity<?> obtenerMedidorByIdMedidor(@PathVariable Long idMedidor) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", medidorService.getMedidorByIdMedidor(idMedidor));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/medidores/codigo/{codigo}")
    public ResponseEntity<?> obtenerMedidorByCodigoMedidor(@PathVariable String codigoMedidor) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", medidorService.getMedidorByCodigoMedidor(codigoMedidor));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/medidores")
    public ResponseEntity<?> crearMedidor(@Valid @RequestBody CrearMedidorDTO crearMedidorDTO,
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

        medidorService.createMedidor(crearMedidorDTO);
        response.put("message", "Medidor creado correctamente.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/medidores/{idMedidor}")
    public ResponseEntity<?> actualizarMedidor(@PathVariable Long idMedidor,
                                               @Valid @RequestBody ActualizarMedidorDTO actualizarMedidorDTO,
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

        medidorService.updateMedidor(idMedidor, actualizarMedidorDTO);
        response.put("message", "Datos del medidor actualizados correctamente.");
        return ResponseEntity.ok(response);
    }
}
