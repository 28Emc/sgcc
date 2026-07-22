# SGCC - Sistema de Gestión de Cobros y Consumos de Recibos

## Descripción

SGCC es una aplicación web destinada a automatizar el cálculo de cobros de servicios compartidos entre múltiples inquilinos.

## Arquitectura

- **Estilo:** Modular Monolith
- **Patrón:** Clean Architecture + DDD
- **Frontend:** Angular 20+ (Standalone Components, Signals)
- **Backend:** Java 21 + Spring Boot 3
- **Base de datos:** PostgreSQL 16+ + Flyway
- **Infraestructura:** Docker Compose

## Stack Tecnológico

| Capa | Tecnología |
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

## Ejecución Local

### Prerrequisitos

- Java 21
- Node.js LTS
- Docker & Docker Compose
- Angular CLI

### Iniciar base de datos

```bash
docker-compose up -d postgres
```

### Iniciar backend

```bash
cd backend
./gradlew bootRun
```

### Iniciar frontend

```bash
cd frontend
ng serve
```

## Comandos Útiles

```bash
# Backend
cd backend && ./gradlew build
cd backend && ./gradlew test

# Frontend
cd frontend && npm install
cd frontend && ng build
cd frontend && ng test

# Docker
docker-compose up -d
docker-compose down
```

## Estructura del Proyecto

```
sgcc/
├── backend/          # Spring Boot Application
├── frontend/         # Angular Application
├── docs/             # Documentación
├── infrastructure/   # Configuración técnica
├── scripts/          # Automatizaciones
├── .github/          # CI/CD
├── .ai/              # AI Context
├── docker-compose.yml
├── README.md
└── CHANGELOG.md
```

## Licencia

Proyecto privado - Cloud Lab v1.0
