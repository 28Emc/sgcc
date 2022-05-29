package com.sgcc.sgccapi.controller;

import com.sgcc.sgccapi.dto.ActualizarPermisoDTO;
import com.sgcc.sgccapi.dto.CambioEstadoDTO;
import com.sgcc.sgccapi.dto.CrearPermisoDTO;
import com.sgcc.sgccapi.service.IPermisoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/mantenimiento/permisos")
//@CrossOrigin(origins = "*")
public class PermisoController {

    private final IPermisoService permisoService;

    public PermisoController(IPermisoService permisoService) {
        this.permisoService = permisoService;
    }

    @GetMapping
    public ResponseEntity<?> listarPermisos() {
        Map<String, Object> response = new HashMap<>();
        response.put("data", permisoService.getAllPermisos());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/roles/{idRol}")
    public ResponseEntity<?> listarPermisosByRolCustom(@PathVariable Long idRol) throws Exception {
        Map<String, Object> response = new HashMap<>();
        response.put("data", permisoService.spObtenerPermisosPorRol(idRol));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{idPermiso}")
    public ResponseEntity<?> obtenerPermisoByIdPermiso(@PathVariable Long idPermiso) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", permisoService.getPermisoByIdPermiso(idPermiso));
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> crearPermiso(@Valid @RequestBody CrearPermisoDTO crearPermisoDTO,
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

        permisoService.createPermiso(crearPermisoDTO);
        response.put("message", "Permiso creado correctamente.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{idPermiso}")
    public ResponseEntity<?> actualizarPermiso(@PathVariable Long idPermiso,
                                               @Valid @RequestBody ActualizarPermisoDTO actualizarPermisoDTO,
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

        permisoService.updatePermiso(idPermiso, actualizarPermisoDTO);
        response.put("message", "Datos del permiso actualizados correctamente.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/estado")
    public ResponseEntity<?> actualizarEstadoPermiso(@Valid @RequestBody CambioEstadoDTO cambioEstadoDTO,
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

        permisoService.updateEstadoPermiso(cambioEstadoDTO);
        response.put("msg", "El estado del permiso ha sido actualizado correctamente.");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
