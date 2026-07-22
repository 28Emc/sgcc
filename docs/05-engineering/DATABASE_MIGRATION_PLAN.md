# SGCC Database Migration Plan

## Document Information

| Attribute | Value |
|---|---|
| Product | SGCC |
| Full Name | Sistema de Gestión de Cobros y Consumos de Recibos |
| Document Type | Database Migration Plan |
| Version | 1.0 |
| Status | Draft |
| Database | PostgreSQL 16+ |
| Migration Tool | Flyway |
| Based On | Cloud Lab v1.0 |
| Last Updated | 2026-07-21 |

---

## 1. Purpose

Este documento define la estrategia de creación y evolución del esquema de base de datos de SGCC.

Objetivos:

- Crear una base consistente desde cero.
- Mantener trazabilidad de cambios.
- Evitar modificaciones manuales.
- Permitir despliegues repetibles.

---

## 2. Migration Strategy

SGCC utilizará:

> Flyway Versioned Migrations

Regla:

> Toda modificación estructural debe generar una nueva migración.

No permitido:

- Modificar migraciones ya ejecutadas.
- Cambiar tablas manualmente en ambientes controlados.

---

## 3. Migration Location

Backend:

```
src/main/resources/db/migration
```

---

## 4. Naming Convention

Formato:

```
V{version}__{description}.sql
```

Ejemplo:

```
V001__create_base_schema.sql
```

---

## 5. Migration Order

Orden definido:

```
V001 - Base Schema
   ↓
V002 - Property Domain
   ↓
V003 - Tenant Domain
   ↓
V004 - Service Domain
   ↓
V005 - Meter Domain
   ↓
V006 - Reading Domain
   ↓
V007 - Receipt Domain
   ↓
V008 - Settlement Domain
   ↓
V009 - Indexes
   ↓
V010 - Initial Data
```

---

## 6. V001 — Base Schema

Archivo:

```
V001__create_base_schema.sql
```

Responsabilidad:

> Crear elementos comunes.

Incluye:

- UUID extension.
- Common functions.
- Base configuration.

---

Ejemplo:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## 7. V002 — Property Domain

Archivo:

```
V002__create_property_tables.sql
```

Crear:

- `properties`
- `units`

---

### properties

Campos:

- `id` UUID PK
- `name`
- `address`
- `description`
- `status`
- `created_at`
- `updated_at`

---

### units

Campos:

- `id` UUID PK
- `property_id` FK
- `name`
- `description`
- `status`
- `created_at`
- `updated_at`

---

Relación:

> `properties 1:N units`

---

## 8. V003 — Tenant Domain

Archivo:

```
V003__create_tenant_tables.sql
```

Crear:

- `tenants`
- `occupancies`

---

### tenants

Campos:

- `id`
- `name`
- `document_number`
- `phone`
- `email`
- `status`

---

### occupancies

Campos:

- `id`
- `tenant_id`
- `unit_id`
- `start_date`
- `end_date`
- `status`

---

Relaciones:

- `tenant 1:N occupancy`
- `unit 1:N occupancy`

---

## 9. V004 — Service Domain

Archivo:

```
V004__create_service_tables.sql
```

Crear:

- `services`

---

Campos:

- `id`
- `name`
- `measurement_unit`
- `status`
- `created_at`
- `updated_at`

---

Datos esperados:

- Electricidad
- Agua
- Gas

---

## 10. V005 — Meter Domain

Archivo:

```
V005__create_meter_tables.sql
```

Crear:

- `meters`

---

Campos:

- `id`
- `unit_id`
- `service_id`
- `serial_number`
- `status`
- `created_at`
- `updated_at`

---

Relaciones:

- `unit 1:N meters`
- `service 1:N meters`

---

## 11. V006 — Reading Domain

Archivo:

```
V006__create_reading_tables.sql
```

Crear:

- `readings`

---

Campos:

- `id`
- `meter_id`
- `reading_date`
- `reading_value`
- `created_at`

---

Regla:

> Una lectura pertenece a un medidor.

---

## 12. V007 — Receipt Domain

Archivo:

```
V007__create_receipt_tables.sql
```

Crear:

- `receipts`

---

Campos:

- `id`
- `service_id`
- `period`
- `receipt_number`
- `total_amount`
- `total_consumption`
- `created_at`

---

Regla:

> El recibo representa el costo real del proveedor.

---

## 13. V008 — Settlement Domain

Archivo:

```
V008__create_settlement_tables.sql
```

Crear:

- `settlements`
- `settlement_adjustments`

---

### settlements

Campos:

- `id`
- `receipt_id`
- `tenant_id`
- `consumption`
- `unit_value`
- `calculated_amount`
- `adjustment_amount`
- `final_amount`
- `status`
- `created_at`

---

### settlement_adjustments

Campos:

- `id`
- `settlement_id`
- `amount`
- `reason`
- `created_by`
- `created_at`

---

## 14. V009 — Indexes

Archivo:

```
V009__create_indexes.sql
```

Crear índices:

| Table | Columns |
|---|---|
| `readings` | `meter_id`, `reading_date` |
| `settlements` | `tenant_id`, `receipt_id`, `created_at` |
| `occupancies` | `unit_id`, `tenant_id` |

---

## 15. V010 — Initial Data

Archivo:

```
V010__insert_initial_data.sql
```

Datos iniciales:

**Servicios:**

- Electricidad
- Agua
- Gas

---

No insertar:

- usuarios reales.
- propiedades reales.
- inquilinos reales.

---

## 16. Data Integrity Rules

Constraints obligatorios:

### Reading

No permitir:

```
reading_value < 0
```

---

### Receipt

No permitir:

```
total_consumption <= 0
```

---

### Settlement

No permitir:

```
final_amount < 0
```

---

## 17. Decimal Precision

Valores monetarios:

```
NUMERIC(12,2)
```

---

Consumos:

```
NUMERIC(12,3)
```

---

Ejemplo:

```
total_amount NUMERIC(12,2)
reading_value NUMERIC(12,3)
```

---

## 18. Time Handling

Todas las fechas:

> UTC

Campos timestamp:

```
TIMESTAMP WITH TIME ZONE
```

---

## 19. Rollback Strategy

Flyway no realizará rollback automático.

Corrección:

> Nueva migración.

Ejemplo:

```
V011__fix_invalid_constraint.sql
```

---

## 20. Migration Acceptance Criteria

Base aceptada cuando:

- Todas las migraciones ejecutan.
- Relaciones correctas.
- Constraints aplicados.
- Datos iniciales cargados.
- Backend inicia correctamente.

---

## 21. Status

| Item | Status |
|---|---|
| Database Plan | ✓ |
| Migration Ready | Pending |
