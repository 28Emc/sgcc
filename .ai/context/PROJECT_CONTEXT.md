# SGCC Project Context

## Project Identity

| Attribute | Value |
|---|---|
| Project Name | SGCC |
| Full Name | Sistema de Gestion de Cobros y Consumos de Recibos |
| Version | 0.1.0-SNAPSHOT |
| Status | Phase 0 Complete - Foundation Ready |
| Platform | Cloud Lab v1.0 |
| Product Type | Web Application |
| Architecture Style | Modular Monolith |
| License | MIT |
| Last Updated | 2026-07-21 |

---

# 1. Project Overview

SGCC es una aplicación web orientada a automatizar la gestión de cobros y consumos de servicios compartidos.

El sistema nace a partir de una necesidad real:

Administrar consumos individuales de múltiples inquilinos que comparten una misma dirección y distribuir correctamente los costos de servicios como:

- Electricidad.
- Agua.
- Gas.
- Otros servicios medibles.

---

# 2. Core Problem

Actualmente el proceso se realiza manualmente mediante hojas de cálculo.

El proceso actual:

1. Registrar lecturas de medidores.
2. Calcular diferencia de consumo.
3. Registrar importe del recibo.
4. Calcular valor unitario.
5. Distribuir costo por inquilino.
6. Comunicar monto final.

SGCC automatiza este flujo.

---

# 3. Business Rules

Estas reglas son críticas.

NO modificar sin aprobación.

---

## Consumption Calculation

Fórmula:

consumo =
lectura_actual -
lectura_anterior

Ejemplo:

11110 - 11095 = 15 kWh

---

## Unit Value Calculation

Fórmula:

valor_unitario =
importe_recibo /
consumo_total_recibo

Ejemplo:

475 / 584 = 0.81

---

## Tenant Settlement

Fórmula:

total_inquilino =
consumo_inquilino *
valor_unitario

Ejemplo:

15 * 0.81 = 12.15

---

# 4. Business Constraints

## Empty Unit

Si una habitación no tiene inquilino:

No generar cobro

---

## No Fixed Charges

SGCC v1.0:

NO contempla:

- alquiler.
- mantenimiento.
- cargos administrativos.
- impuestos.

Solo servicios consumidos.

---

## Manual Adjustments

Los ajustes manuales están permitidos.

Motivos:

- Diferencia de redondeo.
- Ajuste voluntario.
- Corrección autorizada.

Siempre deben quedar registrados.

---

# 5. Product Vision

SGCC evolucionará desde un calculador simple hacia una plataforma completa de administración de consumos compartidos.

Evolución esperada:

MVP

↓

Gestión completa de propiedades

↓

Historial de consumos

↓

Reportes

↓

Notificaciones

↓

Portal de inquilinos

---

# 6. Technical Vision

SGCC v1.0 utilizará:

Modular Monolith

Clean Architecture

DDD

REST API

---

# 7. Backend Context

Tecnologías:

Java 21

Spring Boot 3

Gradle

PostgreSQL

Flyway

Spring Security

JWT

---

# 8. Frontend Context

Tecnologías:

Angular 20+

Standalone Components

TypeScript Strict

Angular Material

Tailwind CSS

Signals

---

# 9. Domain Modules

Módulos iniciales:

shared

property

tenant

service

meter

reading

receipt

settlement

reporting

---

# 10. Architectural Rules

Siempre respetar:

Domain

↓

Application

↓

Infrastructure

↓

Presentation

---

El dominio:

NO debe conocer:

- Spring.
- JPA.
- HTTP.
- Angular.

---

# 11. Development Philosophy

Prioridades:

1. Correctitud del negocio.
2. Simplicidad.
3. Mantenibilidad.
4. Evolución futura.

---

Evitar:

- Complejidad prematura.
- Arquitecturas distribuidas.
- Dependencias innecesarias.

---

# 12. AI Agent Instructions

Cuando trabajes en SGCC:

Debes:

- Leer este archivo primero.
- Leer documentación relacionada.
- Respetar decisiones existentes.
- Proponer cambios mediante ADR.

---

No debes:

- Cambiar stack.
- Crear microservicios.
- Introducir patrones complejos sin necesidad.
- Modificar reglas de negocio.

---

# 13. Documentation Source Order

Orden de lectura:

.ai/context/

↓

docs/00-product

↓

docs/01-domain

↓

docs/02-architecture

↓

docs/03-development

↓

docs/04-implementation

↓

docs/05-engineering

---

# 14. Current Development Phase

Estado:

Phase 0 - Complete

Project Initialization

---

Objetivo inmediato:

Crear:

Repository ✓

Backend Skeleton ✓

Frontend Skeleton ✓

Database Setup ✓

Initial CI ✓

---

# 15. First Milestone

Nombre:

SGCC Foundation Release

Incluye:

- Proyecto compilable ✓
- Base de datos funcionando (migraciones creadas) ✓
- Arquitectura creada ✓
- Primer módulo implementado ✓
- Pipeline inicial ✓

---

# 16. Future Improvements

Ideas futuras:

Dashboard

Exportación PDF

Correo automático

WhatsApp integration

Multi-property management

Mobile application

Advanced reporting

---

# 17. Project Status

Context Defined ✓

Architecture Defined ✓

Engineering Defined ✓

Implementation Ready ✓

Phase 0 Complete ✓
