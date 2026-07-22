package com.sgcc.settlement.presentation;

import com.sgcc.settlement.application.SettlementService;
import com.sgcc.settlement.domain.Settlement;
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
    public ResponseEntity<List<Settlement>> findAll() {
        return ResponseEntity.ok(settlementService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Settlement> findById(@PathVariable String id) {
        return settlementService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/generate")
    public ResponseEntity<List<Settlement>> generateSettlements(
            @RequestBody GenerateSettlementRequest request) {
        List<SettlementService.TenantConsumption> consumptions = request.tenantConsumptions().stream()
                .map(tc -> new SettlementService.TenantConsumption(tc.tenantId(), tc.consumption()))
                .toList();
        List<Settlement> settlements = settlementService.generateSettlements(
                request.receiptId(),
                consumptions,
                request.unitValue()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(settlements);
    }

    @PostMapping("/{id}/adjust")
    public ResponseEntity<Settlement> applyAdjustment(
            @PathVariable String id,
            @RequestBody AdjustmentRequest request) {
        return settlementService.applyAdjustment(id, request.amount(), request.reason())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public record GenerateSettlementRequest(
            String receiptId,
            List<TenantConsumptionRequest> tenantConsumptions,
            BigDecimal unitValue
    ) {}

    public record TenantConsumptionRequest(
            String tenantId,
            BigDecimal consumption
    ) {}

    public record AdjustmentRequest(
            BigDecimal amount,
            String reason
    ) {}
}
