package com.sgcc.reading.presentation;

import com.sgcc.reading.application.ReadingService;
import com.sgcc.reading.domain.Reading;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/readings")
public class ReadingController {

    private final ReadingService readingService;

    public ReadingController(ReadingService readingService) {
        this.readingService = readingService;
    }

    @GetMapping
    public ResponseEntity<List<ReadingService.ReadingListResponse>> findAll() {
        return ResponseEntity.ok(readingService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reading> findById(@PathVariable String id) {
        return readingService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Reading> create(@Valid @RequestBody CreateReadingRequest request) {
        Reading reading = readingService.create(
                request.meterId(),
                request.readingDate(),
                request.readingValue()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(reading);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reading> update(@PathVariable String id,
                                          @Valid @RequestBody UpdateReadingRequest request) {
        return readingService.update(id, request.readingDate(), request.readingValue())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        readingService.delete(id);
        return ResponseEntity.noContent().build();
    }

    public record CreateReadingRequest(
            @NotNull(message = "Meter ID is required") String meterId,
            @NotNull(message = "Reading date is required") LocalDate readingDate,
            @NotNull(message = "Reading value is required") BigDecimal readingValue
    ) {}

    public record UpdateReadingRequest(
            @NotNull(message = "Reading date is required") LocalDate readingDate,
            @NotNull(message = "Reading value is required") BigDecimal readingValue
    ) {}
}
