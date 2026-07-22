package com.sgcc.settlement.domain;

import com.sgcc.shared.domain.DomainException;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Component
public class CalculationService {

    public BigDecimal calculateConsumption(BigDecimal currentReading, BigDecimal previousReading) {
        if (currentReading == null || previousReading == null) {
            throw new DomainException("READINGS_REQUIRED", "Both readings are required");
        }
        if (currentReading.compareTo(previousReading) < 0) {
            throw new DomainException("INVALID_READING", "Current reading cannot be less than previous reading");
        }
        return currentReading.subtract(previousReading);
    }

    public BigDecimal calculateUnitValue(BigDecimal totalAmount, BigDecimal totalConsumption) {
        if (totalAmount == null || totalConsumption == null) {
            throw new DomainException("VALUES_REQUIRED", "Total amount and consumption are required");
        }
        if (totalConsumption.compareTo(BigDecimal.ZERO) == 0) {
            throw new DomainException("ZERO_CONSUMPTION", "Cannot calculate unit value with zero consumption");
        }
        return totalAmount
                .divide(totalConsumption, 6, RoundingMode.HALF_UP)
                .setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateTenantAmount(BigDecimal consumption, BigDecimal unitValue) {
        if (consumption == null || unitValue == null) {
            throw new DomainException("VALUES_REQUIRED", "Consumption and unit value are required");
        }
        return consumption.multiply(unitValue).setScale(2, RoundingMode.HALF_UP);
    }

    public Settlement generateSettlement(String receiptId, String tenantId,
                                          BigDecimal consumption, BigDecimal unitValue) {
        return Settlement.calculate(receiptId, tenantId, consumption, unitValue);
    }

    public List<Settlement> generateSettlements(String receiptId,
                                                  List<TenantConsumption> tenantConsumptions,
                                                  BigDecimal unitValue) {
        return tenantConsumptions.stream()
                .map(tc -> generateSettlement(receiptId, tc.getTenantId(), tc.getConsumption(), unitValue))
                .toList();
    }

    public static class TenantConsumption {
        private final String tenantId;
        private final BigDecimal consumption;

        public TenantConsumption(String tenantId, BigDecimal consumption) {
            this.tenantId = tenantId;
            this.consumption = consumption;
        }

        public String getTenantId() {
            return tenantId;
        }

        public BigDecimal getConsumption() {
            return consumption;
        }
    }
}
