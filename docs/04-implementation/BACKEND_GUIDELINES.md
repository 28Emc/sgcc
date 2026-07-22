# SGCC Backend Guidelines

## Document Information

| Attribute | Value |
|---|---|
| Product | SGCC |
| Full Name | Sistema de Gestión de Cobros y Consumos de Recibos |
| Document Type | Backend Development Guidelines |
| Version | 1.0 |
| Status | Draft |
| Based On | Cloud Lab v1.0 |
| Framework | Spring Boot 3 |
| Language | Java 21 |
| Last Updated | 2026-07-21 |

---

# 1. Purpose

Este documento define las reglas de implementación del backend de SGCC.

Su objetivo es garantizar que el código mantenga:

- Separación de responsabilidades.
- Independencia del dominio.
- Facilidad de testing.
- Evolución futura.
- Consistencia arquitectónica.

---

# 2. Backend Architecture

El backend seguirá:

- Clean Architecture
- Domain Driven Design
- Modular Monolith

La dependencia debe fluir hacia el dominio:

```text
Presentation
  ↓
Application
  ↓
Domain

Infrastructure
  ↓
Application / Domain
```

---

# 3. Module Structure

Cada módulo debe ser independiente.

Ejemplo:

```text
settlement/
├── domain/
├── application/
├── infrastructure/
└── presentation/
```

No se permitirá:

```text
settlement/
├── controller
├── service
├── repository
└── entity
```

como estructura principal.

Motivo: Agrupa por tecnología y no por dominio.

---

# 4. Domain Layer

## Responsibility

Contiene las reglas reales del negocio.

Puede contener:

- Entities.
- Value Objects.
- Domain Services.
- Domain Exceptions.
- Domain Rules.

No puede contener:

- Spring annotations.
- JPA annotations.
- Controllers.
- DTOs REST.

Ejemplo:

```java
public class Settlement {

    private Money calculatedAmount;
    private Money adjustment;

    public Money calculateFinalAmount() {
        return calculatedAmount.add(adjustment);
    }
}
```

---

# 5. Entities

Las entidades representan conceptos del negocio.

Ejemplos:

- Property
- Tenant
- Meter
- Reading
- Receipt
- Settlement

Reglas:

- Deben tener identidad.
- Deben proteger invariantes.
- No deben ser simples estructuras de datos.

Incorrecto:

```java
@Getter
@Setter
@Entity
public class SettlementEntity {
}
```

Correcto:

```java
public class Settlement {

    public Settlement calculate() {
        // ...
    }
}
```

---

# 6. Value Objects

Los conceptos sin identidad propia deben representarse como Value Objects.

Ejemplos:

- Money
- ConsumptionValue
- MeasurementUnit
- Period

Ejemplo:

```java
public record Money(
    BigDecimal amount,
    Currency currency
) {}
```

---

# 7. Application Layer

Responsabilidad: Orquestar casos de uso.

Contiene:

- Use Cases.
- Application Services.
- DTO internos.
- Commands.
- Queries.

Ejemplos:

- CreatePropertyUseCase
- RegisterReadingUseCase
- GenerateSettlementUseCase

Ejemplo:

```java
public interface GenerateSettlementUseCase {

    SettlementResult execute(
        GenerateSettlementCommand command
    );
}
```

---

# 8. Infrastructure Layer

Responsabilidad: Implementar detalles técnicos.

Incluye:

- Database.
- External services.
- File storage.
- Framework adapters.

Ejemplo:

- JpaSettlementRepository
- SettlementRepositoryAdapter

Regla: El dominio nunca debe conocer infraestructura.

---

# 9. Presentation Layer

Responsabilidad: Exponer funcionalidades externas.

Incluye:

- REST Controllers.
- Request DTOs.
- Response DTOs.
- API validation.

Ejemplo:

```java
@RestController
public class SettlementController {

    @PostMapping("/api/v1/settlements")
    public SettlementResponse calculate() {
        return useCase.execute(command);
    }
}
```

Los controllers no deben contener lógica de negocio.

Incorrecto:

```java
@PostMapping
public Response calculate() {
    BigDecimal total = consumption * unitValue;
    // ...
}
```

Correcto:

```java
@PostMapping
public SettlementResponse calculate() {
    return useCase.execute(command);
}
```

---

# 10. DTO Guidelines

Los DTO deben existir solamente en los límites externos.

Capas:

```text
Request DTO
    ↓
  Command
    ↓
  Domain
    ↓
  Result
    ↓
Response DTO
```

No exponer entidades directamente.

---

# 11. Repository Pattern

El dominio define interfaces.

Dominio:

```java
public interface SettlementRepository {

    Optional<Settlement> findById(
        SettlementId id
    );
}
```

Infrastructure:

```java
@Repository
public class JpaSettlementRepositoryAdapter
    implements SettlementRepository {
    // ...
}
```

---

# 12. Error Handling

Se utilizará un modelo consistente.

Tipos:

- **Domain Exception**: Errores de reglas de negocio.
  - Ejemplo: `InvalidConsumptionException`
- **Application Exception**: Errores de ejecución de casos de uso.
- **Technical Exception**: Errores de infraestructura.
  - Ejemplo: `DatabaseConnectionException`

---

# 13. Validation Rules

Validaciones:

- **Presentation**: Validación de entrada.
  - Ejemplo: `@NotNull`
- **Domain**: Validación de reglas.
  - Ejemplo: `Current reading cannot be lower than previous reading`

---

# 14. Testing Strategy

La estrategia será:

```text
Unit Tests
    +
Integration Tests
    +
Architecture Tests
```

## Domain Tests

Prioridad máxima.

Ejemplos:

- SettlementCalculationTest
- ConsumptionCalculationTest

## Application Tests

Validar casos de uso.

## Integration Tests

Validar:

- API.
- Database.
- Persistence.

---

# 15. Database Access Rules

No usar:

- SQL directo dentro de servicios.
- Acceso a repositorios desde controllers.

Flujo permitido:

```text
Controller
    ↓
  Use Case
    ↓
Repository Port
    ↓
Repository Adapter
    ↓
  Database
```

---

# 16. Logging

Utilizar: SLF4J + Logback

No registrar:

- Passwords.
- Tokens.
- Información sensible.

---

# 17. Configuration

Usar: `application.yml` + Environment Variables

Separación:

- application-local.yml
- application-dev.yml
- application-prod.yml

---

# 18. API Versioning

Las APIs utilizarán: `/api/v1/`

Ejemplo:

```text
GET /api/v1/settlements
```

---

# 19. Backend Quality Gates

Antes de integrar código, debe cumplir:

- Build exitoso.
- Tests exitosos.
- Código formateado.
- Sin errores críticos.
- Documentación actualizada.

---

# 20. Recommended Package Structure

Ejemplo final:

```text
com.sgcc
├── property
│   ├── domain
│   ├── application
│   ├── infrastructure
│   └── presentation
├── settlement
│   ├── domain
│   ├── application
│   ├── infrastructure
│   └── presentation
└── shared
```

---

# 21. Status

| Milestone | Status |
|---|---|
| Backend Architecture | ✓ |
| Implementation Rules | ✓ |
| Coding | Pending |
