# SGCC Testing Strategy

## Document Information

| Attribute | Value |
|---|---|
| Product | SGCC |
| Full Name | Sistema de Gestión de Cobros y Consumos de Recibos |
| Document Type | Testing Strategy |
| Version | 1.0 |
| Status | Draft |
| Based On | Cloud Lab v1.0 |
| Backend Testing | JUnit 5 + Testcontainers |
| Frontend Testing | Angular Testing Framework |
| Last Updated | 2026-07-21 |

---

## 1. Purpose

Este documento define la estrategia oficial de pruebas para SGCC.

El objetivo es garantizar:

- Exactitud de cálculos.
- Integridad del dominio.
- Calidad del software.
- Confianza en futuras modificaciones.

---

## 2. Testing Philosophy

SGCC prioriza:

> **Business Correctness**

sobre

> **Code Coverage**

---

Una aplicación con 95% de cobertura pero cálculos incorrectos no es aceptable.

---

## 3. Testing Pyramid

La estrategia será:

```
        E2E Tests
     Integration Tests
  Application Tests
Domain Unit Tests
```

La mayor inversión estará en:

> **Domain Unit Tests**

porque contienen las reglas críticas.

---

## 4. Testing Levels

### 4.1 Domain Tests

Responsabilidad:

> Validar reglas puras del negocio.

No requieren:

- Database.
- Spring Context.
- HTTP.

---

Ejemplo:

- `ConsumptionCalculatorTest`
- `SettlementCalculatorTest`

---

## 5. Critical Business Rules Tests

### 5.1 Consumption Calculation

Regla:

```
consumption = currentReading - previousReading
```

---

Caso válido:

**Input:**

```
previous = 11095
current = 11110
```

**Resultado esperado:**

```
consumption = 15
```

---

Caso inválido:

**Input:**

```
previous = 11110
current = 11095
```

**Esperado:**

> `DomainException`

---

## 6. Unit Value Calculation

Regla:

```
unitValue = receiptAmount / receiptConsumption
```

---

Caso:

**Input:**

```
amount = 475
consumption = 584
```

**Resultado:**

```
0.81
```

---

Validación:

No permitir:

```
receiptConsumption = 0
```

---

## 7. Tenant Settlement Calculation

Regla:

```
tenantAmount = consumption × unitValue
```

---

Caso:

**Input:**

```
consumption = 15
unitValue = 0.81
```

**Resultado:**

```
12.15
```

---

## 8. Adjustment Tests

Regla:

```
finalAmount = calculatedAmount + adjustment
```

---

Caso:

```
Calculado: 12.15
Ajuste: -0.15
Resultado: 12.00
```

---

Debe conservar:

> `calculatedAmount` original

---

## 9. Empty Room Scenario

Regla:

Si una habitación no tiene inquilino:

> No settlement generated

---

Ejemplo:

**Propiedad:**

```
Habitación 1 → Tenant
Habitación 2 → Vacía
```

**Resultado:**

> Solo habitación 1 genera cobro

---

## 10. Multiple Tenants Scenario

Caso:

Una propiedad tiene:

- Tenant A
- Tenant B
- Tenant C

---

Cada uno debe obtener:

> Individual settlement

---

Nunca:

> Global settlement

---

## 11. Backend Testing Strategy

### Frameworks

Utilizar:

- JUnit 5
- Mockito
- AssertJ
- Testcontainers

---

## 12. Domain Test Location

Ubicación:

```
src/test/java
```

Ejemplo:

```
settlement/
└── domain/
    └── SettlementTest.java
```

---

## 13. Application Tests

Validan:

- Casos de uso.
- Orquestación.
- Reglas de aplicación.

---

Ejemplo:

- `GenerateSettlementUseCaseTest`

---

## 14. Integration Tests

Validan:

- Spring Context.
- Database.
- Repositories.
- API.

---

Herramienta:

> Testcontainers PostgreSQL

---

Ejemplo:

- `SettlementRepositoryIT`

---

## 15. API Tests

Validar:

- HTTP status.
- Request validation.
- Response format.

---

Ejemplo:

```
POST /api/v1/settlements/generate
```

---

**Caso exitoso:**

```
HTTP 200
```

---

**Caso inválido:**

```
HTTP 400
```

---

## 16. Frontend Testing Strategy

### Component Tests

Validan:

- Renderizado.
- Inputs.
- Eventos.

---

Ejemplo:

- `SettlementTableComponent`

---

## 17. Frontend Service Tests

Validan:

- Requests HTTP.
- Mapping.
- Manejo de errores.

---

Ejemplo:

- `SettlementApiService`

---

## 18. End To End Testing

Inicialmente:

> No obligatorio para todos los módulos.

---

MVP mínimo:

Flujo completo:

```
Create Tenant
      ↓
Register Reading
      ↓
Register Receipt
      ↓
Generate Settlement
      ↓
View Amount
```

---

## 19. Acceptance Tests

Cada funcionalidad debe tener criterios:

Ejemplo:

### Generar cobros

**Dado:**

> Un recibo de electricidad

**Cuando:**

> Se ejecuta generación

**Entonces:**

> Se crean liquidaciones correctas

---

## 20. Coverage Targets

Objetivos:

| Level | Target |
|---|---|
| Domain | 90%+ |
| Application | 80%+ |
| Infrastructure | 60%+ |

---

La cobertura no reemplaza pruebas funcionales.

---

## 21. Quality Gates

Antes de merge:

Debe pasar:

- Build
- Tests
- Static Analysis
- Architecture Validation

---

## 22. Regression Protection

Cada bug corregido debe agregar:

> Regression Test

---

Ejemplo:

**Bug:**

> Redondeo incorrecto

**Debe generar:**

- `SettlementRoundingTest`

---

## 23. Initial Test Suite

Primer entregable:

- `ConsumptionCalculatorTest`
- `UnitValueCalculatorTest`
- `SettlementCalculatorTest`
- `AdjustmentTest`
- `ReceiptValidationTest`

---

## 24. Status

| Item | Status |
|---|---|
| Testing Strategy | ✓ |
| Automation Ready | Pending |
