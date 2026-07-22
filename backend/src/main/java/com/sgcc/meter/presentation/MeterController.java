package com.sgcc.meter.presentation;

import com.sgcc.meter.application.MeterService;
import com.sgcc.meter.domain.Meter;
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
    public ResponseEntity<List<Meter>> findAll() {
        return ResponseEntity.ok(meterService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Meter> findById(@PathVariable String id) {
        return meterService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Meter> create(@RequestBody CreateMeterRequest request) {
        Meter meter = meterService.create(
                request.unitId(),
                request.serviceId(),
                request.serialNumber()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(meter);
    }

    public record CreateMeterRequest(
            String unitId,
            String serviceId,
            String serialNumber
    ) {}
}
