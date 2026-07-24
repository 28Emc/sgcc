package com.sgcc.property.presentation;

import com.sgcc.property.application.PropertyService;
import com.sgcc.property.domain.Property;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping
    public ResponseEntity<List<Property>> findAll() {
        return ResponseEntity.ok(propertyService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Property> findById(@PathVariable String id) {
        return propertyService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Property> create(@Valid @RequestBody CreatePropertyRequest request) {
        Property property = propertyService.create(
                request.name(),
                request.address(),
                request.description()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(property);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Property> update(@PathVariable String id,
                                          @Valid @RequestBody UpdatePropertyRequest request) {
        return propertyService.update(id, request.name(), request.address(), request.description())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        propertyService.delete(id);
        return ResponseEntity.noContent().build();
    }

    public record CreatePropertyRequest(
            @NotBlank(message = "Property name is required") String name,
            @NotBlank(message = "Address is required") String address,
            String description
    ) {}

    public record UpdatePropertyRequest(
            @NotBlank(message = "Property name is required") String name,
            @NotBlank(message = "Address is required") String address,
            String description
    ) {}
}
