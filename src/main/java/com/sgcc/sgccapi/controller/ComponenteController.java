package com.sgcc.sgccapi.controller;

import com.sgcc.sgccapi.dto.CambioEstadoDTO;
import com.sgcc.sgccapi.model.Componente;
import com.sgcc.sgccapi.service.IComponenteService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
        response.put("data", componenteService.getAllComponentes());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/componente-padre/{idComponentePadre}")
    public ResponseEntity<?> listarComponentesByIdComponentePadre(@PathVariable Long idComponentePadre) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", componenteService.getAllComponentesByIdComponentePadre(idComponentePadre));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{idComponente}")
    public ResponseEntity<?> obtenerComponenteByIdComponente(@PathVariable Long idComponente) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", componenteService.getComponenteByIdComponente(idComponente));
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> crearComponente(@Valid @RequestBody Componente componente,
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

        componenteService.createComponente(componente);
        response.put("message", "Componente creado correctamente.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{idComponente}")
    public ResponseEntity<?> actualizarComponente(@PathVariable Long idComponente,
                                                  @Valid @RequestBody Componente componente,
                                                  BindingResult result) throws Exception {
        Map<String, Object> response = new HashMap<>();

        if (result.hasErrors()) {
            List<String> errores = result.getFieldErrors()
                    .stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.toList());
            response.put("errors", errores);
            return ResponseEntity.badRequest().body(errores);
        }

        componenteService.updateComponente(idComponente, componente);
        response.put("message", "Datos del componente actualizados correctamente.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/estado")
    public ResponseEntity<?> actualizarEstadoComponente(@Valid @RequestBody CambioEstadoDTO cambioEstadoDTO,
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

        componenteService.updateEstadoComponente(cambioEstadoDTO);
        response.put("message", "Estado del componente actualizado correctamente.");
        return ResponseEntity.ok(response);
    }
}
