package com.sgcc.sgccapi.controller;

import com.sgcc.sgccapi.dto.ActualizarPersonaDTO;
import com.sgcc.sgccapi.dto.CambioEstadoDTO;
import com.sgcc.sgccapi.dto.CrearPersonaDTO;
import com.sgcc.sgccapi.service.IUsuarioService;
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
public class UsuarioController {

    private final IUsuarioService usuarioService;

    public UsuarioController(IUsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/usuarios")
    public ResponseEntity<?> listarUsuarios() {
        Map<String, Object> response = new HashMap<>();
        response.put("data", usuarioService.getAllUsuarios());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/usuarios/{idUsuario}")
    public ResponseEntity<?> obtenerUsuarioByIdUsuario(@PathVariable Long idUsuario) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", usuarioService.getUsuarioByIdUsuario(idUsuario));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/usuarios")
    public ResponseEntity<?> crearUsuarioYPersona(@Valid @RequestBody CrearPersonaDTO crearPersonaDTO,
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

        usuarioService.createUsuario(crearPersonaDTO);
        response.put("message", "Usuario creado correctamente.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/usuarios/{idUsuario}")
    public ResponseEntity<?> actualizarUsuarioYPersona(@PathVariable Long idUsuario,
                                                       @Valid @RequestBody ActualizarPersonaDTO actualizarPersonaDTO,
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

        usuarioService.updateUsuario(idUsuario, actualizarPersonaDTO);
        response.put("message", "Datos del usuario actualizados correctamente.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/usuarios/estado")
    public ResponseEntity<?> actualizarEstadoUsuario(@Valid @RequestBody CambioEstadoDTO cambioEstadoDTO,
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

        usuarioService.updateEstadoUsuario(cambioEstadoDTO);
        response.put("msg", "El estado del usuario ha sido actualizado correctamente.");
        return ResponseEntity.ok(response);
    }
}
