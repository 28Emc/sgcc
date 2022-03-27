package com.sgcc.sgccapi.controller;

import com.sgcc.sgccapi.model.DTO.ActualizarPermisoDTO;
import com.sgcc.sgccapi.model.DTO.CambioEstadoDTO;
import com.sgcc.sgccapi.model.DTO.CrearPermisoDTO;
import com.sgcc.sgccapi.model.entity.Permiso;
import com.sgcc.sgccapi.model.service.IPermisoService;
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
@RequestMapping("/api/permisos")
public class PermisoController {

    private final IPermisoService permisoService;

    public PermisoController(IPermisoService permisoService) {
        this.permisoService = permisoService;
    }

    @GetMapping
    public ResponseEntity<?> listarPermisos() {
        Map<String, Object> response = new HashMap<>();
        List<Permiso> permisosEncontrados;

        try {
            permisosEncontrados = permisoService.getAllPermisos();
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(permisosEncontrados, HttpStatus.OK);
    }

    @GetMapping("/rol/{idRol}")
    public ResponseEntity<?> listarPermisosByIdRol(@PathVariable Long idRol) {
        Map<String, Object> response = new HashMap<>();
        List<Permiso> permisosEncontrados;

        try {
            permisosEncontrados = permisoService.getAllPermisosByIdRol(idRol);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(permisosEncontrados, HttpStatus.OK);
    }

    @GetMapping("/{idPermiso}")
    public ResponseEntity<?> obtenerPermisoByIdPermiso(@PathVariable Long idPermiso) {
        Map<String, Object> response = new HashMap<>();
        Optional<Permiso> permisoEncontrado;

        try {
            permisoEncontrado = permisoService.getPermisoByIdPermiso(idPermiso);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(permisoEncontrado, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> crearPermiso(@Valid @RequestBody CrearPermisoDTO crearPermisoDTO,
                                          BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        Permiso permisoCreado;

        try {
            if (result.hasErrors()) {
                List<String> errores = result.getFieldErrors()
                        .stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.toList());
                response.put("errors", errores);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            permisoCreado = permisoService.createPermiso(crearPermisoDTO);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(permisoCreado, HttpStatus.CREATED);
    }

    @PutMapping("/{idPermiso}")
    public ResponseEntity<?> actualizarPermiso(@PathVariable Long idPermiso,
                                               @Valid @RequestBody ActualizarPermisoDTO actualizarPermisoDTO,
                                               BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        Permiso permisoActualizado;

        try {
            if (result.hasErrors()) {
                List<String> errores = result.getFieldErrors()
                        .stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.toList());
                response.put("errors", errores);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            permisoActualizado = permisoService.updatePermiso(idPermiso, actualizarPermisoDTO);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(permisoActualizado, HttpStatus.CREATED);
    }

    @PutMapping("/estado")
    public ResponseEntity<?> actualizarEstadoPermiso(@Valid @RequestBody CambioEstadoDTO cambioEstadoDTO,
                                                     BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        Permiso permisoActualizado;

        try {
            if (result.hasErrors()) {
                List<String> errores = result.getFieldErrors()
                        .stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.toList());
                response.put("errors", errores);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            permisoService.updateEstadoPermiso(cambioEstadoDTO);
            response.put("msg", "El permiso ha sido actualizado correctamente.");
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
