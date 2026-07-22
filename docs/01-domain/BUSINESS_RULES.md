# SGCC Business Rules

## Document Information

| Attribute | Value |
|---|---|
| Product | SGCC |
| Full Name | Sistema de Gestión de Cobros y Consumos de Recibos |
| Document Type | Business Rules |
| Version | 1.0 |
| Status | Draft |
| Last Updated | 2026-07-21 |

---

# 1. Purpose

Este documento define las reglas de negocio que gobiernan el funcionamiento de SGCC.

Estas reglas representan el comportamiento real del proceso actual de cálculo de consumos y distribución de costos realizado mediante hojas de cálculo.

El objetivo es mantener una única fuente de verdad para:

- Cálculos.
- Validaciones.
- Procesos.
- Decisiones funcionales.

---

# 2. General Principles

SGCC seguirá los siguientes principios:

1. Los consumos se calculan utilizando lecturas reales.
2. Los costos se distribuyen según consumo medido.
3. Cada servicio se calcula de forma independiente.
4. No existen cargos fijos en la versión inicial.
5. Los ajustes manuales deben conservar trazabilidad.
6. Una habitación sin inquilino no participa del cálculo.

---

# 3. Consumption Calculation Rules

## BR-001 — Individual Consumption Calculation

### Description

El consumo individual de un inquilino se obtiene mediante la diferencia entre la lectura actual y la lectura anterior del medidor asociado.

### Formula

```text
consumption = current_reading - previous_reading
```

### Example

```text
Servicio: Electricidad
Lecturas:
  Lectura anterior: 11095 kWh
  Lectura actual: 11110 kWh

Resultado:
  Consumo: 11110 - 11095 = 15 kWh
```

---

## BR-002 — Previous Reading Requirement

Para calcular un consumo debe existir una lectura anterior válida.

No se permite calcular consumo cuando:

- No existe lectura anterior.
- La lectura actual es menor a la anterior.

---

## BR-003 — Negative Consumption

Un consumo negativo no es válido.

Ejemplo:

```text
Lectura anterior: 500
Lectura actual: 450
Resultado: -50
```

Acción: El sistema debe rechazar el cálculo y solicitar revisión.

---

# 4. Receipt Calculation Rules

## BR-004 — Service Receipt Unit Value

El valor unitario del servicio se obtiene dividiendo el importe total del recibo entre el consumo total registrado en dicho recibo.

### Formula

```text
unit_value = receipt_amount / receipt_consumption
```

### Example

```text
Recibo:
  Importe: S/ 475.00
  Consumo: 584 kWh

Resultado:
  475 / 584 = 0.81 S/ kWh
```

---

## BR-005 — Zero Consumption Receipt

Un recibo con consumo igual a cero no puede generar un valor unitario.

Ejemplo:

```text
Importe: S/ 100
Consumo: 0
```

Acción: El sistema debe impedir el cálculo.

---

# 5. Tenant Settlement Rules

## BR-006 — Tenant Total Calculation

El monto correspondiente a un inquilino se calcula multiplicando su consumo individual por el valor unitario del recibo.

### Formula

```text
tenant_total = consumption × unit_value
```

### Example

```text
Datos:
  Consumo: 15 kWh
  Valor unitario: S/ 0.81

Resultado:
  15 × 0.81 = S/ 12.15
```

---

## BR-007 — Independent Service Calculation

Cada servicio debe calcularse independientemente.

Ejemplo:

Una propiedad puede tener:

- Electricidad
- Agua
- Gas

Cada servicio tendrá:

- Su propio recibo.
- Su propio consumo.
- Su propio valor unitario.
- Su propia liquidación.

---

## BR-008 — Empty Unit Rule

Una unidad sin inquilino activo no participa del cálculo.

Ejemplo:

```text
Propiedad:
  Habitación 1 → Ocupada
  Habitación 2 → Ocupada
  Habitación 3 → Vacía

Resultado:
  Solo participan: Habitación 1, Habitación 2
```

---

# 6. Adjustment Rules

## BR-009 — Manual Adjustment Support

El sistema debe permitir modificar el monto final calculado.

Motivos posibles:

- Diferencias de redondeo.
- Ajustes administrativos.
- Acuerdos con inquilinos.

---

## BR-010 — Calculation Preservation

Cuando exista un ajuste manual, el sistema debe conservar:

```text
Monto calculado originalmente
+ Ajuste aplicado
=
Monto final
```

Nunca debe reemplazarse el cálculo original.

### Example

```text
Cálculo: S/ 12.15
Ajuste: -0.15
Resultado: Total final S/ 12.00
```

---

# 7. Period Rules

## BR-011 — Calculation Period

Todos los cálculos pertenecen a un periodo determinado.

Ejemplo:

```text
Julio 2026
```

Los datos utilizados deben pertenecer al mismo periodo.

---

## BR-012 — Historical Preservation

Una liquidación generada debe mantener la información utilizada en su cálculo.

Cambios posteriores no deben modificar históricos.

---

# 8. Precision and Rounding Rules

## BR-013 — Decimal Precision

Los cálculos internos deben mantener precisión decimal.

Los valores mostrados al usuario podrán redondearse.

---

## BR-014 — Currency

La moneda utilizada será: **PEN** (Soles peruanos)

---

# 9. Version 1.0 Limitations

Estas reglas aplican para SGCC v1.0.

No se incluyen:

- Distribuciones porcentuales.
- Cargos fijos.
- Tarifas diferenciadas.
- Penalidades.
- Impuestos.
- Subvenciones.

---

# 10. Future Extensions

Posibles reglas futuras:

- Consumo mínimo.
- Tarifas escalonadas.
- Servicios compartidos.
- Lecturas automáticas.
- Integración con proveedores.
