package com.sgcc.settlement.application;

import com.sgcc.settlement.domain.CalculationService;
import com.sgcc.settlement.domain.Settlement;
import com.sgcc.settlement.domain.SettlementRepository;
import com.sgcc.shared.domain.Identifier;
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

    public SettlementService(SettlementRepository settlementRepository,
                            CalculationService calculationService) {
        this.settlementRepository = settlementRepository;
        this.calculationService = calculationService;
    }

    @Transactional(readOnly = true)
    public List<Settlement> findAll() {
        return settlementRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Settlement> findById(String id) {
        return settlementRepository.findById(Identifier.from(id));
    }

    public List<Settlement> generateSettlements(String receiptId,
                                                 List<TenantConsumption> tenantConsumptions,
                                                 BigDecimal unitValue) {
        List<CalculationService.TenantConsumption> consumptions = tenantConsumptions.stream()
                .map(tc -> new CalculationService.TenantConsumption(tc.tenantId(), tc.consumption()))
                .toList();

        List<Settlement> settlements = calculationService.generateSettlements(
                receiptId, consumptions, unitValue);

        return settlements.stream()
                .map(settlementRepository::save)
                .toList();
    }

    public Optional<Settlement> applyAdjustment(String id, BigDecimal amount, String reason) {
        return settlementRepository.findById(Identifier.from(id))
                .map(settlement -> {
                    settlement.applyAdjustment(amount, reason);
                    return settlementRepository.save(settlement);
                });
    }

    public record TenantConsumption(String tenantId, BigDecimal consumption) {}
}
