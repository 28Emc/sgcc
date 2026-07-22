-- V006__create_reading_tables.sql
-- SGCC Reading Domain

CREATE TABLE readings (
    id VARCHAR(36) PRIMARY KEY,
    meter_id VARCHAR(36) NOT NULL,
    reading_date DATE NOT NULL,
    reading_value NUMERIC(12,3) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_readings_meter FOREIGN KEY (meter_id) 
        REFERENCES meters(id) ON DELETE CASCADE,
    CONSTRAINT chk_reading_value_positive CHECK (reading_value >= 0)
);

-- Create indexes
CREATE INDEX idx_readings_meter_id ON readings(meter_id);
CREATE INDEX idx_readings_reading_date ON readings(reading_date);
CREATE INDEX idx_readings_meter_date ON readings(meter_id, reading_date);
