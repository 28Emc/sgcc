-- V003__create_tenant_tables.sql
-- SGCC Tenant Domain

CREATE TABLE tenants (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    document_number VARCHAR(50) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_tenants_document UNIQUE (document_number)
);

CREATE TABLE occupancies (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    unit_id VARCHAR(36) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_occupancies_tenant FOREIGN KEY (tenant_id) 
        REFERENCES tenants(id) ON DELETE CASCADE,
    CONSTRAINT fk_occupancies_unit FOREIGN KEY (unit_id) 
        REFERENCES units(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_tenants_document ON tenants(document_number);
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_occupancies_tenant_id ON occupancies(tenant_id);
CREATE INDEX idx_occupancies_unit_id ON occupancies(unit_id);
