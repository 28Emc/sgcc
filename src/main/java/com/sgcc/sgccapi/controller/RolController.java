package com.sgcc.sgccapi.controller;

import com.sgcc.sgccapi.model.DTO.ActualizarRolDTO;
import com.sgcc.sgccapi.model.DTO.CrearRolDTO;
import com.sgcc.sgccapi.model.entity.Rol;
import com.sgcc.sgccapi.model.service.IRolService;
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
@RequestMapping("/api/roles")
public class RolController {

    private final IRolService rolService;

    public RolController(IRolService rolService) {
        this.rolService = rolService;
    }

    @GetMapping
    public ResponseEntity<?> listarRoles() {
        Map<String, Object> response = new HashMap<>();
        List<Rol> rolesEncontrados;

        try {
            rolesEncontrados = rolService.getAllRoles();
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(rolesEncontrados, HttpStatus.OK);
    }

    @GetMapping("/{idRol}")
    public ResponseEntity<?> obtenerRolByIdRol(@PathVariable Long idRol) {
        Map<String, Object> response = new HashMap<>();
        Optional<Rol> rolEncontrado;

        try {
            rolEncontrado = rolService.getRolByIdRol(idRol);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(rolEncontrado, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> crearRol(@Valid @RequestBody CrearRolDTO crearRolDTO,
                                      BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        Rol rolCreado;

        try {
            if (result.hasErrors()) {
                List<String> errores = result.getFieldErrors()
                        .stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.toList());
                response.put("errors", errores);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            rolCreado = rolService.createRol(crearRolDTO);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(rolCreado, HttpStatus.CREATED);
    }

    @PutMapping("/{idRol}")
    public ResponseEntity<?> actualizarRol(@PathVariable Long idRol,
                                           @Valid @RequestBody ActualizarRolDTO actualizarRolDTO,
                                           BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        Rol rolActualizado;

        try {
            if (result.hasErrors()) {
                List<String> errores = result.getFieldErrors()
                        .stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.toList());
                response.put("errors", errores);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            rolActualizado = rolService.updateRol(idRol, actualizarRolDTO);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(rolActualizado, HttpStatus.CREATED);
    }
}
