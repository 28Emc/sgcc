# SGCC Technical Stack

## Document Information

| Attribute | Value |
|---|---|
| Product | SGCC |
| Full Name | Sistema de Gestión de Cobros y Consumos de Recibos |
| Document Type | Technical Stack Definition |
| Version | 1.0 |
| Status | Draft |
| Based On | Cloud Lab v1.0 |
| Last Updated | 2026-07-21 |

---

# 1. Purpose

Este documento define las tecnologías oficiales utilizadas para el desarrollo de SGCC.

Las decisiones tecnológicas buscan equilibrar:

- Productividad.
- Mantenibilidad.
- Comunidad.
- Estabilidad.
- Evolución futura.

---

# 2. Technology Principles

Las decisiones técnicas seguirán estos principios:

## 2.1 Tecnología madura

Priorizar tecnologías probadas en producción.

## 2.2 Productividad del equipo

Elegir herramientas que permitan desarrollar y mantener el producto eficientemente.

## 2.3 Bajo acoplamiento

Evitar depender excesivamente de herramientas específicas.

## 2.4 Evolución progresiva

La tecnología debe permitir crecimiento futuro sin migraciones innecesarias.

---

# 3. Backend Stack

## Programming Language

### Java

Version: Java 21 LTS

Justificación:

- Versión LTS.
- Soporte prolongado.
- Ecosistema empresarial.
- Excelente integración con Spring.

## Backend Framework

### Spring Boot

Version objetivo: Spring Boot 3.x

Responsabilidades:

- API REST.
- Configuración.
- Seguridad.
- Inyección de dependencias.
- Integraciones.

## Build Tool

Opciones permitidas:

- Gradle
- Maven

Decisión inicial: Gradle

Motivo:

- Mejor experiencia moderna.
- Flexibilidad.
- Buen soporte con Spring Boot.

## Persistence

### Spring Data JPA

Uso:

- Persistencia relacional.
- Repositorios.
- Mapeo ORM.

## Database Migration

Herramienta: Flyway

Responsabilidad:

- Control de versiones de esquema.
- Migraciones reproducibles.

## Validation

Tecnología: Jakarta Validation

Uso:

- Validaciones de entrada.
- Restricciones de dominio.

## API Documentation

Tecnología: OpenAPI 3 + Swagger UI

Uso:

- Documentación REST.
- Pruebas manuales.
- Contrato de API.

---

# 4. Frontend Stack

## Framework

### Angular

Versión objetivo: Angular 20+

Motivo:

- Standalone components.
- Arquitectura moderna.
- Ecosistema estable.

## Language

### TypeScript

Uso: Todo el frontend será desarrollado utilizando TypeScript.

## Styling

Tecnologías:

- Tailwind CSS
- Angular Material

Uso:

- Sistema visual.
- Componentes reutilizables.
- Diseño consistente.

## State Management

Versión inicial: Angular Signals

Evaluación futura: NgRx cuando exista suficiente complejidad.

---

# 5. Database Stack

## Database

### PostgreSQL

Versión objetivo: 16+

Motivos:

- Open source.
- Robustez.
- Excelente soporte relacional.
- Compatible con evolución futura.

## Database Design Principles

Se aplicará:

- Diseño relacional.
- Integridad referencial.
- Migraciones versionadas.
- Auditoría de cambios importantes.

---

# 6. Infrastructure Stack

## Containerization

Tecnología: Docker

Uso:

- Entornos locales.
- Desarrollo.
- Despliegue.

## Local Development

Servicios iniciales:

- Backend Container
- Frontend Container
- PostgreSQL Container

## Configuration Management

Principios:

- Variables de entorno.
- Separación por ambientes.
- Nunca almacenar secretos en código.

---

# 7. Testing Stack

## Backend Testing

Tecnologías:

- JUnit 5
- Mockito
- Spring Boot Test

## Integration Testing

Tecnologías: Testcontainers

Uso:

- Pruebas con PostgreSQL real.
- Validación de infraestructura.

## Frontend Testing

Tecnologías:

- Angular Testing Tools
- Jasmine/Karma (o alternativa moderna compatible)

---

# 8. Code Quality

Herramientas previstas:

- SonarQube
- Checkstyle
- Spotless

Objetivos:

- Calidad.
- Consistencia.
- Mantenibilidad.

---

# 9. Version Control

Sistema: Git

Repositorio: GitHub

## Branch Strategy

Modelo inicial:

```text
main
develop
feature/*
fix/*
```

---

# 10. CI/CD

Inicialmente: GitHub Actions

Procesos:

- Build.
- Tests.
- Quality checks.
- Container build.

---

# 11. Development Environment

Recomendado:

Backend:

- Java 21
- Gradle
- Spring Boot

Frontend:

- Node.js LTS
- Angular CLI

Database:

- PostgreSQL Docker

---

# 12. Future Technology Considerations

Posibles incorporaciones futuras:

## Document Processing

- OCR.
- Document storage.

## Messaging

- RabbitMQ.
- Kafka.

## Cloud

- AWS.
- GCP.
- Azure.

## Observability

- OpenTelemetry.
- Prometheus.
- Grafana.

Estas tecnologías no forman parte del MVP.

---

# 13. Final Technology Decision

Stack oficial SGCC v1.0:

| Layer | Technology |
|---|---|
| Backend | Java 21 + Spring Boot 3 |
| Frontend | Angular 20+ |
| Database | PostgreSQL 16+ |
| ORM | Spring Data JPA |
| Migration | Flyway |
| API | REST + OpenAPI |
| Container | Docker |
| CI/CD | GitHub Actions |
| Testing | JUnit + Testcontainers + Angular Testing |

---

# 14. Status

| Milestone | Status |
|---|---|
| Technology Selection | ✓ |
| Architecture Alignment | ✓ |
| Implementation | Pending |
