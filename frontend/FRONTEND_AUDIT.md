# Frontend Audit Report

## Purpose

Este documento captura el estado actual del frontend de SGCC antes de la refactorización completa. Sirve como referencia para el equipo y otros agentes que avancen en la migración.

## Context

- El frontend está organizado bajo `frontend/src/app/features`.
- Existe un archivo de diseño UI en `frontend/SGCC_DESIGN.md`.
- Existe una guía de implementación en `docs/04-implementation/FRONTEND_GUIDELINES.md`.
- La migración de recibos ya fue iniciada y el patrón de lista + drawer debe ser la referencia.

## Hallazgos clave

### 1. Estado de las features

- `dashboard`: no tiene módulo de rutas propio; carga directamente el componente dashboard en `app.routes.ts`.
- `properties`: listado, formulario y detalle en páginas separadas; rutas solo `''`.
- `tenants`: listado, formulario y detalle; rutas solo `''`.
- `services`: listado, formulario y detalle; rutas solo `''`.
- `meters`: listado, formulario, detalle; rutas `''`, `new`, `:id`, `:id/edit`.
- `readings`: listado, formulario, detalle; rutas `''`, `new`, `:id`, `:id/edit`.
- `receipts`: listado, formulario, detalle; rutas `''`, `new`, `:id/edit`, `:id`.
- `settlements`: listado, detalle; rutas `''`, `:id`.
- `units`: listado, formulario, detalle; rutas `''`.
- `occupancies`: listado, formulario, detalle; rutas `''`.

### 2. Patrones de ruta actuales

- Solo `meters`, `readings`, `receipts` y `settlements` definen rutas con parámetros adicionales.
- Las demás features cargan un único `path: ''` por feature.
- El `dashboard` se carga directamente desde `app.routes.ts`.

### 3. Estado de la migración de recibos

- `frontend/src/app/features/receipts/receipts.routes.ts` ya redirige todas las rutas de recibos a `receipt-list.component.ts`.
- El componente de lista implementa estado de drawer para crear/ver/editar.
- Existen componentes legacy aun no migrados: `receipt-form.component.ts` y `receipt-detail.component.ts`.

### 4. Dependencias cruzadas entre features

Las reglas de `FRONTEND_GUIDELINES.md` piden que las features no dependan entre sí. Actualmente hay acoplamientos explícitos:

- `dashboard` importa servicios de `properties`, `tenants`, `meters`, `settlements`.
- `receipts` importa servicios de `services` y `settlements`.
- `settlements` importa servicios de `receipts`, `properties`, `tenants`, `readings`, `meters`.
- `meters` importa servicios de `services`, `units`, `readings`.
- `readings` importa servicios de `meters`.
- `properties` importa servicios de `units`.
- `units` importa servicios de `properties`.
- `occupancies` importa servicios de `tenants` y `units`.

Esto indica que algunas features comparten datos y pueden necesitar una capa de servicios compartidos o mejor separación de modelos.

### 5. Ausencia de `core/` y `models/`

- No existe un directorio `src/app/core` con infraestructura global, interceptores o guards.
- No existen carpetas `models/` dentro de cada feature, aunque el diseño lo recomienda.

### 6. Testing

- Solo existe un único archivo de pruebas en `frontend/src/app/features/properties/pages/property-list/property-list.component.spec.ts`.
- No hay pruebas para los flujos de recibos ni para las otras features.

## Recomendaciones inmediatas

1. Consolidar los puntos de entrada de ruta para las features que todavía usan páginas separadas.
2. Establecer `core/` para evitar imports directos entre features cuando se necesiten servicios globales.
3. Usar `models/` dentro de cada feature para centralizar tipos de dominio.
4. Terminar la migración de `receipts` y eliminar los componentes legacy una vez validado el comportamiento.
5. Migrar progresivamente las features restantes al patrón lista + drawer.
6. Añadir tests para el flujo de recibos y al menos dos features adicionales.

## Detalle por feature

### meters
- Pages: `meter-list`, `meter-form`, `meter-detail`
- Routes: `''`, `new`, `:id`, `:id/edit`
- Service: `meter-api.service.ts`
- Importa servicios de: `services`, `units`, `readings`

### occupancies
- Pages: `occupancy-list`, `occupancy-form`, `occupancy-detail`
- Routes: `''`
- Service: `occupancy-api.service.ts`
- Importa servicios de: `tenants`, `units`

### properties
- Pages: `property-list`, `property-form`, `property-detail`
- Routes: `''`
- Service: `property-api.service.ts`
- Importa servicios de: `units`

### readings
- Pages: `reading-list`, `reading-form`, `reading-detail`
- Routes: `''`, `new`, `:id`, `:id/edit`
- Service: `reading-api.service.ts`
- Importa servicios de: `meters`

### receipts
- Pages: `receipt-list`, `receipt-form`, `receipt-detail`
- Routes: `''`, `new`, `:id/edit`, `:id`
- Service: `receipt-api.service.ts`
- Importa servicios de: `services`, `settlements`

### services
- Pages: `service-list`, `service-form`, `service-detail`
- Routes: `''`
- Service: `service-api.service.ts`

### settlements
- Pages: `settlement-list`, `settlement-detail`
- Routes: `''`, `:id`
- Service: `settlement-api.service.ts`
- Importa servicios de: `receipts`, `properties`, `tenants`, `readings`, `meters`

### tenants
- Pages: `tenant-list`, `tenant-form`, `tenant-detail`
- Routes: `''`
- Service: `tenant-api.service.ts`

### units
- Pages: `unit-list`, `unit-form`, `unit-detail`
- Routes: `''`
- Service: `unit-api.service.ts`
- Importa servicios de: `properties`

## Next step

Avanzar al refactor de la capa común (`core/`) y la migración de `receipts` a una implementación totalmente consolidada, usando esta auditoría como referencia.
