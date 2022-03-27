package com.sgcc.sgccapi.controller;

import com.sgcc.sgccapi.model.DTO.*;
import com.sgcc.sgccapi.model.entity.Inquilino;
import com.sgcc.sgccapi.model.entity.Usuario;
import com.sgcc.sgccapi.model.service.IInquilinoService;
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
@RequestMapping("/api/inquilinos")
public class InquilinoController {

    private final IInquilinoService inquilinoService;

    public InquilinoController(IInquilinoService inquilinoService) {
        this.inquilinoService = inquilinoService;
    }

    @GetMapping
    public ResponseEntity<?> listarInquilinos() {
        Map<String, Object> response = new HashMap<>();
        List<Inquilino> inquilinosEncontrados;

        try {
            inquilinosEncontrados = inquilinoService.getAllInquilinos();
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(inquilinosEncontrados, HttpStatus.OK);
    }

    @GetMapping("/{idInquilino}")
    public ResponseEntity<?> obtenerInquilinoByIdInquilino(@PathVariable Long idInquilino) {
        Map<String, Object> response = new HashMap<>();
        Optional<Inquilino> inquilinoEncontrado;

        try {
            inquilinoEncontrado = inquilinoService.getInquilinoByIdInquilino(idInquilino);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(inquilinoEncontrado, HttpStatus.OK);
    }

    @GetMapping("/persona/{idPersona}")
    public ResponseEntity<?> obtenerInquilinoByIdPersona(@PathVariable Long idPersona) {
        Map<String, Object> response = new HashMap<>();
        Optional<Inquilino> inquilinoEncontrado;

        try {
            inquilinoEncontrado = inquilinoService.getInquilinoByIdPersona(idPersona);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(inquilinoEncontrado, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> crearInquilinoYUsuario(@Valid @RequestBody CrearInquilinoDTO crearInquilinoDTO,
                                                    BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        Inquilino inquilinoCreado;

        try {
            if (result.hasErrors()) {
                List<String> errores = result.getFieldErrors()
                        .stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.toList());
                response.put("errors", errores);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            inquilinoCreado = inquilinoService.createUsuarioInquilino(crearInquilinoDTO);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(inquilinoCreado, HttpStatus.CREATED);
    }

    @PutMapping("/{idInquilino}")
    public ResponseEntity<?> actualizarInquilinoYUsuario(@PathVariable Long idInquilino,
                                                         @Valid @RequestBody ActualizarInquilinoDTO actualizarInquilinoDTO,
                                                         BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        Inquilino inquilinoActualizado;

        try {
            if (result.hasErrors()) {
                List<String> errores = result.getFieldErrors()
                        .stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.toList());
                response.put("errors", errores);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            inquilinoActualizado = inquilinoService.updateUsuarioInquilino(idInquilino, actualizarInquilinoDTO);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(inquilinoActualizado, HttpStatus.CREATED);
    }

    @PutMapping("/estado")
    public ResponseEntity<?> actualizarEstadoUsuarioInquilino(@Valid @RequestBody CambioEstadoDTO cambioEstadoDTO,
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

            inquilinoService.updateEstadoUsuarioInquilino(cambioEstadoDTO);
            response.put("msg", "El estado del usuario inquilino ha sido actualizado correctamente.");
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
