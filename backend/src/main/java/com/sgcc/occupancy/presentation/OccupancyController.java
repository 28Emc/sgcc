package com.sgcc.occupancy.presentation;

import com.sgcc.occupancy.application.OccupancyService;
import com.sgcc.occupancy.domain.Occupancy;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/occupancies")
public class OccupancyController {

    private final OccupancyService occupancyService;

    public OccupancyController(OccupancyService occupancyService) {
        this.occupancyService = occupancyService;
    }

    @GetMapping
    public ResponseEntity<List<Occupancy>> findAll() {
        return ResponseEntity.ok(occupancyService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Occupancy> findById(@PathVariable String id) {
        return occupancyService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Occupancy> create(@Valid @RequestBody CreateOccupancyRequest request) {
        Occupancy occupancy = occupancyService.create(
                request.tenantId(),
                request.unitId(),
                request.startDate(),
                request.endDate()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(occupancy);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Occupancy> update(@PathVariable String id,
                                            @Valid @RequestBody UpdateOccupancyRequest request) {
        return occupancyService.update(id, request.tenantId(), request.unitId(),
                        request.startDate(), request.endDate())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        occupancyService.delete(id);
        return ResponseEntity.noContent().build();
    }

    public record CreateOccupancyRequest(
            @NotBlank(message = "Tenant ID is required") String tenantId,
            @NotBlank(message = "Unit ID is required") String unitId,
            @NotNull(message = "Start date is required") LocalDate startDate,
            LocalDate endDate
    ) {}

    public record UpdateOccupancyRequest(
            @NotBlank(message = "Tenant ID is required") String tenantId,
            @NotBlank(message = "Unit ID is required") String unitId,
            @NotNull(message = "Start date is required") LocalDate startDate,
            LocalDate endDate
    ) {}
}
