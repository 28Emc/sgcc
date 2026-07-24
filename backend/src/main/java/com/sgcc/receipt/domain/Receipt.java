package com.sgcc.receipt.domain;

import com.sgcc.shared.domain.BaseEntity;
import com.sgcc.shared.domain.DomainException;
import com.sgcc.shared.domain.Money;
import com.sgcc.shared.domain.Period;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Table(name = "receipts")
public class Receipt extends BaseEntity {

    @Column(name = "service_id", nullable = false)
    private String serviceId;

    @Column(name = "period", nullable = false)
    private String period;

    @Column(name = "receipt_number", nullable = false, unique = true)
    private String receiptNumber;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "total_consumption", nullable = false, precision = 12, scale = 3)
    private BigDecimal totalConsumption;

    protected Receipt() {}

    public Receipt(String serviceId, String period, String receiptNumber,
                   BigDecimal totalAmount, BigDecimal totalConsumption) {
        this.serviceId = serviceId;
        this.period = period;
        this.receiptNumber = receiptNumber;
        this.totalAmount = totalAmount;
        this.totalConsumption = totalConsumption;
        validate();
    }

    private void validate() {
        if (serviceId == null || serviceId.isBlank()) {
            throw new DomainException("SERVICE_ID_REQUIRED", "Service ID is required");
        }
        if (period == null || period.isBlank()) {
            throw new DomainException("PERIOD_REQUIRED", "Period is required");
        }
        if (receiptNumber == null || receiptNumber.isBlank()) {
            throw new DomainException("RECEIPT_NUMBER_REQUIRED", "Receipt number is required");
        }
        if (totalAmount == null || totalAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new DomainException("INVALID_TOTAL_AMOUNT", "Total amount must be positive");
        }
        if (totalConsumption == null || totalConsumption.compareTo(BigDecimal.ZERO) <= 0) {
            throw new DomainException("INVALID_TOTAL_CONSUMPTION", "Total consumption must be positive");
        }
    }

    public BigDecimal calculateUnitValue() {
        if (this.totalConsumption.compareTo(BigDecimal.ZERO) == 0) {
            throw new DomainException("ZERO_CONSUMPTION", "Cannot calculate unit value with zero consumption");
        }
        return this.totalAmount
                .divide(this.totalConsumption, 6, RoundingMode.HALF_UP)
                .setScale(2, RoundingMode.HALF_UP);
    }

    public String getServiceId() {
        return serviceId;
    }

    public String getPeriod() {
        return period;
    }

    public String getReceiptNumber() {
        return receiptNumber;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public BigDecimal getTotalConsumption() {
        return totalConsumption;
    }

    public void update(String period, BigDecimal totalAmount, BigDecimal totalConsumption) {
        if (period != null && !period.isBlank()) this.period = period;
        if (totalAmount != null && totalAmount.compareTo(BigDecimal.ZERO) > 0) this.totalAmount = totalAmount;
        if (totalConsumption != null && totalConsumption.compareTo(BigDecimal.ZERO) > 0) this.totalConsumption = totalConsumption;
    }
}
