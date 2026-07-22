# SGCC Database Design

## Document Information

| Attribute | Value |
|---|---|
| Product | SGCC |
| Full Name | Sistema de Gestión de Cobros y Consumos de Recibos |
| Document Type | Database Design Definition |
| Version | 1.0 |
| Status | Draft |
| Database | PostgreSQL 16+ |
| Migration Tool | Flyway |
| Based On | Cloud Lab v1.0 |
| Last Updated | 2026-07-21 |

---

# 1. Purpose

Este documento define el diseño inicial de base de datos de SGCC.

El modelo debe soportar:

- Gestión de propiedades.
- Gestión de habitaciones/unidades.
- Gestión de inquilinos.
- Gestión de servicios.
- Registro de medidores.
- Registro de lecturas.
- Registro de recibos.
- Cálculo de liquidaciones.

---

# 2. Database Principles

SGCC seguirá los siguientes principios:

## 2.1 Domain Driven Database

Las tablas representan conceptos del negocio.

## 2.2 Integridad de datos

La base debe garantizar:

- Relaciones válidas.
- Restricciones.
- Consistencia histórica.

## 2.3 Evolución mediante migraciones

Todo cambio estructural debe realizarse mediante Flyway.

Ejemplo:

```text
V001__create_property_tables.sql
V002__create_reading_tables.sql
```

---

# 3. Naming Conventions

## Tables

Formato: `snake_case`

Ejemplo:

```text
properties
tenants
settlements
```

## Columns

Formato: `snake_case`

Ejemplo:

```text
created_at
updated_at
property_id
```

## Primary Keys

Formato: `id`

Tipo recomendado: UUID

Ejemplo:

```sql
id UUID PRIMARY KEY
```

---

# 4. Common Columns

Las entidades principales tendrán:

```text
id          UUID
created_at  TIMESTAMP
updated_at  TIMESTAMP
created_by  UUID
updated_by  UUID
status      VARCHAR
```

---

# 5. Entity Relationship Overview

Modelo conceptual:

```text
Property
   │
   ├──── Unit
   │        │
   │        ├──── Tenant
   │        │
   │        └──── Meter
   │                  │
   │                  └──── Reading
   │
Service
   │
   └──── Receipt
            │
            └──── Settlement
```

---

# 6. Property Model

**Table:** `properties`

Purpose: Representa una dirección física donde existen unidades habitables.

Columns:

```text
id
name
address
description
status
created_at
updated_at
```

Example:

```text
Casa Principal
Av. Example 123
```

---

# 7. Unit Model

**Table:** `units`

Purpose: Representa una habitación o espacio independiente.

Columns:

```text
id
property_id
name
description
status
created_at
updated_at
```

Relationship: `property 1:N units`

Example:

```text
Habitación 1
Habitación 2
Habitación 3
```

---

# 8. Tenant Model

**Table:** `tenants`

Purpose: Personas que ocupan una unidad.

Columns:

```text
id
name
document_number
phone
email
status
created_at
updated_at
```

---

# 9. Occupancy Model

**Table:** `occupancies`

Purpose: Mantener historial de ocupación.

Columns:

```text
id
tenant_id
unit_id
start_date
end_date
status
```

Relationships:

- `Tenant 1:N Occupancy`
- `Unit 1:N Occupancy`

Motivo: Una habitación puede tener diferentes inquilinos en el tiempo.

---

# 10. Service Model

**Table:** `services`

Purpose: Servicios cobrados.

Examples:

- Electricidad
- Agua
- Gas

Columns:

```text
id
name
measurement_unit
status
created_at
updated_at
```

Examples:

```text
kWh
m3
```

---

# 11. Meter Model

**Table:** `meters`

Purpose: Dispositivos que registran consumo.

Columns:

```text
id
unit_id
service_id
serial_number
status
created_at
updated_at
```

Relationships:

- `Unit 1:N Meter`
- `Service 1:N Meter`

---

# 12. Reading Model

**Table:** `readings`

Purpose: Registro histórico de mediciones.

Columns:

```text
id
meter_id
reading_date
reading_value
created_at
```

Example:

```text
01/07/2026
11110 kWh
```

Business calculation:

```text
consumption = current_reading - previous_reading
```

---

# 13. Receipt Model

**Table:** `receipts`

Purpose: Recibos recibidos del proveedor.

Columns:

```text
id
service_id
period
receipt_number
total_amount
total_consumption
created_at
```

Example:

```text
Luz Julio
S/475
584 kWh
```

---

# 14. Settlement Model

**Table:** `settlements`

Purpose: Resultado final del cálculo al inquilino.

Columns:

```text
id
receipt_id
tenant_id
consumption
unit_value
calculated_amount
adjustment_amount
final_amount
status
created_at
```

Formula:

```text
final_amount = (consumption × unit_value) + adjustment
```

---

# 15. Adjustment Model

**Table:** `settlement_adjustments`

Purpose: Registrar modificaciones manuales.

Columns:

```text
id
settlement_id
amount
reason
created_by
created_at
```

Important: Los ajustes nunca deben sobrescribir el cálculo original.

---

# 16. Audit Strategy

Inicialmente: Auditoría básica

```text
created_at
updated_at
created_by
```

Futuro: Tabla `audit_logs` para cambios críticos, historial y trazabilidad.

---

# 17. Index Strategy

Índices iniciales:

```text
Readings:     meter_id, reading_date
Settlements:  tenant_id, receipt_id, created_at
Occupancies:  unit_id, tenant_id
```

---

# 18. Data Integrity Rules

La base debe impedir:

- Reading inválida: `lectura_actual < lectura_anterior`
- Settlement sin tenant: No permitido.
- Meter sin servicio: No permitido.

---

# 19. Migration Structure

Ubicación:

```text
backend/src/main/resources/db/migration
```

Ejemplo:

```text
V001__create_property.sql
V002__create_tenant.sql
V003__create_meter.sql
V004__create_reading.sql
V005__create_settlement.sql
```

---

# 20. Future Database Evolution

Posibles extensiones:

- documents
- notifications
- payments
- analytics

No forman parte de SGCC v1.0.

---

# 21. Status

| Milestone | Status |
|---|---|
| Domain Mapping | ✓ |
| Database Model | ✓ |
| Implementation | Pending |
