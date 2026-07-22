# SGCC System Architecture

## Document Information

| Attribute | Value |
|---|---|
| Product | SGCC |
| Full Name | Sistema de Gestión de Cobros y Consumos de Recibos |
| Document Type | System Architecture |
| Version | 1.0 |
| Status | Draft |
| Based On | Cloud Lab v1.0 |
| Last Updated | 2026-07-21 |

---

# 1. Purpose

Este documento define la arquitectura general de SGCC.

Su objetivo es establecer los principios técnicos, componentes principales y límites del sistema antes de iniciar la implementación.

La arquitectura debe permitir:

- Evolución progresiva.
- Mantenimiento sencillo.
- Separación clara de responsabilidades.
- Escalabilidad futura.
- Alineación con Cloud Lab v1.0.

---

# 2. Architecture Principles

SGCC seguirá los siguientes principios:

## 2.1 Simplicidad primero

La arquitectura inicial debe resolver el problema actual sin introducir complejidad innecesaria.

## 2.2 Modularidad

El sistema estará organizado por módulos de negocio independientes.

## 2.3 Clean Architecture

Las reglas del negocio no dependerán de frameworks ni infraestructura.

La dependencia debe fluir hacia el dominio.

## 2.4 Domain Driven Design

La estructura del sistema estará alineada con el lenguaje y conceptos del negocio.

## 2.5 Evolution Ready

La arquitectura debe permitir una futura separación en servicios independientes si el producto lo requiere.

---

# 3. Architectural Style

SGCC utilizará: **Modular Monolith** como arquitectura inicial.

---

# 4. Why Modular Monolith?

La versión inicial de SGCC:

- Tiene un dominio acotado.
- Tiene pocos usuarios.
- No requiere despliegues independientes.
- Prioriza velocidad de desarrollo.

Un enfoque de microservicios desde el inicio agregaría complejidad innecesaria:

- Infraestructura adicional.
- Comunicación distribuida.
- Mayor costo operativo.
- Mayor dificultad de desarrollo.

---

# 5. High Level Architecture

Vista general:

```text
            User
             │
             │
      Angular Frontend
             │
             │
          REST API
             │
             │
    Spring Boot Application
             │
 ─────────────────────────────
 │            │              │
Identity    Domain    Infrastructure
 │            │              │
 ─────────────────────────────
             │
             │
        Database
       PostgreSQL
```

---

# 6. Main Components

## Frontend Application

Responsabilidad: Proporcionar interfaz de usuario para:

- Administración.
- Registro de datos.
- Consulta de consumos.
- Visualización de liquidaciones.

Tecnología: Angular.

## Backend Application

Responsabilidad: Gestionar:

- Reglas de negocio.
- Seguridad.
- Persistencia.
- APIs.

Tecnología: Spring Boot.

## Database

Responsabilidad: Persistir:

- Configuración.
- Datos operativos.
- Históricos.
- Liquidaciones.

Tecnología: PostgreSQL.

---

# 7. Backend Architecture

El backend seguirá Clean Architecture:

```text
backend/
├── domain/
├── application/
├── infrastructure/
└── presentation/
```

## Domain Layer

Contiene:

- Entidades.
- Value Objects.
- Reglas de negocio.
- Servicios de dominio.

No depende de:

- Spring.
- JPA.
- Base de datos.

## Application Layer

Contiene:

- Casos de uso.
- Orquestación.
- DTOs internos.
- Puertos.

Ejemplos:

- CalculateSettlementUseCase
- RegisterReadingUseCase

## Infrastructure Layer

Contiene:

- Persistencia.
- Implementaciones externas.
- Configuración técnica.

Ejemplos:

- JPA Repository
- Database Adapter

## Presentation Layer

Contiene:

- Controllers.
- REST API.
- Validaciones de entrada.

---

# 8. Frontend Architecture

Angular seguirá: Clean Architecture + Feature Modules

Estructura conceptual:

```text
frontend/
├── core/
├── shared/
├── features/
├── layouts/
└── infrastructure/
```

---

# 9. Data Flow Example

Caso: Generar liquidación.

```text
User
  ↓
Angular
  ↓
Settlement API
  ↓
Generate Settlement Use Case
  ↓
Domain Calculation
  ↓
Persistence
  ↓
Database
  ↓
Response
```

---

# 10. Security Approach

Versión inicial:

- Autenticación basada en usuario.
- Autorización por roles.
- Protección de endpoints.
- Auditoría básica.

No incluye inicialmente:

- OAuth externo.
- SSO.
- Integraciones corporativas.

---

# 11. Deployment Model

Inicialmente:

```text
Docker Containers
    │
Application Server
    │
PostgreSQL
```

Preparado para:

- Cloud deployment.
- CI/CD.
- Environments separados.

---

# 12. Future Evolution

La arquitectura permitirá evolucionar hacia:

```text
Modular Monolith
    ↓
Service Extraction
    ↓
Microservices
```

Posibles candidatos futuros:

- Notification Service.
- Document Service.
- Payment Service.
- Analytics Service.

---

# 13. Architectural Constraints

SGCC debe mantener:

- Dominio independiente.
- Módulos desacoplados.
- Código testeable.
- Documentación sincronizada.
- Decisiones justificadas.

---

# 14. Current Status

| Milestone | Status |
|---|---|
| Product Definition | ✓ |
| Domain Definition | ✓ |
| Architecture Design | ✓ |
| Implementation | Pending |
