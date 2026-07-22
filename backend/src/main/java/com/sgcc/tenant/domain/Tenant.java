package com.sgcc.tenant.domain;

import com.sgcc.shared.domain.BaseEntity;
import com.sgcc.shared.domain.DomainException;
import com.sgcc.shared.domain.Status;
import jakarta.persistence.*;

@Entity
@Table(name = "tenants")
public class Tenant extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "document_number", nullable = false, unique = true)
    private String documentNumber;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    protected Tenant() {}

    public Tenant(String name, String documentNumber, String phone, String email) {
        this.name = name;
        this.documentNumber = documentNumber;
        this.phone = phone;
        this.email = email;
        this.status = Status.ACTIVE;
        validate();
    }

    private void validate() {
        if (name == null || name.isBlank()) {
            throw new DomainException("NAME_REQUIRED", "Tenant name is required");
        }
        if (documentNumber == null || documentNumber.isBlank()) {
            throw new DomainException("DOCUMENT_REQUIRED", "Document number is required");
        }
    }

    public void update(String name, String phone, String email) {
        if (name != null && !name.isBlank()) {
            this.name = name;
        }
        this.phone = phone;
        this.email = email;
        validate();
    }

    public String getName() {
        return name;
    }

    public String getDocumentNumber() {
        return documentNumber;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public Status getStatus() {
        return status;
    }
}
