package com.sgcc.meter.domain;

import com.sgcc.shared.domain.BaseEntity;
import com.sgcc.shared.domain.DomainException;
import com.sgcc.shared.domain.Status;
import jakarta.persistence.*;

@Entity
@Table(name = "meters")
public class Meter extends BaseEntity {

    @Column(name = "unit_id", nullable = false)
    private String unitId;

    @Column(name = "service_id", nullable = false)
    private String serviceId;

    @Column(name = "serial_number", nullable = false, unique = true)
    private String serialNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    protected Meter() {}

    public Meter(String unitId, String serviceId, String serialNumber) {
        this.unitId = unitId;
        this.serviceId = serviceId;
        this.serialNumber = serialNumber;
        this.status = Status.ACTIVE;
        validate();
    }

    private void validate() {
        if (unitId == null || unitId.isBlank()) {
            throw new DomainException("UNIT_ID_REQUIRED", "Unit ID is required");
        }
        if (serviceId == null || serviceId.isBlank()) {
            throw new DomainException("SERVICE_ID_REQUIRED", "Service ID is required");
        }
        if (serialNumber == null || serialNumber.isBlank()) {
            throw new DomainException("SERIAL_NUMBER_REQUIRED", "Serial number is required");
        }
    }

    public String getUnitId() {
        return unitId;
    }

    public String getServiceId() {
        return serviceId;
    }

    public void update(String unitId, String serviceId, String serialNumber) {
        if (unitId != null && !unitId.isBlank()) this.unitId = unitId;
        if (serviceId != null && !serviceId.isBlank()) this.serviceId = serviceId;
        if (serialNumber != null && !serialNumber.isBlank()) this.serialNumber = serialNumber;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public Status getStatus() {
        return status;
    }
}
