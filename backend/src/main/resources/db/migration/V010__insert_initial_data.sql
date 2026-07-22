-- V010__insert_initial_data.sql
-- SGCC Initial Data

-- Insert initial services
INSERT INTO services (id, name, measurement_unit, status, created_at, updated_at) VALUES
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Electricidad', 'kWh', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Agua', 'm³', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Gas', 'm³', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
