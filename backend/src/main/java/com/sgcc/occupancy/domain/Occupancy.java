package com.sgcc.occupancy.domain;

import com.sgcc.shared.domain.BaseEntity;
import com.sgcc.shared.domain.DomainException;
import com.sgcc.shared.domain.Status;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "occupancies")
public class Occupancy extends BaseEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(name = "unit_id", nullable = false)
    private String unitId;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    protected Occupancy() {}

    public Occupancy(String tenantId, String unitId, LocalDate startDate, LocalDate endDate) {
        this.tenantId = tenantId;
        this.unitId = unitId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = Status.ACTIVE;
        validate();
    }

    private void validate() {
        if (tenantId == null || tenantId.isBlank()) {
            throw new DomainException("TENANT_ID_REQUIRED", "Tenant ID is required");
        }
        if (unitId == null || unitId.isBlank()) {
            throw new DomainException("UNIT_ID_REQUIRED", "Unit ID is required");
        }
        if (startDate == null) {
            throw new DomainException("START_DATE_REQUIRED", "Start date is required");
        }
    }

    public String getTenantId() { return tenantId; }
    public String getUnitId() { return unitId; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public Status getStatus() { return status; }
}
