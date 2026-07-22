package com.sgcc.reading.presentation;

import com.sgcc.reading.application.ReadingService;
import com.sgcc.reading.domain.Reading;
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
    public ResponseEntity<List<Reading>> findAll() {
        return ResponseEntity.ok(readingService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reading> findById(@PathVariable String id) {
        return readingService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Reading> create(@RequestBody CreateReadingRequest request) {
        Reading reading = readingService.create(
                request.meterId(),
                request.readingDate(),
                request.readingValue()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(reading);
    }

    public record CreateReadingRequest(
            String meterId,
            LocalDate readingDate,
            BigDecimal readingValue
    ) {}
}
