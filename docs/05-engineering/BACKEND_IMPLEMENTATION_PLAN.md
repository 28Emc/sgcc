# SGCC Backend Implementation Plan

## Document Information

| Attribute | Value |
|---|---|
| Product | SGCC |
| Full Name | Sistema de Gestión de Cobros y Consumos de Recibos |
| Document Type | Backend Implementation Plan |
| Version | 1.0 |
| Status | Draft |
| Based On | Cloud Lab v1.0 |
| Backend Stack | Java 21 + Spring Boot 3 |
| Architecture | Clean Architecture + DDD |
| Last Updated | 2026-07-21 |

---

## 1. Purpose

Este documento define el plan técnico para implementar el backend de SGCC.

El objetivo es permitir que un desarrollador o agente IA pueda construir el backend respetando:

- Arquitectura definida.
- Módulos del dominio.
- Convenciones de código.
- Reglas de negocio.
- Estándares Cloud Lab.

---

## 2. Backend Application Definition

SGCC backend será:

- Spring Boot Application
- Modular Monolith
- Clean Architecture
- DDD

---

## 3. Initial Project Configuration

### Project

Nombre:

```
sgcc-backend
```

---

### Group

```
com.sgcc
```

---

### Artifact

```
sgcc-api
```

---

### Java Version

```
21
```

---

### Build Tool

```
Gradle
```

---

## 4. Required Dependencies

Dependencias principales:

### Spring Boot

```
spring-boot-starter-web
```

Uso:

- REST API.
- Controllers.
- JSON processing.

---

### Validation

```
spring-boot-starter-validation
```

---

### Persistence

```
spring-boot-starter-data-jpa
```

---

### Database

```
postgresql-driver
```

---

### Migration

```
flyway-core
```

---

### Documentation

```
springdoc-openapi
```

---

### Security

```
spring-boot-starter-security
```

---

### Testing

```
spring-boot-starter-test
testcontainers
```

---

## 5. Package Structure

La estructura raíz será:

```
com.sgcc
├── shared
├── identity
├── property
├── tenant
├── service
├── meter
├── reading
├── receipt
├── settlement
└── reporting
```

---

## 6. Module Template

Cada módulo debe seguir:

```
module/
├── domain/
│   ├── model/
│   ├── valueobject/
│   ├── service/
│   └── exception/
├── application/
│   ├── usecase/
│   ├── command/
│   ├── query/
│   └── dto/
├── infrastructure/
│   ├── persistence/
│   ├── mapper/
│   └── configuration/
└── presentation/
    ├── controller/
    ├── request/
    └── response/
```

---

## 7. Implementation Order

El backend será implementado siguiendo dependencia de dominio.

Orden:

```
Shared Kernel
      ↓
Property Module
      ↓
Tenant Module
      ↓
Service Module
      ↓
Meter Module
      ↓
Reading Module
      ↓
Receipt Module
      ↓
Settlement Module
      ↓
Reporting Module
```

---

## 8. First Domain Implementation

### Shared Kernel

Crear:

- `BaseEntity`
- `DomainException`
- `Identifier`
- `Money`
- `Period`

---

## 9. Property Module

Responsabilidad:

> Administrar propiedades y unidades.

Entidades:

- `Property`
- `Unit`

---

Casos de uso:

- `CreateProperty`
- `UpdateProperty`
- `CreateUnit`
- `ListProperties`

---

## 10. Tenant Module

Entidades:

- `Tenant`
- `Occupancy`

---

Casos de uso:

- `CreateTenant`
- `AssignTenantToUnit`
- `CloseOccupancy`

---

## 11. Service Module

Entidad:

- `Service`

---

Casos de uso:

- `CreateService`
- `ListServices`

---

## 12. Meter Module

Entidad:

- `Meter`

---

Casos de uso:

- `RegisterMeter`
- `AssignMeterToUnit`

---

## 13. Reading Module

Entidad:

- `Reading`

---

Regla crítica:

```
consumption = currentReading - previousReading
```

---

Caso de uso:

- `RegisterReading`

---

Validaciones:

No permitir:

```
current < previous
```

---

## 14. Receipt Module

Entidad:

- `Receipt`

---

Regla crítica:

```
unitValue = receiptAmount / receiptConsumption
```

---

Caso de uso:

- `RegisterReceipt`

---

Validaciones:

No permitir:

```
consumption = 0
```

---

## 15. Settlement Module

> Módulo principal.

Entidad:

- `Settlement`

---

Casos de uso:

- `GenerateSettlement`
- `ApplyAdjustment`
- `ListSettlements`

---

Regla principal:

```
tenantAmount = consumption × unitValue
```

---

Con ajuste:

```
finalAmount = tenantAmount + adjustment
```

---

## 16. Persistence Strategy

Regla:

> El dominio no conoce JPA.

Flujo:

```
Domain Repository Interface
         ↓
Repository Adapter
         ↓
Spring Data JPA
```

---

## 17. Testing Requirements

Cada módulo debe incluir:

- domain tests
- application tests
- integration tests

---

Prioridad:

| Module | Coverage |
|---|---|
| Settlement | 100% |
| Reading | 100% |
| Receipt | 100% |

---

## 18. Initial Deliverable

El primer entregable backend debe contener:

- Spring Boot project
- Database connection
- Flyway configured
- Swagger configured
- Health endpoint
- First domain module

---

## 19. Backend Completion Criteria

El backend inicial será aceptado cuando:

- Compile correctamente.
- Ejecute tests.
- Levante con Docker.
- Exponga API documentada.
- Respete arquitectura definida.

---

## 20. Status

| Item | Status |
|---|---|
| Backend Plan | ✓ |
| Implementation Ready | Pending |
