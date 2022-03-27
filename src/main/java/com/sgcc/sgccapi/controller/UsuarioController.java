package com.sgcc.sgccapi.controller;

import com.sgcc.sgccapi.model.DTO.ActualizarPersonaDTO;
import com.sgcc.sgccapi.model.DTO.CambioEstadoDTO;
import com.sgcc.sgccapi.model.DTO.CrearPersonaDTO;
import com.sgcc.sgccapi.model.entity.Usuario;
import com.sgcc.sgccapi.model.service.IUsuarioService;
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
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final IUsuarioService usuarioService;

    public UsuarioController(IUsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<?> listarUsuarios() {
        Map<String, Object> response = new HashMap<>();
        List<Usuario> usuariosEncontrados;

        try {
            usuariosEncontrados = usuarioService.getAllUsuarios();
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(usuariosEncontrados, HttpStatus.OK);
    }

    @GetMapping("/{idUsuario}")
    public ResponseEntity<?> obtenerUsuarioByIdUsuario(@PathVariable Long idUsuario) {
        Map<String, Object> response = new HashMap<>();
        Optional<Usuario> usuarioEncontrado;

        try {
            usuarioEncontrado = usuarioService.getUsuarioByIdUsuario(idUsuario);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(usuarioEncontrado, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> crearUsuarioYPersona(@Valid @RequestBody CrearPersonaDTO crearPersonaDTO,
                                                  BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        Usuario usuarioCreado;

        try {
            if (result.hasErrors()) {
                List<String> errores = result.getFieldErrors()
                        .stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.toList());
                response.put("errors", errores);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            usuarioCreado = usuarioService.createUsuario(crearPersonaDTO);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(usuarioCreado, HttpStatus.CREATED);
    }

    @PutMapping("/{idUsuario}")
    public ResponseEntity<?> actualizarUsuarioYPersona(@PathVariable Long idUsuario,
                                                       @Valid @RequestBody ActualizarPersonaDTO actualizarPersonaDTO,
                                                       BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        Usuario usuarioActualizado;

        try {
            if (result.hasErrors()) {
                List<String> errores = result.getFieldErrors()
                        .stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.toList());
                response.put("errors", errores);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            usuarioActualizado = usuarioService.updateUsuario(idUsuario, actualizarPersonaDTO);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(usuarioActualizado, HttpStatus.CREATED);
    }

    @PutMapping("/estado")
    public ResponseEntity<?> actualizarEstadoUsuario(@Valid @RequestBody CambioEstadoDTO cambioEstadoDTO,
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

            usuarioService.updateEstadoUsuario(cambioEstadoDTO);
            response.put("msg", "El estado del usuario ha sido actualizado correctamente.");
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
