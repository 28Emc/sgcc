package com.sgcc.sgccapi.controller;

import com.sgcc.sgccapi.dto.ActualizarInquilinoDTO;
import com.sgcc.sgccapi.dto.CambioEstadoDTO;
import com.sgcc.sgccapi.dto.CrearInquilinoDTO;
import com.sgcc.sgccapi.service.IInquilinoService;
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
public class InquilinoController {

    private final IInquilinoService inquilinoService;

    public InquilinoController(IInquilinoService inquilinoService) {
        this.inquilinoService = inquilinoService;
    }

    @GetMapping("/inquilinos")
    public ResponseEntity<?> listarInquilinos() {
        Map<String, Object> response = new HashMap<>();
        response.put("data", inquilinoService.getAllInquilinos());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/inquilinos/details")
    public ResponseEntity<?> listarInquilinosDetail() {
        Map<String, Object> response = new HashMap<>();
        response.put("data", inquilinoService.getAllInquilinosDetail());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/inquilinos/{idInquilino}")
    public ResponseEntity<?> obtenerInquilinoByIdInquilino(@PathVariable Long idInquilino) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", inquilinoService.getInquilinoByIdInquilino(idInquilino));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/inquilinos/persona/{idPersona}")
    public ResponseEntity<?> obtenerInquilinoByIdPersona(@PathVariable Long idPersona) throws Exception {
        Map<String, Object> response = new HashMap<>();
        response.put("data", inquilinoService.getInquilinoByIdPersona(idPersona));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/inquilinos")
    public ResponseEntity<?> crearInquilinoYUsuario(@Valid @RequestBody CrearInquilinoDTO crearInquilinoDTO,
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

        inquilinoService.createUsuarioInquilino(crearInquilinoDTO);
        response.put("message", "Inquilino creado correctamente.");
        return ResponseEntity.ok(response);
    }

    @PutMapping({"/inquilinos/{idInquilino}", "/inquilinos/profile/{idInquilino}"})
    public ResponseEntity<?> actualizarInquilinoYUsuario(@PathVariable Long idInquilino,
                                                         @Valid @RequestBody ActualizarInquilinoDTO actualizarInquilinoDTO,
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

        inquilinoService.updateUsuarioInquilino(idInquilino, actualizarInquilinoDTO);
        response.put("message", "Datos del inquilino actualizados correctamente.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/inquilinos/estado")
    public ResponseEntity<?> actualizarEstadoUsuarioInquilino(@Valid @RequestBody CambioEstadoDTO cambioEstadoDTO,
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

        inquilinoService.updateEstadoUsuarioInquilino(cambioEstadoDTO);
        response.put("msg", "El estado del inquilino ha sido actualizado correctamente.");
        return ResponseEntity.ok(response);
    }
}
