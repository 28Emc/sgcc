package com.sgcc.property.domain;

import com.sgcc.shared.domain.BaseEntity;
import com.sgcc.shared.domain.DomainException;
import com.sgcc.shared.domain.Status;
import jakarta.persistence.*;

@Entity
@Table(name = "units")
public class Unit extends BaseEntity {

    @Column(name = "property_id", nullable = false)
    private String propertyId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    protected Unit() {}

    public Unit(String propertyId, String name, String description) {
        this.propertyId = propertyId;
        this.name = name;
        this.description = description;
        this.status = Status.ACTIVE;
        validate();
    }

    private void validate() {
        if (propertyId == null || propertyId.isBlank()) {
            throw new DomainException("PROPERTY_ID_REQUIRED", "Property ID is required");
        }
        if (name == null || name.isBlank()) {
            throw new DomainException("NAME_REQUIRED", "Unit name is required");
        }
    }

    public String getPropertyId() {
        return propertyId;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Status getStatus() {
        return status;
    }
}
