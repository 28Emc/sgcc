# SGCC Development Milestones

## Document Information

| Attribute | Value |
|---|---|
| Product | SGCC |
| Full Name | Sistema de Gestión de Cobros y Consumos de Recibos |
| Document Type | Development Milestones |
| Version | 1.0 |
| Status | Draft |
| Based On | Cloud Lab v1.0 |
| Last Updated | 2026-07-21 |

---

# 1. Purpose

Este documento define los principales hitos de desarrollo de SGCC.

Cada milestone representa un estado verificable del producto.

Los milestones permiten:

- Medir progreso real.
- Validar decisiones técnicas.
- Evitar desarrollo desordenado.
- Mantener trazabilidad.

---

# 2. Development Lifecycle

SGCC seguirá este ciclo:

```text
Planning
    ↓
  Design
    ↓
Implementation
    ↓
 Validation
    ↓
  Release
```

---

# 3. Milestone Overview

| ID | Milestone | Objective | Status |
|---|---|---|---|
| M0 | Project Initialization | Crear base técnica | Pending |
| M1 | Domain Foundation | Implementar dominio base | Pending |
| M2 | Resource Management | Gestionar entidades principales | Pending |
| M3 | Consumption Tracking | Registrar consumos | Pending |
| M4 | Settlement Engine | Calcular cobros | Pending |
| M5 | MVP Release Candidate | Producto completo | Pending |
| M6 | Production Release | SGCC v1.0 | Pending |

---

# M0 — Project Initialization

## Objective

Crear la base del proyecto siguiendo Cloud Lab v1.0.

## Scope

Incluye:

- Crear repositorio Git.
- Configurar estructura inicial.
- Configurar backend.
- Configurar frontend.
- Configurar base de datos.
- Configurar Docker.
- Configurar CI inicial.

## Deliverables

- Repository
- Backend Skeleton
- Frontend Skeleton
- Docker Environment
- Documentation

## Completion Criteria

El equipo puede ejecutar:

```text
clone repository
    ↓
start environment
    ↓
run application
```

---

# M1 — Domain Foundation

## Objective

Implementar la base del dominio.

## Scope

Incluye:

- Entidades principales.
- Value Objects.
- Reglas de dominio.
- Casos de uso iniciales.

## Domain Included

- Property
- Unit
- Tenant
- Service

## Deliverables

- Modelo de dominio implementado.
- Tests unitarios del dominio.
- Validaciones principales.

## Completion Criteria

El sistema puede crear y gestionar la estructura básica.

---

# M2 — Resource Management

## Objective

Completar la administración de recursos.

## Scope

Incluye:

- Meter
- Provider
- Receipt

## Capabilities

El usuario puede:

- Crear servicios.
- Registrar proveedores.
- Asociar medidores.
- Registrar recibos.

## Completion Criteria

El sistema conoce:

```text
Quién consume
Qué consume
Qué servicio utiliza
```

---

# M3 — Consumption Tracking

## Objective

Registrar y calcular consumos.

## Scope

Incluye:

- Lecturas.
- Históricos.
- Cálculo de consumo.

## Core Rule

Implementar:

```text
consumption = current_reading - previous_reading
```

## Deliverables

- Registro de lecturas.
- Validaciones.
- Historial.

## Completion Criteria

SGCC puede determinar consumo individual.

---

# M4 — Settlement Engine

## Objective

Implementar el núcleo del producto.

## Scope

Incluye:

- Cálculo de valor unitario.
- Generación de liquidaciones.
- Ajustes manuales.

## Core Rules

Implementar:

```text
unit_value = receipt_amount / receipt_consumption
```

y:

```text
tenant_total = consumption × unit_value
```

## Deliverables

- Settlement Aggregate.
- Calculation Service.
- Adjustment handling.

## Completion Criteria

El sistema reemplaza el Excel actual.

---

# M5 — MVP Release Candidate

## Objective

Preparar la primera versión funcional completa.

## Scope

Incluye:

- Backend completo.
- Frontend funcional.
- Seguridad básica.
- Reportes iniciales.
- Pruebas integradas.

## Validation Flow

Caso real:

```text
Create Property
    ↓
Register Rooms
    ↓
Assign Tenants
    ↓
Register Receipt
    ↓
Enter Readings
    ↓
Generate Totals
    ↓
Review Results
```

## Completion Criteria

Un usuario real puede gestionar un ciclo mensual completo.

---

# M6 — Production Release SGCC v1.0

## Objective

Liberar la primera versión estable.

## Requirements

Debe cumplir:

### Functional

- Todas las funcionalidades MVP operativas.

### Technical

- Código estable.
- Tests suficientes.
- Documentación actualizada.

### Operational

- Backup configurado.
- Variables de entorno separadas.
- Deployment reproducible.

## Release Criteria

SGCC v1.0 será certificado cuando:

```text
Producto validado
Arquitectura validada
Documentación completa
Proceso reproducible
```

---

# 4. Recommended Sprint Planning

## Sprint 0

Duración estimada: 1 semana.

Objetivo: Preparación técnica.

## Sprint 1

Objetivo: Property + Tenant.

## Sprint 2

Objetivo: Services + Meter.

## Sprint 3

Objetivo: Reading + Receipt.

## Sprint 4

Objetivo: Settlement Engine.

## Sprint 5

Objetivo: MVP Stabilization.

---

# 5. Quality Gates

Cada milestone debe pasar:

## Architecture Gate

Validar:

- Estructura.
- Dependencias.
- Convenciones.

## Domain Gate

Validar:

- Reglas de negocio.
- Casos de uso.

## Technical Gate

Validar:

- Tests.
- Calidad.
- Seguridad.

## Documentation Gate

Validar:

- Documentos actualizados.
- Decisiones registradas.

---

# 6. Current Status

| Milestone | Status |
|---|---|
| Product Definition | ✓ |
| Domain Definition | ✓ |
| Architecture Definition | ✓ |
| Development Planning | ✓ |
| Implementation | Pending |
