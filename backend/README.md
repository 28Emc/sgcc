# SGCC Backend

API REST del Sistema de Gestion de Cobros y Consumos de Recibos. construido con Java 21 y Spring Boot 3.

## Stack

- Java 21
- Spring Boot 3.3.2
- Spring Data JPA + PostgreSQL 16
- Spring Security (HTTP Basic)
- Flyway (migraciones de BD)
- Springdoc OpenAPI (Swagger UI)
- Gradle 8.9

## Requisitos

- Java 21 (JDK)
- PostgreSQL 16+ (local o via Docker)
- Gradle 8.9+ (o usar el wrapper incluido)

## Ejecucion local

### 1. Levantar PostgreSQL

```bash
# Desde la raiz del proyecto
docker-compose up -d postgres
```

Esto levanta PostgreSQL en `localhost:5432` con:

| Parametro | Valor |
|-----------|-------|
| Base de datos | `sgcc` |
| Usuario | `sgcc_user` |
| Password | `sgcc_password` |

### 2. Ejecutar el backend

```bash
cd backend

# Con Gradle instalado
gradle bootRun

# O con Docker (compila y ejecuta todo)
docker-compose up -d backend
```

El backend arranca en `http://localhost:8080`.

## Endpoints

| Ruta | Descripcion |
|------|-------------|
| `GET /api/v1/properties` | CRUD de propiedades |
| `GET /api/v1/tenants` | CRUD de inquilinos |
| `GET /api/v1/meters` | CRUD de medidores |
| `GET /api/v1/readings` | Lecturas de medidores |
| `GET /api/v1/receipts` | Recibos de servicios |
| `GET /api/v1/settlements` | Liquidaciones por inquilino |
| `GET /actuator/health` | Health check |
| `GET /swagger-ui.html` | Swagger UI |
| `GET /api-docs` | OpenAPI spec (JSON) |

> **Nota:** Las rutas `/api/**` requieren autenticacion HTTP Basic. Credenciales por defecto: `admin` / `admin`.

## Estructura

```
backend/
├── src/main/java/com/sgcc/
│   ├── SgccApplication.java          # Entry point
│   ├── shared/                        # Domain shared (BaseEntity, Money, Period, etc.)
│   │   ├── domain/
│   │   └── infrastructure/            # SecurityConfig, OpenApiConfig, GlobalExceptionHandler
│   ├── property/                      # Modulo Propiedades + Unidades
│   ├── tenant/                        # Modulo Inquilinos
│   ├── service/                       # Modulo Servicios (agua, luz, etc.)
│   ├── meter/                         # Modulo Medidores
│   ├── reading/                       # Modulo Lecturas
│   ├── receipt/                       # Modulo Recibos
│   └── settlement/                    # Modulo Liquidaciones + Calculo
├── src/main/resources/
│   ├── application.properties
│   └── db/migration/                  # V001-V010 Flyway scripts
├── src/test/java/com/sgcc/           # Tests unitarios
├── build.gradle
└── Dockerfile
```

## Comandos

```bash
# Compilar
gradle build

# Ejecutar tests
gradle test

# Formatear codigo (Spotless)
gradle spotlessApply

# Build del JAR ejecutable
gradle bootJar

# Limpiar build
gradle clean
```

## Variables de entorno (Docker)

| Variable | Default | Descripcion |
|----------|---------|-------------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/sgcc` | URL de conexion a BD |
| `SPRING_DATASOURCE_USERNAME` | `sgcc_user` | Usuario de BD |
| `SPRING_DATASOURCE_PASSWORD` | `sgcc_password` | Password de BD |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `validate` | Estrategia DDL |
| `SPRING_FLYWAY_ENABLED` | `true` | Habilitar migraciones |

## Base de datos

Las migraciones se ejecutan automaticamente al iniciar la aplicacion via Flyway. Los scripts SQL estan en `src/main/resources/db/migration/`:

| Script | Descripcion |
|--------|-------------|
| V001 | Schema base (funciones, extension UUID) |
| V002 | Tablas `properties`, `units` |
| V003 | Tablas `tenants`, `occupancies` |
| V004 | Tabla `services` |
| V005 | Tabla `meters` |
| V006 | Tabla `readings` |
| V007 | Tabla `receipts` |
| V008 | Tablas `settlements`, `settlement_adjustments` |
| V009 | Indices |
| V010 | Datos iniciales |
