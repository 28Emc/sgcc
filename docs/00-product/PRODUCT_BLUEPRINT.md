# SGCC Product Blueprint

## Document Information

| Attribute | Value |
|---|---|
| Product | SGCC |
| Full Name | Sistema de Gestión de Cobros y Consumos de Recibos |
| Version | 1.0 |
| Status | Draft |
| Product Type | Web Application |
| Platform | Cloud Lab v1.0 |
| Last Updated | 2026-07-21 |

---

# 1. Product Vision

SGCC (Sistema de Gestión de Cobros y Consumos de Recibos) es una aplicación web orientada a simplificar la administración de consumos y distribución de costos de servicios compartidos entre múltiples inquilinos dentro de una misma propiedad.

El sistema permite registrar lecturas de medidores individuales, asociarlas a recibos oficiales de servicios y calcular automáticamente el monto correspondiente que debe asumir cada inquilino.

SGCC nace como evolución de un proceso manual basado en hojas de cálculo, buscando mejorar la precisión, trazabilidad y facilidad de gestión del proceso de cobro de servicios.

---

# 2. Problem Statement

Actualmente, muchos propietarios o administradores gestionan el cobro de servicios compartidos mediante archivos Excel.

Este proceso presenta problemas:

- Registro manual de información.
- Posibilidad de errores de cálculo.
- Falta de historial organizado.
- Dificultad para consultar períodos anteriores.
- Ausencia de trazabilidad sobre ajustes realizados.
- Generación manual de liquidaciones.
- Dependencia del conocimiento de una sola persona.

SGCC busca transformar este proceso en una operación digital, organizada y repetible.

---

# 3. Product Goal

El objetivo principal de SGCC es proporcionar una herramienta simple y confiable para:

- Registrar propiedades.
- Administrar unidades habitacionales.
- Registrar servicios consumidos.
- Registrar lecturas de medidores.
- Asociar recibos oficiales.
- Calcular consumos individuales.
- Generar montos a cobrar.
- Emitir liquidaciones para cada inquilino.

---

# 4. Target Users

## Primary Users

### Propietarios

Personas que alquilan habitaciones, departamentos o espacios dentro de una propiedad.

**Necesitan:**

- Saber cuánto debe pagar cada inquilino.
- Mantener historial de consumos.
- Evitar cálculos manuales.

### Administradores

Personas encargadas de gestionar múltiples propiedades.

**Necesitan:**

- Centralizar información.
- Reducir trabajo operativo.
- Generar reportes.

## Secondary Users

### Inquilinos

Personas que reciben una liquidación de consumo.

**Necesitan:**

- Transparencia sobre el cálculo.
- Detalle del consumo.
- Historial de pagos futuros.

---

# 5. Product Scope

## Included in Version 1.0

SGCC v1.0 incluirá:

### Gestión de propiedades

- Crear propiedades.
- Actualizar propiedades.
- Consultar propiedades.

### Gestión de unidades

- Crear habitaciones o unidades.
- Asociar inquilinos.
- Controlar disponibilidad.

### Gestión de servicios

Servicios soportados:

- Electricidad.
- Agua.
- Gas.
- Otros servicios configurables.

### Gestión de medidores

Permite registrar:

- Medidor.
- Servicio asociado.
- Unidad asociada.

### Gestión de lecturas

Permite registrar:

- Lectura anterior.
- Lectura actual.
- Fecha de lectura.
- Consumo calculado.

### Gestión de recibos

Permite registrar:

- Proveedor.
- Periodo.
- Consumo total.
- Importe total.

### Cálculo automático

El sistema calculará:

```text
consumption = current_reading - previous_reading
unit_value = receipt_amount / receipt_consumption
tenant_total = consumption × unit_value
```

### Liquidaciones

Permite:

- Generar cálculo individual.
- Mostrar detalle del cálculo.
- Aplicar ajustes manuales.
- Generar documento de liquidación.

---

# 6. Out of Scope

SGCC v1.0 no contempla:

- Facturación electrónica.
- Cobro online.
- Integraciones bancarias.
- Contabilidad.
- Gestión tributaria.
- Gestión contractual avanzada.
- IoT.
- Lectura automática de medidores.
- OCR.
- Aplicaciones móviles.
- Inteligencia Artificial.

Estas funcionalidades forman parte del roadmap futuro.

---

# 7. Business Principles

SGCC seguirá los siguientes principios:

## Simplicidad

El sistema debe resolver el problema principal sin agregar complejidad innecesaria.

## Transparencia

Todo cálculo generado debe poder ser explicado.

## Trazabilidad

Los valores originales deben conservarse.

## Automatización

Eliminar tareas repetitivas realizadas manualmente.

## Evolución progresiva

Agregar funcionalidades solamente cuando exista una necesidad real.

---

# 8. Core Business Flow

```text
Registrar propiedad
    ↓
Registrar unidades
    ↓
Registrar inquilinos
    ↓
Registrar servicios
    ↓
Registrar recibo
    ↓
Registrar lecturas
    ↓
Calcular consumos
    ↓
Generar liquidaciones
    ↓
Comunicar monto a cobrar
```

---

# 9. Product Vision Evolution

## Stage 1 — Digitalización

Eliminar dependencia del Excel.

## Stage 2 — Automatización

Reducir intervención manual.

## Stage 3 — Comunicación

Facilitar interacción con inquilinos.

## Stage 4 — Smart Management

Agregar análisis, predicción y automatización avanzada.

---

# 10. Success Criteria

SGCC v1.0 será considerado exitoso cuando permita:

- Registrar una propiedad.
- Registrar habitaciones.
- Registrar inquilinos.
- Registrar servicios.
- Registrar recibos.
- Registrar lecturas.
- Calcular consumos correctamente.
- Calcular montos correctamente.
- Generar liquidaciones individuales.
- Mantener historial.

---

# 11. Architecture Constraints

SGCC será desarrollado siguiendo Cloud Lab v1.0.

Principios:

- Modular Monolith.
- Clean Architecture.
- Domain Driven Design.
- Backend Java.
- Frontend Angular.
- Base de datos relacional.
- Desarrollo basado en documentación.

---

# 12. Current Status

| Milestone | Status |
|---|---|
| Idea definida | ✓ |
| Scope definido | ✓ |
| Product Blueprint | ✓ |
| Domain Discovery | Pending |
| Architecture Design | Pending |
| Implementation | Pending |
