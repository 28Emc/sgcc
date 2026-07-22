-- V009__create_indexes.sql
-- SGCC Additional Indexes

-- Composite indexes for common queries
CREATE INDEX idx_readings_meter_reading_date ON readings(meter_id, reading_date DESC);
CREATE INDEX idx_settlements_tenant_created_at ON settlements(tenant_id, created_at DESC);
CREATE INDEX idx_settlements_receipt_created_at ON settlements(receipt_id, created_at DESC);
CREATE INDEX idx_occupancies_unit_tenant ON occupancies(unit_id, tenant_id);
CREATE INDEX idx_tenants_status_created_at ON tenants(status, created_at DESC);
CREATE INDEX idx_properties_status_created_at ON properties(status, created_at DESC);
