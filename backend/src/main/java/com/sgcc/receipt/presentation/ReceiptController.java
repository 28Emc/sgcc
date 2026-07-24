package com.sgcc.receipt.presentation;

import com.sgcc.receipt.application.ReceiptService;
import com.sgcc.receipt.domain.Receipt;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    public ResponseEntity<List<ReceiptService.ReceiptListResponse>> findAll() {
        return ResponseEntity.ok(receiptService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Receipt> findById(@PathVariable String id) {
        return receiptService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Receipt> create(@Valid @RequestBody CreateReceiptRequest request) {
        Receipt receipt = receiptService.create(
                request.serviceId(),
                request.period(),
                request.receiptNumber(),
                request.totalAmount(),
                request.totalConsumption()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(receipt);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Receipt> update(@PathVariable String id,
                                          @Valid @RequestBody UpdateReceiptRequest request) {
        return receiptService.update(id, request.period(), request.totalAmount(), request.totalConsumption())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        receiptService.delete(id);
        return ResponseEntity.noContent().build();
    }

    public record CreateReceiptRequest(
            @NotBlank(message = "Service ID is required") String serviceId,
            @NotBlank(message = "Period is required") String period,
            @NotBlank(message = "Receipt number is required") String receiptNumber,
            @NotNull(message = "Total amount is required") BigDecimal totalAmount,
            @NotNull(message = "Total consumption is required") BigDecimal totalConsumption
    ) {}

    public record UpdateReceiptRequest(
            @NotBlank(message = "Period is required") String period,
            @NotNull(message = "Total amount is required") BigDecimal totalAmount,
            @NotNull(message = "Total consumption is required") BigDecimal totalConsumption
    ) {}
}
