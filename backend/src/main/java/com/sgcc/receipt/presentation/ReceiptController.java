package com.sgcc.receipt.presentation;

import com.sgcc.receipt.application.ReceiptService;
import com.sgcc.receipt.domain.Receipt;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/receipts")
public class ReceiptController {

    private final ReceiptService receiptService;

    public ReceiptController(ReceiptService receiptService) {
        this.receiptService = receiptService;
    }

    @GetMapping
    public ResponseEntity<List<Receipt>> findAll() {
        return ResponseEntity.ok(receiptService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Receipt> findById(@PathVariable String id) {
        return receiptService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Receipt> create(@RequestBody CreateReceiptRequest request) {
        Receipt receipt = receiptService.create(
                request.serviceId(),
                request.period(),
                request.receiptNumber(),
                request.totalAmount(),
                request.totalConsumption()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(receipt);
    }

    public record CreateReceiptRequest(
            String serviceId,
            String period,
            String receiptNumber,
            BigDecimal totalAmount,
            BigDecimal totalConsumption
    ) {}
}
