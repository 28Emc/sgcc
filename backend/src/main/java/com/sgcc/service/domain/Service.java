package com.sgcc.service.domain;

import com.sgcc.shared.domain.BaseEntity;
import com.sgcc.shared.domain.DomainException;
import com.sgcc.shared.domain.Status;
import jakarta.persistence.*;

@Entity
@Table(name = "services")
public class Service extends BaseEntity {

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "measurement_unit", nullable = false)
    private String measurementUnit;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    protected Service() {}

    public Service(String name, String measurementUnit) {
        this.name = name;
        this.measurementUnit = measurementUnit;
        this.status = Status.ACTIVE;
        validate();
    }

    private void validate() {
        if (name == null || name.isBlank()) {
            throw new DomainException("NAME_REQUIRED", "Service name is required");
        }
        if (measurementUnit == null || measurementUnit.isBlank()) {
            throw new DomainException("MEASUREMENT_UNIT_REQUIRED", "Measurement unit is required");
        }
    }

    public String getName() {
        return name;
    }

    public String getMeasurementUnit() {
        return measurementUnit;
    }

    public Status getStatus() {
        return status;
    }
}
