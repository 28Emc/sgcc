-- V005__create_meter_tables.sql
-- SGCC Meter Domain

CREATE TABLE meters (
    id VARCHAR(36) PRIMARY KEY,
    unit_id VARCHAR(36) NOT NULL,
    service_id VARCHAR(36) NOT NULL,
    serial_number VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_meters_unit FOREIGN KEY (unit_id) 
        REFERENCES units(id) ON DELETE CASCADE,
    CONSTRAINT fk_meters_service FOREIGN KEY (service_id) 
        REFERENCES services(id) ON DELETE CASCADE,
    CONSTRAINT uk_meters_serial UNIQUE (serial_number)
);

-- Create indexes
CREATE INDEX idx_meters_unit_id ON meters(unit_id);
CREATE INDEX idx_meters_service_id ON meters(service_id);
CREATE INDEX idx_meters_serial ON meters(serial_number);
