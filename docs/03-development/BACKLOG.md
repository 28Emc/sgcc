# SGCC Development Backlog

## Document Information

| Attribute | Value |
|---|---|
| Product | SGCC |
| Full Name | Sistema de Gestión de Cobros y Consumos de Recibos |
| Document Type | Product Backlog |
| Version | 1.0 |
| Status | Draft |
| Based On | Cloud Lab v1.0 |
| Last Updated | 2026-07-21 |

---

# 1. Purpose

Este documento define el backlog inicial de desarrollo de SGCC.

El backlog traduce:

- Visión del producto.
- Modelo de dominio.
- Reglas de negocio.
- Arquitectura.

en unidades de trabajo implementables.

---

# 2. Development Strategy

SGCC será desarrollado mediante entregas incrementales.

La estrategia será:

```text
Foundation
    ↓
Core Domain
    ↓
Operational MVP
    ↓
Product Improvements
```

---

# 3. MVP Definition

El MVP de SGCC debe permitir reemplazar completamente el proceso actual realizado mediante Excel.

El flujo principal:

```text
Create Property
    ↓
Create Rooms
    ↓
Register Tenants
    ↓
Register Services
    ↓
Register Receipt
    ↓
Register Readings
    ↓
Calculate Consumption
    ↓
Generate Total
    ↓
Communicate Amount
```

---

# 4. Epic Overview

| ID | Epic | Priority |
|---|---|---|
| EPIC-01 | Project Foundation | Critical |
| EPIC-02 | Identity Management | High |
| EPIC-03 | Property Management | Critical |
| EPIC-04 | Tenant Management | Critical |
| EPIC-05 | Service Management | Critical |
| EPIC-06 | Meter Management | High |
| EPIC-07 | Reading Management | Critical |
| EPIC-08 | Receipt Management | Critical |
| EPIC-09 | Settlement Engine | Critical |
| EPIC-10 | Reporting | Medium |

---

# EPIC-01 — Project Foundation

## Objective

Preparar la base técnica del proyecto.

## User Stories

### US-001

Como desarrollador quiero tener el proyecto configurado para poder iniciar implementación.

Acceptance Criteria:

- Repositorio creado.
- Backend inicializado.
- Frontend inicializado.
- Docker configurado.
- Documentación conectada.

### US-002

Como equipo quiero una estructura alineada a Cloud Lab.

Acceptance Criteria:

- Arquitectura definida.
- Convenciones aplicadas.
- Código organizado por módulos.

---

# EPIC-02 — Identity Management

## Objective

Permitir acceso seguro al sistema.

## User Stories

### US-010

Como administrador quiero iniciar sesión.

Acceptance Criteria:

- Usuario válido puede autenticarse.
- Usuario inválido recibe error.

### US-011

Como sistema quiero controlar permisos.

Acceptance Criteria:

- Roles definidos.
- Endpoints protegidos.

---

# EPIC-03 — Property Management

## Objective

Administrar propiedades.

## User Stories

### US-020

Como usuario quiero registrar una propiedad.

Acceptance Criteria:

- Nombre requerido.
- Dirección registrada.
- Estado inicial definido.

### US-021

Como usuario quiero consultar propiedades.

Acceptance Criteria:

- Lista disponible.
- Información básica visible.

---

# EPIC-04 — Tenant Management

## Objective

Gestionar ocupantes.

## User Stories

### US-030

Como usuario quiero registrar un inquilino.

Acceptance Criteria:

- Datos básicos almacenados.
- Estado definido.

### US-031

Como usuario quiero asociar un inquilino a una habitación.

Acceptance Criteria:

- Ocupación registrada.
- Periodo definido.

---

# EPIC-05 — Service Management

## Objective

Gestionar servicios.

## User Stories

### US-040

Como usuario quiero registrar servicios.

Ejemplos:

- Luz.
- Agua.
- Gas.

Acceptance Criteria:

- Servicio creado.
- Unidad de medida definida.

---

# EPIC-06 — Meter Management

## Objective

Gestionar medidores.

## User Stories

### US-050

Como usuario quiero registrar un medidor.

Acceptance Criteria:

- Código registrado.
- Servicio asociado.
- Habitación asociada.

---

# EPIC-07 — Reading Management

## Objective

Registrar consumos individuales.

## User Stories

### US-060

Como usuario quiero registrar una lectura.

Acceptance Criteria:

- Lectura anterior identificada.
- Lectura actual almacenada.
- Consumo calculado.

### US-061

Como usuario quiero consultar historial de lecturas.

Acceptance Criteria:

- Lecturas ordenadas.
- Periodos visibles.

---

# EPIC-08 — Receipt Management

## Objective

Registrar recibos del proveedor.

## User Stories

### US-070

Como usuario quiero registrar un recibo.

Acceptance Criteria:

- Servicio seleccionado.
- Periodo registrado.
- Importe registrado.
- Consumo total registrado.

### US-071

Como sistema quiero calcular valor unitario.

Acceptance Criteria:

```text
importe / consumo = calculado correctamente
```

---

# EPIC-09 — Settlement Engine

## Objective

Generar los montos a cobrar. Este es el núcleo del sistema.

## User Stories

### US-080

Como usuario quiero generar totalizados.

Acceptance Criteria:

El sistema calcula:

```text
consumption × unit_value
```

### US-081

Como usuario quiero aplicar ajustes.

Acceptance Criteria:

Debe conservar:

```text
Monto calculado
+ Ajuste
=
Monto final
```

### US-082

Como usuario quiero consultar liquidaciones históricas.

Acceptance Criteria:

- Periodo visible.
- Servicio visible.
- Monto visible.

---

# EPIC-10 — Reporting

## Objective

Consultar información del sistema.

## User Stories

### US-090

Como usuario quiero visualizar resumen mensual.

Acceptance Criteria:

Mostrar:

- Servicios.
- Consumos.
- Totalizados.

---

# 5. MVP Sprint Order

Orden recomendado:

```text
Sprint 0 → Foundation
    ↓
Sprint 1 → Property + Tenant
    ↓
Sprint 2 → Services + Meters
    ↓
Sprint 3 → Readings + Receipts
    ↓
Sprint 4 → Settlement Engine
    ↓
Sprint 5 → Reports + Stabilization
```

---

# 6. Definition of Done

Una historia está terminada cuando:

- Código implementado.
- Tests agregados.
- Documentación actualizada.
- Validaciones agregadas.
- Revisión realizada.
- Integración funcionando.

---

# 7. Future Backlog Candidates

Fuera del MVP:

- Portal del inquilino.
- Notificaciones.
- OCR.
- Adjuntar recibos.
- Pagos.
- Analytics.
- Aplicación móvil.

---

# 8. Current Status

| Milestone | Status |
|---|---|
| Backlog Defined | ✓ |
| Development Started | Pending |
