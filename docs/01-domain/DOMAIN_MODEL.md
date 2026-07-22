# SGCC Domain Model

## Document Information

| Attribute | Value |
|---|---|
| Product | SGCC |
| Full Name | Sistema de Gestión de Cobros y Consumos de Recibos |
| Document Type | Domain Model |
| Version | 1.0 |
| Status | Draft |
| Last Updated | 2026-07-21 |

---

# 1. Purpose

Este documento define el modelo conceptual del dominio de SGCC.

El objetivo es identificar los conceptos principales del negocio, sus responsabilidades y relaciones, sin depender de una implementación técnica específica.

Este modelo será la base para:

- Diseño de arquitectura.
- Diseño de base de datos.
- Diseño de APIs.
- Implementación del dominio.

---

# 2. Domain Overview

SGCC administra el proceso de distribución de costos de servicios compartidos dentro de una propiedad con múltiples ocupantes.

El dominio principal está compuesto por:

```text
Property
    ↓
   Unit
    ↓
  Tenant
    ↓
Service Consumption
    ↓
  Settlement
```

---

# 3. Core Domain Concepts

## 3.1 Property

### Definition

Representa una ubicación física donde existen unidades habitacionales o espacios que consumen servicios.

Ejemplos:

- Casa.
- Edificio.
- Local comercial.
- Residencia.

### Responsibilities

Una Property debe permitir:

- Identificar la ubicación.
- Agrupar unidades.
- Administrar servicios asociados.
- Mantener historial de consumos.

### Attributes

Conceptuales:

- Nombre.
- Dirección.
- Propietario.
- Estado.

---

## 3.2 Unit

### Definition

Representa una unidad independiente dentro de una propiedad.

Ejemplos:

- Habitación.
- Departamento.
- Oficina.
- Local.

### Responsibilities

Una Unit debe permitir:

- Asociar un inquilino.
- Asociar medidores.
- Registrar consumo individual.

### Attributes

Conceptuales:

- Nombre o código.
- Estado.
- Propiedad asociada.

---

## 3.3 Tenant

### Definition

Representa la persona responsable del consumo generado por una unidad.

### Responsibilities

Un Tenant debe permitir:

- Identificar al ocupante.
- Asociarse a una unidad.
- Recibir liquidaciones.

### Attributes

Conceptuales:

- Nombre.
- Documento.
- Información de contacto.
- Estado.

---

## 3.4 Service

### Definition

Representa un servicio cuyo costo será distribuido.

Ejemplos:

- Electricidad.
- Agua.
- Gas.
- Internet.

### Responsibilities

Un Service define:

- Tipo de servicio.
- Unidad de medida.
- Forma de cálculo.

### Attributes

Conceptuales:

- Nombre.
- Unidad de medición.

Ejemplos:

```text
Electricidad → kWh
Agua → m3
Gas → m3
```

---

## 3.5 Meter

### Definition

Representa el dispositivo utilizado para registrar consumo individual.

### Responsibilities

Un Meter debe permitir:

- Identificar el medidor.
- Asociarse a una unidad.
- Registrar lecturas.

### Attributes

Conceptuales:

- Código.
- Servicio asociado.
- Unidad asociada.

---

## 3.6 Reading

### Definition

Representa una lectura registrada del medidor en un momento determinado.

### Responsibilities

Una Reading permite:

- Registrar valor anterior.
- Registrar valor actual.
- Calcular consumo.

### Calculation

```text
Consumption = Current Reading - Previous Reading
```

### Attributes

Conceptuales:

- Fecha.
- Valor registrado.
- Periodo.

---

## 3.7 Provider Receipt

### Definition

Representa el recibo oficial emitido por el proveedor del servicio.

Ejemplos:

- Recibo de electricidad.
- Recibo de agua.

### Responsibilities

Un Receipt contiene:

- Periodo.
- Consumo total.
- Importe total.

### Attributes

Conceptuales:

- Proveedor.
- Fecha.
- Periodo.
- Consumo.
- Importe.

---

## 3.8 Consumption

### Definition

Representa el consumo calculado de una unidad durante un periodo.

### Formula

```text
Consumption = Current Reading - Previous Reading
```

### Attributes

Conceptuales:

- Periodo.
- Cantidad consumida.
- Unidad de medida.

---

## 3.9 Settlement

### Definition

Representa el resultado final del cálculo que determina cuánto debe pagar un tenant.

### Responsibilities

Un Settlement debe contener:

- Consumo generado.
- Valor unitario aplicado.
- Importe calculado.
- Ajustes.
- Total final.

### Formula

```text
Tenant Total = Consumption × Unit Value
```

---

# 4. Domain Relationships

Modelo conceptual:

```text
Property
│
├── has many
│
Unit
│
├── occupied by
│
Tenant

Unit
│
├── has
│
Meter

Meter
│
├── generates
│
Reading

Service
│
├── has
│
Provider Receipt

Reading + Receipt
│
│
▼
Settlement
```

---

# 5. Aggregate Candidates

Primer análisis DDD:

## Property Aggregate

Responsabilidad: Administrar estructura física.

Incluye:

- Units.

## Meter Aggregate

Responsabilidad: Administrar medición.

Incluye:

- Readings.

## Settlement Aggregate

Responsabilidad: Administrar cálculos y resultados.

Incluye:

- Consumption.
- Adjustments.

---

# 6. Domain Boundaries

El dominio principal de SGCC está enfocado en:

- Consumption Management
- Cost Distribution
- Settlement Generation

No incluye:

- Accounting.
- Payments.
- External billing.
- Utility management.

---

# 7. Future Domain Extensions

Posibles extensiones futuras:

- Payments.
- Notifications.
- Contracts.
- Analytics.
- Smart Metering.
