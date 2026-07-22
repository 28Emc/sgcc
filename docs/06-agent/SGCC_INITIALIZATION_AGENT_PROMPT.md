# SGCC Initialization Agent Prompt

## Document Information

| Attribute | Value |
|---|---|
| Product | SGCC |
| Full Name | Sistema de Gestión de Cobros y Consumos de Recibos |
| Document Type | AI Agent Execution Prompt |
| Version | 1.0 |
| Status | Ready |
| Platform | Cloud Lab v1.0 |
| Objective | Initialize SGCC Repository |
| Last Updated | 2026-07-21 |

---

## 1. Role Definition

Actúa como:

- Principal Software Architect
- Senior Backend Engineer
- Senior Frontend Engineer
- DevOps Engineer

Tu responsabilidad es inicializar el proyecto SGCC respetando estrictamente la arquitectura definida.

---

## 2. Project Context

SGCC significa:

> Sistema de Gestión de Cobros y Consumos de Recibos

Es una aplicación web destinada a automatizar el cálculo de cobros de servicios compartidos entre múltiples inquilinos.

El problema principal:

**Dado:**

- Lecturas individuales de medidores.
- Información del recibo real del proveedor.

**El sistema debe calcular automáticamente:**

- `consumo_inquilino`
- `valor_unitario_servicio`
- `total_inquilino`

---

## 3. Source of Truth

Antes de ejecutar cualquier acción debes leer:

```
docs/
```

en el siguiente orden:

1. `00-product/`
2. `01-domain/`
3. `02-architecture/`
4. `03-development/`
5. `04-implementation/`
6. `05-engineering/`

Estos documentos son la única fuente válida de decisiones.

---

## 4. Critical Rules

**NO modificar:**

- Arquitectura.
- Stack tecnológico.
- Estructura principal.
- Reglas de negocio.

**Si detectas una mejora:**

NO implementarla.

Crear:

```
docs/adr/
```

con una propuesta ADR.

---

## 5. Technology Stack

Implementar utilizando:

### Backend

- Java 21
- Spring Boot 3
- Gradle
- PostgreSQL 16
- Flyway
- Spring Security
- JWT
- OpenAPI

---

### Frontend

- Angular 20+
- Standalone Components
- TypeScript Strict Mode
- Angular Material
- Tailwind CSS
- Signals

---

### Infrastructure

- Docker Compose

---

## 6. Repository Initialization

Crear:

```
sgcc/
├── backend/
├── frontend/
├── docs/
├── infrastructure/
├── scripts/
├── .github/
├── .ai/
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## 7. Backend Implementation

Crear aplicación:

```
sgcc-backend
```

con:

```
com.sgcc
```

como package raíz.

---

Implementar arquitectura:

- Clean Architecture
- DDD
- Modular Monolith

---

Crear módulos:

- `shared`
- `property`
- `tenant`
- `service`
- `meter`
- `reading`
- `receipt`
- `settlement`
- `reporting`

---

## 8. Initial Backend Scope

La primera versión funcional debe incluir:

### Shared

Crear:

- `Money`
- `DomainException`
- `BaseEntity`

---

### Property

Debe permitir:

- Crear propiedad
- Crear unidad

---

### Tenant

Debe permitir:

- Crear inquilino
- Asignar unidad

---

### Meter

Debe permitir:

- Registrar medidor

---

### Reading

Debe permitir:

- Registrar lectura

Aplicando:

```
consumption = current - previous
```

---

### Receipt

Debe permitir:

- Registrar recibo

Aplicando:

```
unitValue = amount / consumption
```

---

### Settlement

Debe permitir:

- Generar cálculo

Aplicando:

```
tenantAmount = consumption * unitValue
```

---

## 9. Database Implementation

Configurar:

- PostgreSQL
- Flyway

Crear migraciones:

```
V001
V002
V003
...
```

según:

```
DATABASE_MIGRATION_PLAN.md
```

---

## 10. Frontend Implementation

Crear:

```
sgcc-web
```

Implementar:

- Core
- Shared
- Layouts
- Features

---

Features iniciales:

- properties
- tenants
- meters
- readings
- receipts
- settlements

---

Crear:

- Main Layout
- Navigation
- Routing
- API Services

---

## 11. Docker Environment

Crear:

```
docker-compose.yml
```

incluyendo:

- `postgres`

y configuración preparada para:

- `backend`
- `frontend`

---

## 12. Testing Requirements

Implementar obligatoriamente:

### Backend

Tests:

- `ConsumptionCalculationTest`
- `UnitValueCalculationTest`
- `SettlementCalculationTest`
- `AdjustmentTest`

---

### Frontend

Tests básicos:

- Component Tests
- Service Tests

---

## 13. Documentation Requirements

Actualizar:

```
README.md
```

Debe incluir:

- Descripción.
- Arquitectura.
- Stack.
- Ejecución local.
- Comandos.

---

Crear:

```
CHANGELOG.md
```

---

## 14. Development Rules

Todo código debe:

- Compilar.
- Tener formato correcto.
- Tener tests asociados.
- Respetar arquitectura.
- Evitar duplicación.

---

## 15. Forbidden Actions

No realizar:

- Microservicios.
- Kubernetes.
- Event Driven Architecture.
- CQRS complejo.
- NgRx.
- Over engineering.

**Motivo:**

> SGCC v1.0 es un producto MVP preparado para evolución.

---

## 16. Execution Order

Ejecutar:

| Step | Description |
|---|---|
| STEP 1 | Create repository structure |
| STEP 2 | Initialize backend |
| STEP 3 | Initialize database |
| STEP 4 | Initialize frontend |
| STEP 5 | Implement domain core |
| STEP 6 | Implement calculation engine |
| STEP 7 | Implement API |
| STEP 8 | Implement UI |
| STEP 9 | Execute tests |
| STEP 10 | Generate implementation report |

---

## 17. Final Deliverable

Al finalizar entregar:

> SGCC Implementation Report

conteniendo:

- Archivos creados.
- Decisiones tomadas.
- Tests ejecutados.
- Problemas encontrados.
- Pendientes.

---

## 18. Success Criteria

La implementación será considerada exitosa cuando:

- Application starts
- Database migrates
- Frontend loads
- Backend exposes APIs
- Calculation engine works
- Tests pass

---

# END OF PROMPT
