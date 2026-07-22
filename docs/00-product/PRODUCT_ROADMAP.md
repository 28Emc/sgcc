# SGCC Product Roadmap

## Document Information

| Attribute | Value |
|---|---|
| Product | SGCC |
| Full Name | Sistema de Gestión de Cobros y Consumos de Recibos |
| Version | 1.0 |
| Status | Draft |
| Last Updated | 2026-07-21 |

---

# 1. Purpose

Este documento define la evolución funcional esperada de SGCC.

El roadmap establece una dirección de producto a largo plazo, permitiendo priorizar funcionalidades y mantener el enfoque durante el desarrollo.

Este documento no representa un compromiso rígido de implementación. Las funcionalidades podrán cambiar según validaciones del producto, necesidades reales y decisiones futuras.

---

# 2. Product Evolution Strategy

SGCC evolucionará progresivamente siguiendo estas etapas:

```text
Foundation
    ↓
Digitalización
    ↓
Automatización
    ↓
Comunicación
    ↓
Smart Management
    ↓
Platform Evolution
```

Cada etapa representa una madurez superior del producto.

---

# 3. Version Roadmap

## SGCC 0.x — Foundation Stage

**Objetivo:** Convertir la idea inicial en un producto formalmente definido.

**Incluye:**

- Definición del problema.
- Alcance del producto.
- Modelo inicial de negocio.
- Arquitectura base.
- Diseño técnico.

**Estado:** En progreso.

---

## SGCC 0.5 — MVP Ready

**Objetivo:** Contar con un alcance completamente definido y listo para implementación.

**Incluye:**

- Product Blueprint aprobado.
- Modelo de dominio definido.
- Arquitectura aprobada.
- Diseño funcional validado.
- Backlog inicial.

**Criterio de salida:** El equipo puede iniciar desarrollo sin ambigüedades funcionales.

---

## SGCC 0.8 — Release Candidate

**Objetivo:** Contar con una versión funcional completa del MVP.

**Incluye:**

- Gestión de propiedades.
- Gestión de unidades.
- Gestión de inquilinos.
- Gestión de servicios.
- Gestión de medidores.
- Registro de lecturas.
- Registro de recibos.
- Cálculo automático.
- Liquidaciones.

**Criterio de salida:** Sistema funcional listo para validación real.

---

## SGCC 1.0 — Production Release

**Objetivo:** Primera versión estable del producto.

**Incluye:**

### Gestión básica

- Propiedades.
- Habitaciones.
- Inquilinos.
- Servicios.

### Consumos

- Lecturas.
- Cálculos.
- Historial.

### Cobros

- Liquidaciones.
- Ajustes manuales.
- Reportes básicos.

### Administración

- Usuarios.
- Seguridad básica.
- Auditoría.

**Criterio de éxito:** El sistema reemplaza completamente el proceso realizado actualmente mediante Excel.

---

## SGCC 1.1 — Product Improvements

**Objetivo:** Mejorar experiencia y productividad.

**Posibles funcionalidades:**

- Mejoras visuales.
- Mejor navegación.
- Exportación avanzada.
- Más reportes.
- Mejor historial.
- Optimización de cálculos.

---

## SGCC 1.5 — Automation Stage

**Objetivo:** Reducir tareas manuales.

**Funcionalidades previstas:**

### Gestión documental

- Adjuntar recibos.
- Almacenar documentos asociados.
- Historial documental.

### OCR

Extracción automática de datos desde recibos.

Ejemplos:

- Empresa proveedora.
- Periodo.
- Consumo.
- Importe.

### Automatización

- Generación automática de liquidaciones.
- Procesos recurrentes.
- Alertas básicas.

---

## SGCC 2.0 — Communication Stage

**Objetivo:** Facilitar la comunicación entre administradores e inquilinos.

**Funcionalidades previstas:**

### Portal del inquilino

Permitir consultar:

- Consumos.
- Liquidaciones.
- Historial.

### Comunicación

- Envío por correo.
- Integración con WhatsApp.
- Confirmación de recepción.

---

## SGCC 2.5 — Advanced Management

**Objetivo:** Convertir SGCC en una herramienta completa de administración.

**Posibles funcionalidades:**

- Gestión de contratos.
- Fechas de ocupación.
- Registro de pagos.
- Estado de cuentas.
- Gestión documental avanzada.

---

## SGCC 3.0 — Smart Management Platform

**Objetivo:** Agregar inteligencia y análisis.

**Funcionalidades previstas:**

### Analítica

- Tendencias de consumo.
- Comparativos históricos.
- Reportes avanzados.

### Inteligencia

- Predicción de consumo.
- Detección de anomalías.
- Alertas inteligentes.

Ejemplos:

- Consumo inusual.
- Posibles fugas.
- Variaciones significativas.

---

# 4. MVP Definition

El MVP de SGCC está definido como:

> Digitalizar completamente el proceso actual de registro de consumos y cálculo de montos a cobrar realizado mediante hojas de cálculo.

El MVP debe resolver:

```text
Recibo del proveedor
    ↓
Registro del consumo total
    ↓
Lecturas individuales
    ↓
Cálculo automático
    ↓
Liquidación por inquilino
```

---

# 5. Features Deferred

Las siguientes funcionalidades quedan explícitamente fuera del MVP:

- Pagos online.
- Aplicación móvil.
- IA.
- OCR.
- IoT.
- Integraciones externas.
- Comunicación automática.

Estas funcionalidades podrán incorporarse en versiones posteriores.

---

# 6. Roadmap Principles

El desarrollo del roadmap seguirá estas reglas:

1. Resolver primero problemas reales.
2. No agregar complejidad sin necesidad.
3. Mantener el núcleo del cálculo simple.
4. Priorizar estabilidad antes que cantidad de funcionalidades.
5. Evolucionar basado en uso real del producto.

---

# 7. Current Position

| Milestone | Status |
|---|---|
| Product Idea | ✓ |
| Scope Definition | ✓ |
| Product Blueprint | ✓ |
| Roadmap Definition | ✓ |
| Domain Discovery | Pending |
