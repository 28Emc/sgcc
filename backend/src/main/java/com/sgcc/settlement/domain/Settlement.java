package com.sgcc.settlement.domain;

import com.sgcc.shared.domain.BaseEntity;
import com.sgcc.shared.domain.DomainException;
import com.sgcc.shared.domain.Money;
import com.sgcc.shared.domain.Status;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "settlements")
public class Settlement extends BaseEntity {

    @Column(name = "receipt_id", nullable = false)
    private String receiptId;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(name = "consumption", nullable = false, precision = 12, scale = 3)
    private BigDecimal consumption;

    @Column(name = "unit_value", nullable = false, precision = 12, scale = 2)
    private BigDecimal unitValue;

    @Column(name = "calculated_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal calculatedAmount;

    @Column(name = "adjustment_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal adjustmentAmount;

    @Column(name = "final_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal finalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    protected Settlement() {}

    public Settlement(String receiptId, String tenantId, BigDecimal consumption,
                      BigDecimal unitValue, BigDecimal calculatedAmount) {
        this.receiptId = receiptId;
        this.tenantId = tenantId;
        this.consumption = consumption;
        this.unitValue = unitValue;
        this.calculatedAmount = calculatedAmount;
        this.adjustmentAmount = BigDecimal.ZERO;
        this.finalAmount = calculatedAmount;
        this.status = Status.PENDING;
        validate();
    }

    private void validate() {
        if (receiptId == null || receiptId.isBlank()) {
            throw new DomainException("RECEIPT_ID_REQUIRED", "Receipt ID is required");
        }
        if (tenantId == null || tenantId.isBlank()) {
            throw new DomainException("TENANT_ID_REQUIRED", "Tenant ID is required");
        }
        if (consumption == null || consumption.compareTo(BigDecimal.ZERO) < 0) {
            throw new DomainException("INVALID_CONSUMPTION", "Consumption cannot be negative");
        }
        if (unitValue == null || unitValue.compareTo(BigDecimal.ZERO) < 0) {
            throw new DomainException("INVALID_UNIT_VALUE", "Unit value cannot be negative");
        }
        if (calculatedAmount == null || calculatedAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new DomainException("INVALID_CALCULATED_AMOUNT", "Calculated amount cannot be negative");
        }
    }

    public static Settlement calculate(String receiptId, String tenantId,
                                       BigDecimal consumption, BigDecimal unitValue) {
        BigDecimal calculatedAmount = consumption.multiply(unitValue);
        return new Settlement(receiptId, tenantId, consumption, unitValue, calculatedAmount);
    }

    public void applyAdjustment(BigDecimal adjustmentAmount, String reason) {
        if (adjustmentAmount == null) {
            throw new DomainException("ADJUSTMENT_AMOUNT_REQUIRED", "Adjustment amount is required");
        }
        if (reason == null || reason.isBlank()) {
            throw new DomainException("ADJUSTMENT_REASON_REQUIRED", "Adjustment reason is required");
        }
        this.adjustmentAmount = this.adjustmentAmount.add(adjustmentAmount);
        this.finalAmount = this.calculatedAmount.add(this.adjustmentAmount);
        if (this.finalAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new DomainException("NEGATIVE_FINAL_AMOUNT", "Final amount cannot be negative");
        }
    }

    public void complete() {
        this.status = Status.COMPLETED;
    }

    public String getReceiptId() {
        return receiptId;
    }

    public String getTenantId() {
        return tenantId;
    }

    public BigDecimal getConsumption() {
        return consumption;
    }

    public BigDecimal getUnitValue() {
        return unitValue;
    }

    public BigDecimal getCalculatedAmount() {
        return calculatedAmount;
    }

    public BigDecimal getAdjustmentAmount() {
        return adjustmentAmount;
    }

    public BigDecimal getFinalAmount() {
        return finalAmount;
    }

    public Status getStatus() {
        return status;
    }
}
