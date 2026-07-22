# SGCC API Contract

## Document Information

| Attribute | Value |
|---|---|
| Product | SGCC |
| Full Name | Sistema de Gestión de Cobros y Consumos de Recibos |
| Document Type | API Contract Definition |
| Version | 1.0 |
| Status | Draft |
| Protocol | REST |
| Specification | OpenAPI 3 |
| Based On | Cloud Lab v1.0 |
| Last Updated | 2026-07-21 |

---

# 1. Purpose

Este documento define el contrato oficial de comunicación entre:

```text
Angular Frontend
    ↕
Spring Boot Backend
```

Define:

- Recursos disponibles.
- Endpoints.
- Formato de datos.
- Códigos HTTP.
- Manejo de errores.

---

# 2. API Principles

SGCC seguirá:

## REST

Los recursos serán representados como entidades del dominio.

## Versionamiento

Todas las APIs utilizarán: `/api/v1`

Ejemplo:

```text
GET /api/v1/properties
```

## JSON

Formato estándar: `application/json`

## Stateless

Cada petición debe contener toda la información necesaria.

---

# 3. Base URL

Formato:

```text
http://localhost:8080/api/v1
```

Producción:

```text
https://api.sgcc.com/api/v1
```

---

# 4. Common Response Structure

Todas las respuestas exitosas seguirán:

```json
{
  "data": {},
  "timestamp": "2026-07-21T10:00:00Z"
}
```

---

# 5. Pagination

Para colecciones:

Request:

```text
?page=0&size=20
```

Response:

```json
{
  "data": [],
  "pagination": {
    "page": 0,
    "size": 20,
    "totalElements": 100,
    "totalPages": 5
  }
}
```

---

# 6. Error Response

Formato estándar:

```json
{
  "error": {
    "code": "SGCC-001",
    "message": "Invalid reading value",
    "details": []
  },
  "timestamp": "2026-07-21T10:00:00Z"
}
```

---

# 7. HTTP Status Codes

| Code | Usage |
|---|---|
| 200 | Consulta exitosa |
| 201 | Creación exitosa |
| 204 | Operación sin contenido |
| 400 | Datos inválidos |
| 401 | No autenticado |
| 403 | Sin permisos |
| 404 | Recurso inexistente |
| 409 | Conflicto de negocio |
| 500 | Error interno |

---

# 8. Authentication

Versión inicial: JWT Authentication

Header:

```text
Authorization: Bearer {token}
```

---

# 9. Property API

## Create Property

```http
POST /properties
```

Request:

```json
{
  "name": "Casa Principal",
  "address": "Av. Example 123"
}
```

Response:

```json
{
  "id": "uuid",
  "name": "Casa Principal",
  "address": "Av. Example 123"
}
```

## List Properties

```http
GET /properties
```

## Get Property

```http
GET /properties/{id}
```

## Update Property

```http
PUT /properties/{id}
```

---

# 10. Tenant API

## Create Tenant

```http
POST /tenants
```

Request:

```json
{
  "name": "Juan Perez",
  "phone": "999999999"
}
```

## List Tenants

```http
GET /tenants
```

---

# 11. Service API

## Create Service

```http
POST /services
```

Request:

```json
{
  "name": "Electricidad",
  "measurementUnit": "KWH"
}
```

---

# 12. Meter API

## Register Meter

```http
POST /meters
```

Request:

```json
{
  "unitId": "uuid",
  "serviceId": "uuid",
  "serialNumber": "MTR001"
}
```

---

# 13. Reading API

## Register Reading

```http
POST /readings
```

Request:

```json
{
  "meterId": "uuid",
  "readingValue": 11110,
  "readingDate": "2026-07-01"
}
```

Response:

```json
{
  "id": "uuid",
  "consumption": 15
}
```

## Reading History

```http
GET /meters/{id}/readings
```

---

# 14. Receipt API

## Register Receipt

```http
POST /receipts
```

Request:

```json
{
  "serviceId": "uuid",
  "period": "2026-07",
  "totalAmount": 475,
  "totalConsumption": 584
}
```

Response:

```json
{
  "id": "uuid",
  "unitValue": 0.81
}
```

---

# 15. Settlement API

## Generate Settlement

Endpoint principal del sistema.

```http
POST /settlements/generate
```

Request:

```json
{
  "receiptId": "uuid"
}
```

Response:

```json
{
  "generated": 5,
  "settlements": [
    {
      "tenant": "Juan",
      "consumption": 15,
      "amount": 12.15
    }
  ]
}
```

---

# 16. Manual Adjustment API

## Apply Adjustment

```http
POST /settlements/{id}/adjustments
```

Request:

```json
{
  "amount": -0.15,
  "reason": "Redondeo autorizado"
}
```

---

# 17. Reporting API

## Monthly Summary

```http
GET /reports/monthly
```

Parameters:

```text
period=2026-07
```

Response:

```json
{
  "period": "2026-07",
  "services": [
    {
      "name": "Electricidad",
      "total": 475
    }
  ]
}
```

---

# 18. Domain Validation Errors

Ejemplos:

| Error Code | Description |
|---|---|
| SGCC-READING-001 | Current reading cannot be lower than previous reading |
| SGCC-RECEIPT-001 | Receipt consumption cannot be zero |
| SGCC-SETTLEMENT-001 | Cannot generate settlement without tenants |

---

# 19. OpenAPI Documentation

Ubicación: `/swagger-ui.html`

Contrato: `openapi.yaml`

---

# 20. API Evolution Rules

## Cambios compatibles

Permitidos:

- Nuevos campos opcionales.
- Nuevos endpoints.

## Cambios incompatibles

Requieren: `/api/v2`

Ejemplo:

```text
/api/v2/settlements
```

---

# 21. Status

| Milestone | Status |
|---|---|
| API Design | ✓ |
| Frontend Contract | ✓ |
| Backend Implementation | Pending |
