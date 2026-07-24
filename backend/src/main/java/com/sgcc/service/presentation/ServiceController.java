package com.sgcc.service.presentation;

import com.sgcc.service.application.ServiceService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/services")
public class ServiceController {

    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @GetMapping
    public ResponseEntity<List<com.sgcc.service.domain.Service>> findAll() {
        return ResponseEntity.ok(serviceService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<com.sgcc.service.domain.Service> findById(@PathVariable String id) {
        return serviceService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<com.sgcc.service.domain.Service> create(@Valid @RequestBody CreateServiceRequest request) {
        com.sgcc.service.domain.Service service = serviceService.create(request.name(), request.measurementUnit());
        return ResponseEntity.status(HttpStatus.CREATED).body(service);
    }

    @PutMapping("/{id}")
    public ResponseEntity<com.sgcc.service.domain.Service> update(@PathVariable String id,
                                          @Valid @RequestBody UpdateServiceRequest request) {
        return serviceService.update(id, request.name(), request.measurementUnit())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        serviceService.delete(id);
        return ResponseEntity.noContent().build();
    }

    public record CreateServiceRequest(
            @NotBlank(message = "Service name is required") String name,
            @NotBlank(message = "Measurement unit is required") String measurementUnit
    ) {}

    public record UpdateServiceRequest(
            @NotBlank(message = "Service name is required") String name,
            @NotBlank(message = "Measurement unit is required") String measurementUnit
    ) {}
}
