-- V007__create_receipt_tables.sql
-- SGCC Receipt Domain

CREATE TABLE receipts (
    id VARCHAR(36) PRIMARY KEY,
    service_id VARCHAR(36) NOT NULL,
    period VARCHAR(20) NOT NULL,
    receipt_number VARCHAR(100) NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    total_consumption NUMERIC(12,3) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_receipts_service FOREIGN KEY (service_id) 
        REFERENCES services(id) ON DELETE CASCADE,
    CONSTRAINT uk_receipts_number UNIQUE (receipt_number),
    CONSTRAINT chk_total_consumption_positive CHECK (total_consumption > 0)
);

-- Create indexes
CREATE INDEX idx_receipts_service_id ON receipts(service_id);
CREATE INDEX idx_receipts_period ON receipts(period);
