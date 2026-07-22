# SGCC Local Development Guide

## Document Information

| Attribute | Value |
|---|---|
| Product | SGCC |
| Full Name | Sistema de Gestión de Cobros y Consumos de Recibos |
| Document Type | Local Development Guide |
| Version | 1.0 |
| Status | Draft |
| Based On | Cloud Lab v1.0 |
| Environment | Local |
| Last Updated | 2026-07-21 |

---

# 1. Purpose

Este documento define el procedimiento oficial para ejecutar SGCC en un entorno local.

El objetivo es garantizar que cualquier desarrollador pueda:

- Clonar el repositorio.
- Configurar dependencias.
- Levantar infraestructura.
- Ejecutar backend.
- Ejecutar frontend.
- Ejecutar pruebas.

---

# 2. Development Environment

## Required Software

Versiones mínimas:

| Software | Version |
|---|---|
| Git | Latest |
| Docker | 24+ |
| Docker Compose | 2+ |
| Java | 21 LTS |
| Node.js | LTS |
| Angular CLI | Latest |
| PostgreSQL | 16+ |

---

# 3. Repository Clone

Ejemplo:

```bash
git clone https://github.com/company/sgcc.git
cd sgcc
```

---

# 4. Repository Structure

Después del clone:

```text
sgcc/
├── backend/
├── frontend/
├── docs/
├── infrastructure/
├── scripts/
├── docker-compose.yml
└── README.md
```

---

# 5. Environment Configuration

SGCC utiliza variables de entorno.

Nunca almacenar:

- passwords.
- tokens.
- credenciales.

---

# 6. Backend Configuration

Ubicación:

```text
backend/src/main/resources/
```

Archivos:

- application.yml
- application-local.yml

Ejemplo:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/sgcc
    username: sgcc
    password: sgcc
```

---

# 7. Frontend Configuration

Ubicación:

```text
frontend/src/environments/
```

Archivos:

- environment.ts
- environment.prod.ts

Ejemplo:

```typescript
export const environment = {
  apiUrl: 'http://localhost:8080/api/v1'
};
```

---

# 8. Docker Environment

SGCC utilizará Docker Compose para servicios locales.

Archivo:

```text
docker-compose.yml
```

Servicios iniciales:

- postgres
- backend
- frontend

Ejemplo conceptual:

```text
                SGCC
                  |
        --------------------
        |        |         |
    Backend   Frontend  PostgreSQL
```

---

# 9. Database Startup

Levantar base de datos:

```bash
docker compose up postgres
```

Resultado esperado:

```text
PostgreSQL running
Port: 5432
```

---

# 10. Database Migration

Las migraciones serán ejecutadas mediante Flyway.

Proceso:

```text
Application Startup
        |
      Flyway
        |
  Database Schema
```

Verificar:

```bash
./gradlew flywayInfo
```

---

# 11. Backend Startup

Ingresar:

```bash
cd backend
```

Ejecutar:

Linux/Mac:

```bash
./gradlew bootRun
```

Windows:

```bash
gradlew.bat bootRun
```

Backend disponible:

```text
http://localhost:8080
```

Swagger:

```text
http://localhost:8080/swagger-ui.html
```

---

# 12. Frontend Startup

Ingresar:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Ejecutar:

```bash
npm start
```

Frontend disponible:

```text
http://localhost:4200
```

---

# 13. Complete Startup Flow

Flujo recomendado:

```text
1. Start PostgreSQL
        ↓
2. Run Backend
        ↓
3. Run Frontend
        ↓
4. Access Application
```

---

# 14. Development Workflow

Flujo diario:

```text
Pull latest changes
        ↓
Create feature branch
        ↓
Implement change
        ↓
Run tests
        ↓
Commit
        ↓
Create Pull Request
```

---

# 15. Branch Convention

Formato:

```text
feature/<name>
fix/<name>
docs/<name>
```

Ejemplos:

```text
feature/property-module
feature/settlement-engine
fix/reading-validation
```

---

# 16. Commit Convention

Se utilizará Conventional Commits.

Formato:

```text
type(scope): description
```

Ejemplos:

```text
feat(settlement): add calculation engine
fix(reading): validate negative consumption
docs(api): update contract
```

---

# 17. Testing Commands

## Backend

Ejecutar:

```bash
./gradlew test
```

## Frontend

Ejecutar:

```bash
npm test
```

---

# 18. Quality Checks

Antes de enviar cambios:

Backend:

```bash
./gradlew check
```

Frontend:

```bash
npm run lint
```

---

# 19. Reset Local Environment

Para reiniciar completamente:

```bash
docker compose down -v
```

Luego:

```bash
docker compose up
```

---

# 20. Debugging

## Backend

Logs:

```text
backend/logs
```

## Database

Conectar:

```text
localhost:5432
```

Herramientas:

- DBeaver.
- DataGrip.
- pgAdmin.

---

# 21. Common Problems

## Database connection error

Verificar:

- PostgreSQL activo.
- Variables correctas.
- Puerto disponible.

## Migration error

Revisar:

```text
db/migration
```

## Frontend API error

Verificar:

```text
environment.ts
```

---

# 22. Future Improvements

Fuera de SGCC v1.0:

- Dev Containers.
- Kubernetes local.
- MinIO.
- Observability stack.
- Local CI simulation.

---

# 23. Status

| Milestone | Status |
|---|---|
| Environment Definition | ✓ |
| Developer Onboarding | ✓ |
| Implementation Ready | ✓ |
