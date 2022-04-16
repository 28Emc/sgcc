package com.sgcc.sgccapi.controller;

import com.sgcc.sgccapi.model.DTO.CambioEstadoDTO;
import com.sgcc.sgccapi.model.entity.Componente;
import com.sgcc.sgccapi.model.service.IComponenteService;
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
@RequestMapping("/api/mantenimiento/componentes")
@CrossOrigin(origins = "*")
public class ComponenteController {

    private final IComponenteService componenteService;

    public ComponenteController(IComponenteService componenteService) {
        this.componenteService = componenteService;
    }

    @GetMapping
    public ResponseEntity<?> listarComponentes() {
        Map<String, Object> response = new HashMap<>();
        List<Componente> componentesEncontrados;

        try {
            componentesEncontrados = componenteService.getAllComponentes();
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(componentesEncontrados, HttpStatus.OK);
    }

    @GetMapping("/componente-padre/{idComponentePadre}")
    public ResponseEntity<?> listarComponentesByIdComponentePadre(@PathVariable Long idComponentePadre) {
        Map<String, Object> response = new HashMap<>();
        List<Componente> componentesEncontrados;

        try {
            componentesEncontrados = componenteService.getAllComponentesByIdComponentePadre(idComponentePadre);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(componentesEncontrados, HttpStatus.OK);
    }

    @GetMapping("/{idComponente}")
    public ResponseEntity<?> obtenerComponenteByIdComponente(@PathVariable Long idComponente) {
        Map<String, Object> response = new HashMap<>();
        Optional<Componente> componenteEncontrado;

        try {
            componenteEncontrado = componenteService.getComponenteByIdComponente(idComponente);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(componenteEncontrado, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> crearComponente(@Valid @RequestBody Componente componente,
                                             BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        Componente componenteCreado;

        try {
            if (result.hasErrors()) {
                List<String> errores = result.getFieldErrors()
                        .stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.toList());
                response.put("errors", errores);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            componenteCreado = componenteService.createComponente(componente);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(componenteCreado, HttpStatus.CREATED);
    }

    @PutMapping("/{idComponente}")
    public ResponseEntity<?> actualizarComponente(@PathVariable Long idComponente,
                                                  @Valid @RequestBody Componente componente,
                                                  BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        Componente componenteActualizado;

        try {
            if (result.hasErrors()) {
                List<String> errores = result.getFieldErrors()
                        .stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.toList());
                response.put("errors", errores);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            componenteActualizado = componenteService.updateComponente(idComponente, componente);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(componenteActualizado, HttpStatus.CREATED);
    }

    @PutMapping("/estado")
    public ResponseEntity<?> actualizarEstadoComponente(@Valid @RequestBody CambioEstadoDTO cambioEstadoDTO,
                                                        BindingResult result) {
        Map<String, Object> response = new HashMap<>();
        Componente componenteActualizado;

        try {
            if (result.hasErrors()) {
                List<String> errores = result.getFieldErrors()
                        .stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.toList());
                response.put("errors", errores);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            componenteService.updateEstadoComponente(cambioEstadoDTO);
            response.put("msg", "El componente ha sido actualizado correctamente.");
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
