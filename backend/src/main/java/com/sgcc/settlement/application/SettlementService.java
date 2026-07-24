package com.sgcc.settlement.application;

import com.sgcc.receipt.infrastructure.ReceiptJpaRepository;
import com.sgcc.settlement.domain.CalculationService;
import com.sgcc.settlement.domain.Settlement;
import com.sgcc.settlement.domain.SettlementRepository;
import com.sgcc.shared.domain.Identifier;
import com.sgcc.tenant.infrastructure.TenantJpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SettlementService {

    private final SettlementRepository settlementRepository;
    private final CalculationService calculationService;
    private final TenantJpaRepository tenantJpaRepository;
    private final ReceiptJpaRepository receiptJpaRepository;

    public SettlementService(SettlementRepository settlementRepository,
                             CalculationService calculationService,
                             TenantJpaRepository tenantJpaRepository,
                             ReceiptJpaRepository receiptJpaRepository) {
        this.settlementRepository = settlementRepository;
        this.calculationService = calculationService;
        this.tenantJpaRepository = tenantJpaRepository;
        this.receiptJpaRepository = receiptJpaRepository;
    }

    @Transactional(readOnly = true)
    public List<SettlementListResponse> findAll() {
        return settlementRepository.findAll().stream()
                .map(settlement -> {
                    String tenantName = tenantJpaRepository.findById(settlement.getTenantId())
                            .map(tenant -> tenant.getName())
                            .orElse(null);
                    String receiptNumber = receiptJpaRepository.findById(settlement.getReceiptId())
                            .map(receipt -> receipt.getReceiptNumber())
                            .orElse(null);
                    String period = receiptJpaRepository.findById(settlement.getReceiptId())
                            .map(receipt -> receipt.getPeriod())
                            .orElse(null);
                    return new SettlementListResponse(
                            settlement.getId(),
                            settlement.getReceiptId(),
                            settlement.getTenantId(),
                            settlement.getConsumption(),
                            settlement.getUnitValue(),
                            settlement.getCalculatedAmount(),
                            settlement.getAdjustmentAmount(),
                            settlement.getFinalAmount(),
                            settlement.getStatus().name(),
                            tenantName,
                            receiptNumber,
                            period
                    );
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<Settlement> findById(String id) {
        return settlementRepository.findById(Identifier.from(id));
    }

    public List<SettlementListResponse> generateSettlements(String receiptId,
                                                  List<TenantConsumption> tenantConsumptions,
                                                  BigDecimal unitValue) {
        List<CalculationService.TenantConsumption> consumptions = tenantConsumptions.stream()
                .map(tc -> new CalculationService.TenantConsumption(tc.tenantId(), tc.consumption()))
                .toList();

        List<Settlement> settlements = calculationService.generateSettlements(
                receiptId, consumptions, unitValue);

        return settlements.stream()
                .map(settlementRepository::save)
                .map(settlement -> {
                    String tenantName = tenantJpaRepository.findById(settlement.getTenantId())
                            .map(tenant -> tenant.getName())
                            .orElse(null);
                    String receiptNumber = receiptJpaRepository.findById(settlement.getReceiptId())
                            .map(receipt -> receipt.getReceiptNumber())
                            .orElse(null);
                    String period = receiptJpaRepository.findById(settlement.getReceiptId())
                            .map(receipt -> receipt.getPeriod())
                            .orElse(null);
                    return new SettlementListResponse(
                            settlement.getId(),
                            settlement.getReceiptId(),
                            settlement.getTenantId(),
                            settlement.getConsumption(),
                            settlement.getUnitValue(),
                            settlement.getCalculatedAmount(),
                            settlement.getAdjustmentAmount(),
                            settlement.getFinalAmount(),
                            settlement.getStatus().name(),
                            tenantName,
                            receiptNumber,
                            period
                    );
                })
                .toList();
    }

    public Optional<Settlement> applyAdjustment(String id, BigDecimal amount, String reason) {
        return settlementRepository.findById(Identifier.from(id))
                .map(settlement -> {
                    settlement.applyAdjustment(amount, reason);
                    return settlementRepository.save(settlement);
                });
    }

    public Optional<Settlement> complete(String id) {
        return settlementRepository.findById(Identifier.from(id))
                .map(settlement -> {
                    settlement.complete();
                    return settlementRepository.save(settlement);
                });
    }

    public void delete(String id) {
        settlementRepository.findById(Identifier.from(id))
                .ifPresent(settlementRepository::delete);
    }

    public record TenantConsumption(String tenantId, BigDecimal consumption) {}

    public record SettlementListResponse(
            String id,
            String receiptId,
            String tenantId,
            BigDecimal consumption,
            BigDecimal unitValue,
            BigDecimal calculatedAmount,
            BigDecimal adjustmentAmount,
            BigDecimal finalAmount,
            String status,
            String tenantName,
            String receiptNumber,
            String period
    ) {}
}
