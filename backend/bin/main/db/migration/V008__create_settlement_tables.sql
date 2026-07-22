-- V008__create_settlement_tables.sql
-- SGCC Settlement Domain

CREATE TABLE settlements (
    id VARCHAR(36) PRIMARY KEY,
    receipt_id VARCHAR(36) NOT NULL,
    tenant_id VARCHAR(36) NOT NULL,
    consumption NUMERIC(12,3) NOT NULL,
    unit_value NUMERIC(12,2) NOT NULL,
    calculated_amount NUMERIC(12,2) NOT NULL,
    adjustment_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    final_amount NUMERIC(12,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_settlements_receipt FOREIGN KEY (receipt_id) 
        REFERENCES receipts(id) ON DELETE CASCADE,
    CONSTRAINT fk_settlements_tenant FOREIGN KEY (tenant_id) 
        REFERENCES tenants(id) ON DELETE CASCADE,
    CONSTRAINT chk_final_amount_positive CHECK (final_amount >= 0)
);

CREATE TABLE settlement_adjustments (
    id VARCHAR(36) PRIMARY KEY,
    settlement_id VARCHAR(36) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    reason VARCHAR(500) NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_adjustments_settlement FOREIGN KEY (settlement_id) 
        REFERENCES settlements(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_settlements_receipt_id ON settlements(receipt_id);
CREATE INDEX idx_settlements_tenant_id ON settlements(tenant_id);
CREATE INDEX idx_settlements_status ON settlements(status);
CREATE INDEX idx_settlements_created_at ON settlements(created_at);
CREATE INDEX idx_adjustments_settlement_id ON settlement_adjustments(settlement_id);
