package com.sgcc.reading.domain;

import com.sgcc.shared.domain.BaseEntity;
import com.sgcc.shared.domain.DomainException;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "readings")
public class Reading extends BaseEntity {

    @Column(name = "meter_id", nullable = false)
    private String meterId;

    @Column(name = "reading_date", nullable = false)
    private LocalDate readingDate;

    @Column(name = "reading_value", nullable = false, precision = 12, scale = 3)
    private BigDecimal readingValue;

    protected Reading() {}

    public Reading(String meterId, LocalDate readingDate, BigDecimal readingValue) {
        this.meterId = meterId;
        this.readingDate = readingDate;
        this.readingValue = readingValue;
        validate();
    }

    private void validate() {
        if (meterId == null || meterId.isBlank()) {
            throw new DomainException("METER_ID_REQUIRED", "Meter ID is required");
        }
        if (readingDate == null) {
            throw new DomainException("READING_DATE_REQUIRED", "Reading date is required");
        }
        if (readingValue == null || readingValue.compareTo(BigDecimal.ZERO) < 0) {
            throw new DomainException("INVALID_READING_VALUE", "Reading value must be non-negative");
        }
    }

    public BigDecimal calculateConsumption(BigDecimal previousReadingValue) {
        if (previousReadingValue == null) {
            throw new DomainException("PREVIOUS_READING_REQUIRED", "Previous reading is required");
        }
        if (this.readingValue.compareTo(previousReadingValue) < 0) {
            throw new DomainException("INVALID_CONSUMPTION", "Current reading cannot be less than previous reading");
        }
        return this.readingValue.subtract(previousReadingValue);
    }

    public String getMeterId() {
        return meterId;
    }

    public LocalDate getReadingDate() {
        return readingDate;
    }

    public BigDecimal getReadingValue() {
        return readingValue;
    }

    public void update(LocalDate readingDate, BigDecimal readingValue) {
        if (readingDate != null) this.readingDate = readingDate;
        if (readingValue != null && readingValue.compareTo(BigDecimal.ZERO) >= 0) this.readingValue = readingValue;
    }
}
