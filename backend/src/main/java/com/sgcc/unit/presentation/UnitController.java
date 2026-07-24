package com.sgcc.unit.presentation;

import com.sgcc.property.domain.Unit;
import com.sgcc.unit.application.UnitService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/units")
public class UnitController {

    private final UnitService unitService;

    public UnitController(UnitService unitService) {
        this.unitService = unitService;
    }

    @GetMapping
    public ResponseEntity<List<Unit>> findAll() {
        return ResponseEntity.ok(unitService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Unit> findById(@PathVariable String id) {
        return unitService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-property/{propertyId}")
    public ResponseEntity<List<Unit>> findByPropertyId(@PathVariable String propertyId) {
        return ResponseEntity.ok(unitService.findByPropertyId(propertyId));
    }

    @PostMapping
    public ResponseEntity<Unit> create(@Valid @RequestBody CreateUnitRequest request) {
        Unit unit = unitService.create(request.propertyId(), request.name(), request.description());
        return ResponseEntity.status(HttpStatus.CREATED).body(unit);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Unit> update(@PathVariable String id,
                                       @Valid @RequestBody UpdateUnitRequest request) {
        return unitService.update(id, request.propertyId(), request.name(), request.description())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        unitService.delete(id);
        return ResponseEntity.noContent().build();
    }

    public record CreateUnitRequest(
            @NotBlank(message = "Property ID is required") String propertyId,
            @NotBlank(message = "Unit name is required") String name,
            String description
    ) {}

    public record UpdateUnitRequest(
            @NotBlank(message = "Property ID is required") String propertyId,
            @NotBlank(message = "Unit name is required") String name,
            String description
    ) {}
}
