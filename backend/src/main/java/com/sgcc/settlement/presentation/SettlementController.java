package com.sgcc.settlement.presentation;

import com.sgcc.settlement.application.SettlementService;
import com.sgcc.settlement.domain.Settlement;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/settlements")
public class SettlementController {

    private final SettlementService settlementService;

    public SettlementController(SettlementService settlementService) {
        this.settlementService = settlementService;
    }

    @GetMapping
    public ResponseEntity<List<SettlementService.SettlementListResponse>> findAll() {
        return ResponseEntity.ok(settlementService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Settlement> findById(@PathVariable String id) {
        return settlementService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/generate")
    public ResponseEntity<List<SettlementService.SettlementListResponse>> generateSettlements(
            @Valid @RequestBody GenerateSettlementRequest request) {
        List<SettlementService.TenantConsumption> consumptions = request.tenantConsumptions().stream()
                .map(tc -> new SettlementService.TenantConsumption(tc.tenantId(), tc.consumption()))
                .toList();
        List<SettlementService.SettlementListResponse> settlements = settlementService.generateSettlements(
                request.receiptId(),
                consumptions,
                request.unitValue()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(settlements);
    }

    @PostMapping("/{id}/adjust")
    public ResponseEntity<Settlement> applyAdjustment(
            @PathVariable String id,
            @Valid @RequestBody AdjustmentRequest request) {
        return settlementService.applyAdjustment(id, request.amount(), request.reason())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Settlement> complete(@PathVariable String id) {
        return settlementService.complete(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        settlementService.delete(id);
        return ResponseEntity.noContent().build();
    }

    public record GenerateSettlementRequest(
            @NotBlank(message = "Receipt ID is required") String receiptId,
            @NotNull(message = "Tenant consumptions are required") List<TenantConsumptionRequest> tenantConsumptions,
            @NotNull(message = "Unit value is required") BigDecimal unitValue
    ) {}

    public record TenantConsumptionRequest(
            @NotBlank(message = "Tenant ID is required") String tenantId,
            @NotNull(message = "Consumption is required") BigDecimal consumption
    ) {}

    public record AdjustmentRequest(
            @NotNull(message = "Adjustment amount is required") BigDecimal amount,
            @NotBlank(message = "Reason is required") String reason
    ) {}
}
