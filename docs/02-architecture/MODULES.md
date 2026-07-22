# SGCC Modules Definition

## Document Information

| Attribute | Value |
|---|---|
| Product | SGCC |
| Full Name | Sistema de Gestión de Cobros y Consumos de Recibos |
| Document Type | Module Definition |
| Version | 1.0 |
| Status | Draft |
| Based On | Cloud Lab v1.0 |
| Last Updated | 2026-07-21 |

---

# 1. Purpose

Este documento define los módulos funcionales y técnicos que conforman SGCC.

La definición de módulos busca:

- Mantener separación de responsabilidades.
- Facilitar mantenimiento.
- Alinear código con dominio.
- Preparar evolución futura.

Los módulos representan capacidades del negocio, no solamente agrupaciones técnicas.

---

# 2. Module Architecture

SGCC utilizará una arquitectura modular:

```text
SGCC Application
│
├── Identity
├── Property Management
├── Tenant Management
├── Service Management
├── Meter Management
├── Reading Management
├── Receipt Management
├── Settlement Management
├── Reporting
└── Shared Kernel
```

---

# 3. Module Overview

| Module | Responsibility |
|---|---|
| Identity | Usuarios y acceso al sistema |
| Property Management | Administración de propiedades |
| Tenant Management | Administración de inquilinos |
| Service Management | Servicios consumidos |
| Meter Management | Administración de medidores |
| Reading Management | Registro de lecturas |
| Receipt Management | Registro de recibos |
| Settlement Management | Cálculo y generación de liquidaciones |
| Reporting | Consultas y reportes |
| Shared Kernel | Componentes compartidos |

---

# 4. Identity Module

## Purpose

Gestionar usuarios que utilizan SGCC.

## Responsibilities

Incluye:

- Registro de usuarios.
- Autenticación.
- Autorización.
- Roles.

## Main Concepts

- User
- Role
- Permission

## Future Extensions

- Multiusuario avanzado.
- Invitaciones.
- Auditoría completa.

---

# 5. Property Management Module

## Purpose

Administrar propiedades donde se realiza la distribución de consumos.

## Responsibilities

Permite:

- Crear propiedades.
- Actualizar información.
- Consultar propiedades.
- Asociar unidades.

## Main Concepts

- Property
- Address
- Unit

## Business Rules

- Una propiedad puede tener múltiples unidades.
- Una unidad pertenece únicamente a una propiedad.

---

# 6. Tenant Management Module

## Purpose

Gestionar personas que ocupan unidades.

## Responsibilities

Permite:

- Registrar inquilinos.
- Asociar ocupaciones.
- Mantener historial.

## Main Concepts

- Tenant
- Occupancy

## Business Rules

- Un tenant puede ocupar una unidad durante un periodo.
- Una unidad puede cambiar de tenant con el tiempo.

---

# 7. Service Management Module

## Purpose

Administrar servicios cuyo costo será distribuido.

## Responsibilities

Permite:

- Crear servicios.
- Configurar unidades de medida.
- Asociar proveedores.

## Main Concepts

- Service
- Provider

## Examples

```text
Electricidad → kWh
Agua → m3
```

---

# 8. Meter Management Module

## Purpose

Gestionar dispositivos de medición.

## Responsibilities

Permite:

- Registrar medidores.
- Asociarlos a unidades.
- Asociarlos a servicios.

## Main Concepts

- Meter

## Business Rules

- Un medidor pertenece a una unidad.
- Un medidor mide un servicio específico.

---

# 9. Reading Management Module

## Purpose

Gestionar lecturas realizadas a medidores.

## Responsibilities

Permite:

- Registrar lecturas.
- Consultar históricos.
- Calcular consumo.

## Main Concepts

- Reading
- Consumption

## Business Rules

```text
Consumption = Current Reading - Previous Reading
```

---

# 10. Receipt Management Module

## Purpose

Registrar los recibos emitidos por proveedores.

## Responsibilities

Permite:

- Registrar recibos.
- Asociar servicios.
- Registrar consumo total.
- Registrar importe total.

## Main Concepts

- Receipt

## Business Rules

El recibo determina:

```text
Unit Value = Receipt Amount / Receipt Consumption
```

---

# 11. Settlement Management Module

## Purpose

Módulo principal del dominio. Responsable de generar los montos individuales a cobrar.

## Responsibilities

Permite:

- Calcular liquidaciones.
- Aplicar ajustes.
- Mantener históricos.

## Main Concepts

- Settlement
- Calculated Amount
- Adjustment
- Final Amount

## Business Rules

Formula principal:

```text
Final Amount = Consumption × Unit Value + Adjustment
```

---

# 12. Reporting Module

## Purpose

Proporcionar información de consulta.

## Responsibilities

Inicialmente:

- Historial de consumos.
- Historial de liquidaciones.
- Resumen por periodo.

## Future Extensions

- Dashboard avanzado.
- Estadísticas.
- Tendencias.

---

# 13. Shared Kernel Module

## Purpose

Contiene componentes utilizados por múltiples módulos.

## Examples

- Base Entity
- Audit Information
- Common Exceptions
- Utilities
- Date Handling

---

# 14. Module Dependencies

Dependencias permitidas:

```text
Identity
    │
    ▼
Property Management
    │
    ├────────────────┐
    │                │
    ▼                ▼
  Tenant          Service
    │                │
    └───────┬────────┘
            │
            ▼
          Meter
            │
            ▼
        Reading
            │
            ▼
        Receipt
            │
            ▼
       Settlement
            │
            ▼
        Reporting
```

---

# 15. Backend Package Mapping

Ejemplo de organización:

```text
backend/src/main/java/com/sgcc
├── identity/
├── property/
├── tenant/
├── service/
├── meter/
├── reading/
├── receipt/
├── settlement/
├── reporting/
└── shared/
```

Cada módulo tendrá internamente:

```text
module/
├── domain/
├── application/
├── infrastructure/
└── presentation/
```

---

# 16. Frontend Feature Mapping

Ejemplo:

```text
frontend/src/app
├── features/
│   ├── properties/
│   ├── tenants/
│   ├── services/
│   ├── meters/
│   ├── readings/
│   ├── receipts/
│   ├── settlements/
│   └── reports/
├── core/
└── shared/
```

---

# 17. Future Module Candidates

Posibles módulos futuros:

- Notification
- Document Management
- Payment
- Analytics
- Integration

No forman parte de SGCC v1.0.

---

# 18. Status

| Milestone | Status |
|---|---|
| Domain Model | ✓ |
| Architecture Model | ✓ |
| Module Definition | ✓ |
| Implementation | Pending |
