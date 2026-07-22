package com.sgcc.property.domain;

import com.sgcc.shared.domain.BaseEntity;
import com.sgcc.shared.domain.DomainException;
import com.sgcc.shared.domain.Status;
import jakarta.persistence.*;

@Entity
@Table(name = "properties")
public class Property extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    protected Property() {}

    public Property(String name, String address, String description) {
        this.name = name;
        this.address = address;
        this.description = description;
        this.status = Status.ACTIVE;
        validate();
    }

    private void validate() {
        if (name == null || name.isBlank()) {
            throw new DomainException("NAME_REQUIRED", "Property name is required");
        }
        if (address == null || address.isBlank()) {
            throw new DomainException("ADDRESS_REQUIRED", "Property address is required");
        }
    }

    public void update(String name, String address, String description) {
        if (name != null && !name.isBlank()) {
            this.name = name;
        }
        if (address != null && !address.isBlank()) {
            this.address = address;
        }
        this.description = description;
        validate();
    }

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public String getDescription() {
        return description;
    }

    public Status getStatus() {
        return status;
    }
}
