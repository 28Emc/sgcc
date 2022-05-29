package com.sgcc.sgccapi.controller;

import com.sgcc.sgccapi.dto.ActualizarRolDTO;
import com.sgcc.sgccapi.dto.CrearRolDTO;
import com.sgcc.sgccapi.dto.PermisosComponentesDTO;
import com.sgcc.sgccapi.service.IPermisoService;
import com.sgcc.sgccapi.service.IRolService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/mantenimiento/roles")
//@CrossOrigin(origins = "*")
public class RolController {

    private final IRolService rolService;
    private final IPermisoService permisoService;

    public RolController(IRolService rolService, IPermisoService permisoService) {
        this.rolService = rolService;
        this.permisoService = permisoService;
    }

    @GetMapping
    public ResponseEntity<?> listarRoles() {
        Map<String, Object> response = new HashMap<>();
        response.put("data", rolService.getAllRoles());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{idRol}")
    public ResponseEntity<?> obtenerRolByIdRol(@PathVariable Long idRol) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", rolService.getRolByIdRol(idRol));
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> crearRol(@Valid @RequestBody CrearRolDTO crearRolDTO,
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

        rolService.createRol(crearRolDTO);
        response.put("message", "Rol creado correctamente.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{idRol}")
    public ResponseEntity<?> actualizarRol(@PathVariable Long idRol,
                                           @Valid @RequestBody ActualizarRolDTO actualizarRolDTO,
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

        rolService.updateRol(idRol, actualizarRolDTO);
        response.put("message", "Datos del rol actualizados correctamente.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/permisos")
    public ResponseEntity<?> actualizarPermisosComponentes(@Valid @RequestBody
                                                           PermisosComponentesDTO permisosComponentesDTO,
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
        response.put("message", "Permisos sobre componentes actualizados correctamente.");
        permisoService.updateOrCreatePermisosComponentes(permisosComponentesDTO);
        return ResponseEntity.ok(response);
    }
}
