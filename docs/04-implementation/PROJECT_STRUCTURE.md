# SGCC Project Structure

## Document Information

| Attribute | Value |
|---|---|
| Product | SGCC |
| Full Name | Sistema de Gestión de Cobros y Consumos de Recibos |
| Document Type | Project Structure Definition |
| Version | 1.0 |
| Status | Draft |
| Based On | Cloud Lab v1.0 |
| Last Updated | 2026-07-21 |

---

# 1. Purpose

Este documento define la estructura oficial del repositorio SGCC.

El objetivo es mantener una organización consistente entre:

- Código fuente.
- Documentación.
- Infraestructura.
- Automatización.
- Configuración.

La estructura debe facilitar:

- Desarrollo local.
- Mantenimiento.
- Escalabilidad.
- Integración con Cloud Lab.

---

# 2. Repository Structure

La estructura inicial será:

```text
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

# 3. Repository Responsibilities

## backend/

Contiene la aplicación backend Spring Boot.

Responsabilidades:

- API REST.
- Casos de uso.
- Dominio.
- Persistencia.
- Seguridad.

Estructura interna:

```text
backend/
└── src/
    └── main/
        └── java/
            └── com.sgcc/
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

Cada módulo seguirá:

```text
module/
├── domain/
├── application/
├── infrastructure/
└── presentation/
```

Ejemplo:

```text
settlement/
├── domain/
│   ├── Settlement.java
│   ├── Adjustment.java
│   └── SettlementRule.java
├── application/
│   └── CalculateSettlementUseCase.java
├── infrastructure/
│   └── SettlementRepositoryAdapter.java
└── presentation/
    └── SettlementController.java
```

## frontend/

Contiene aplicación Angular.

Estructura:

```text
frontend/
└── src/
    └── app/
        ├── core/
        ├── shared/
        ├── layouts/
        └── features/
```

Features:

```text
features/
├── properties/
├── tenants/
├── services/
├── meters/
├── readings/
├── receipts/
├── settlements/
└── reports/
```

Cada feature seguirá:

```text
feature/
├── pages/
├── components/
├── services/
├── models/
├── state/
└── routes.ts
```

## docs/

Contiene documentación oficial del proyecto.

Estructura:

```text
docs/
├── 00-product/
├── 01-domain/
├── 02-architecture/
├── 03-development/
└── 04-implementation/
```

## infrastructure/

Contiene infraestructura técnica.

Ejemplo:

```text
infrastructure/
├── docker/
├── database/
├── deployment/
└── monitoring/
```

## scripts/

Automatizaciones locales.

Ejemplo:

```text
scripts/
├── setup.sh
├── database-reset.sh
└── build-all.sh
```

## .github/

Automatización CI/CD.

Estructura:

```text
.github/
└── workflows/
    ├── backend.yml
    ├── frontend.yml
    └── quality.yml
```

## .ai/

Integración con workflows de IA definidos en Cloud Lab.

Estructura inicial:

```text
.ai/
├── context/
├── prompts/
└── procedures/
```

---

# 4. Environment Separation

Los ambientes serán:

- local
- development
- staging
- production

Cada ambiente tendrá configuración independiente.

Ejemplo:

```text
application-local.yml
application-dev.yml
application-prod.yml
```

---

# 5. Naming Conventions

## Java

Clases: `PascalCase`

Ejemplo: `SettlementService`

Métodos: `camelCase`

Ejemplo: `calculateSettlement()`

## Angular

Componentes: `kebab-case`

Ejemplo: `settlement-detail.component.ts`

## Database

Tablas: `snake_case`

Ejemplo: `settlements`

Columnas: `snake_case`

Ejemplo: `created_at`

---

# 6. Configuration Rules

No se permitirá:

- Secretos en código.
- Credenciales versionadas.
- Variables hardcodeadas.

Configuración mediante: Environment Variables

---

# 7. Documentation Rules

Cada cambio importante debe actualizar:

- Documentación relacionada.
- ADR si aplica.
- Changelog.

---

# 8. Repository Quality Rules

Todo cambio debe cumplir:

- Código compilable.
- Tests ejecutados.
- Documentación actualizada.
- Revisión técnica.

---

# 9. Initial Repository State

El primer commit deberá contener:

```text
README.md
docs/
backend/
frontend/
docker-compose.yml
.github/
```

---

# 10. Status

| Milestone | Status |
|---|---|
| Repository Definition | ✓ |
| Implementation Ready | ✓ |
| Development Started | Pending |
