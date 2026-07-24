package com.sgcc.meter.presentation;

import com.sgcc.meter.application.MeterService;
import com.sgcc.meter.domain.Meter;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/meters")
public class MeterController {

    private final MeterService meterService;

    public MeterController(MeterService meterService) {
        this.meterService = meterService;
    }

    @GetMapping
    public ResponseEntity<List<MeterService.MeterListResponse>> findAll() {
        return ResponseEntity.ok(meterService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Meter> findById(@PathVariable String id) {
        return meterService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Meter> create(@Valid @RequestBody CreateMeterRequest request) {
        Meter meter = meterService.create(
                request.unitId(),
                request.serviceId(),
                request.serialNumber()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(meter);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Meter> update(@PathVariable String id,
                                        @Valid @RequestBody UpdateMeterRequest request) {
        return meterService.update(id, request.unitId(), request.serviceId(), request.serialNumber())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        meterService.delete(id);
        return ResponseEntity.noContent().build();
    }

    public record CreateMeterRequest(
            @NotBlank(message = "Unit ID is required") String unitId,
            @NotBlank(message = "Service ID is required") String serviceId,
            @NotBlank(message = "Serial number is required") String serialNumber
    ) {}

    public record UpdateMeterRequest(
            @NotBlank(message = "Unit ID is required") String unitId,
            @NotBlank(message = "Service ID is required") String serviceId,
            @NotBlank(message = "Serial number is required") String serialNumber
    ) {}
}
