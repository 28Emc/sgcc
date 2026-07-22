# SGCC Ubiquitous Language

## Document Information

| Attribute | Value |
|---|---|
| Product | SGCC |
| Full Name | Sistema de Gestión de Cobros y Consumos de Recibos |
| Document Type | Ubiquitous Language |
| Version | 1.0 |
| Status | Draft |
| Last Updated | 2026-07-21 |

---

# 1. Purpose

Este documento define el lenguaje común utilizado dentro del dominio de SGCC.

Su objetivo es evitar ambigüedades entre:

- Equipo de producto.
- Arquitectura.
- Backend.
- Frontend.
- Base de datos.
- Documentación.
- Usuarios finales.

Todos los términos definidos aquí representan conceptos del negocio.

---

# 2. Core Domain Terms

## Property

### Definition

Propiedad física donde existen una o más unidades que consumen servicios.

### Examples

- Casa con habitaciones alquiladas.
- Edificio residencial.
- Local con varios ocupantes.

### Related Terms

- Unit.
- Service.
- Meter.

---

## Unit

### Definition

Espacio independiente dentro de una propiedad que puede ser ocupado por un inquilino.

En la versión inicial de SGCC representa principalmente una habitación.

### Examples

- Habitación 101.
- Departamento A.
- Oficina 3.

### Related Terms

- Property.
- Tenant.
- Meter.

---

## Tenant

### Definition

Persona que ocupa una unidad y es responsable del consumo generado durante un periodo determinado.

### Responsibilities

Un tenant:

- Consume servicios.
- Tiene lecturas asociadas.
- Recibe liquidaciones.

---

## Occupancy

### Definition

Relación temporal entre un Tenant y una Unit.

Indica quién ocupa una unidad durante un periodo determinado.

### Important Rule

Una unidad sin ocupante activo no participa en liquidaciones.

---

## Service

### Definition

Servicio cuyo costo debe ser distribuido entre los ocupantes.

### Examples

- Electricidad.
- Agua.
- Gas.

### Attributes

Un servicio tiene:

- Nombre.
- Unidad de medida.
- Proveedor.

---

## Service Provider

### Definition

Entidad externa que entrega un servicio y emite un recibo.

### Examples

- Empresa eléctrica.
- Empresa de agua.
- Empresa de gas.

---

## Meter

### Definition

Dispositivo asociado a una unidad utilizado para registrar consumo.

### Examples

- Medidor eléctrico.
- Medidor de agua.
- Medidor de gas.

---

## Reading

### Definition

Valor registrado del medidor en una fecha determinada.

Una lectura representa el estado acumulado del medidor.

### Example

```text
Fecha: 2026-07-01
Valor: 11110 kWh
```

---

## Previous Reading

### Definition

Última lectura válida registrada antes del periodo actual.

Se utiliza como punto inicial para calcular consumo.

---

## Current Reading

### Definition

Lectura registrada al finalizar un periodo de consumo.

---

## Consumption

### Definition

Cantidad de servicio utilizada durante un periodo.

### Formula

```text
Consumption = Current Reading - Previous Reading
```

### Example

```text
11110 - 11095 = 15 kWh
```

---

## Receipt

### Definition

Documento emitido por un proveedor donde se establece el costo total de un servicio durante un periodo.

### Contains

- Servicio.
- Periodo.
- Consumo total.
- Importe total.

---

## Receipt Consumption

### Definition

Cantidad total consumida indicada en un recibo del proveedor.

Ejemplo:

```text
584 kWh
```

---

## Receipt Amount

### Definition

Monto total cobrado por el proveedor.

Ejemplo:

```text
S/ 475.00
```

---

## Unit Value

### Definition

Costo unitario obtenido a partir del recibo del proveedor.

Representa cuánto cuesta una unidad consumida del servicio.

### Formula

```text
Unit Value = Receipt Amount / Receipt Consumption
```

### Example

```text
475 / 584 = 0.81 S/kWh
```

---

## Settlement

### Definition

Resultado final del cálculo realizado para determinar cuánto debe pagar un tenant por un servicio durante un periodo.

### Contains

- Tenant.
- Service.
- Consumption.
- Unit Value.
- Calculated Amount.
- Adjustment.
- Final Amount.

---

## Calculated Amount

### Definition

Monto obtenido automáticamente por el sistema.

### Formula

```text
Consumption × Unit Value
```

---

## Adjustment

### Definition

Modificación manual aplicada al monto calculado.

Puede utilizarse para corregir diferencias administrativas.

---

## Final Amount

### Definition

Monto definitivo que será comunicado al tenant.

### Formula

```text
Calculated Amount + Adjustment
```

---

## Period

### Definition

Intervalo de tiempo utilizado para agrupar consumos y liquidaciones.

Ejemplo:

```text
Julio 2026
```

---

# 3. Calculation Vocabulary

| Business Term | Meaning |
|---|---|
| Consumo | Cantidad utilizada de un servicio |
| Valor unitario | Precio por unidad consumida |
| Totalizado | Resultado final a cobrar |
| Liquidación | Documento/resumen del cálculo realizado |
| Recibo | Documento del proveedor del servicio |
| Lectura | Valor registrado por un medidor |

---

# 4. Terms Avoided

Estos términos deben evitarse porque pueden generar confusión:

## Invoice

Evitar utilizar "Invoice" para los documentos internos.

Motivo: En muchos contextos representa facturación formal.

SGCC utiliza: **Receipt** porque representa un recibo de servicio.

## Billing

Evitar usar "Billing" como concepto principal.

Motivo: SGCC no factura servicios. SGCC distribuye costos.

## Customer

Evitar utilizar "Customer".

Motivo: El usuario del sistema no necesariamente es un cliente comercial.

Utilizar: **Tenant**

## Charge

Evitar utilizar "Charge" en versión inicial.

Motivo: Puede interpretarse como cargos adicionales.

Utilizar: **Settlement Amount** o **Final Amount**

---

# 5. Naming Guidelines

Los nombres técnicos deberán derivarse de este lenguaje.

Ejemplo:

| Capa | Nombre |
|---|---|
| Dominio | Settlement |
| Backend | SettlementEntity, SettlementService, SettlementController |
| Frontend | SettlementPage, SettlementComponent |
| Base de datos | settlements |

---

# 6. Language Evolution

Este documento debe actualizarse cuando:

- Aparezcan nuevos conceptos.
- Cambie una regla de negocio.
- Se agreguen nuevos módulos.
- Exista una ambigüedad detectada.

El lenguaje del dominio debe evolucionar junto con el producto.
