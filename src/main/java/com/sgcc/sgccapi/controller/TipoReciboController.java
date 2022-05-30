package com.sgcc.sgccapi.controller;

import com.sgcc.sgccapi.model.TipoRecibo;
import com.sgcc.sgccapi.service.ITipoReciboService;
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
public class TipoReciboController {
    private final ITipoReciboService tipoReciboService;

    public TipoReciboController(ITipoReciboService tipoReciboService) {
        this.tipoReciboService = tipoReciboService;
    }

    @GetMapping("/tipos-recibo")
    public ResponseEntity<?> listarTiposRecibo() {
        Map<String, Object> response = new HashMap<>();
        response.put("data", tipoReciboService.getAllTiposRecibo());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/tipos-recibo/{idTipoRecibo}")
    public ResponseEntity<?> obtenerTipoReciboByIdTipoRecibo(@PathVariable Long idTipoRecibo) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", tipoReciboService.getTipoReciboByIdTipoRecibo(idTipoRecibo));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/tipos-recibo")
    public ResponseEntity<?> crearTipoRecibo(@Valid @RequestBody TipoRecibo tipoRecibo,
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

        tipoReciboService.createTipoRecibo(tipoRecibo);
        response.put("message", "Tipo de recibo creado correctamente.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/tipos-recibo/{idTipoRecibo}")
    public ResponseEntity<?> actualizarTipoRecibo(@PathVariable Long idTipoRecibo,
                                                  @Valid @RequestBody TipoRecibo tipoRecibo,
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

        tipoReciboService.updateTipoRecibo(idTipoRecibo, tipoRecibo);
        response.put("message", "Datos del tipo de recibo actualizados correctamente.");
        return ResponseEntity.ok(response);
    }
}
