# SGCC Frontend Refactor Plan

## Purpose

Este documento describe el plan de refactorización completo del frontend de SGCC, alineado con el sistema de diseño y las directrices de implementación del repositorio.

Se basa en:
- `frontend/SGCC_DESIGN.md`
- `docs/04-implementation/FRONTEND_GUIDELINES.md`

## Objetivos

1. Alinear el frontend con la guía de diseño y arquitectura.
2. Migrar los flujos CRUD a un patrón consistente de lista + drawer.
3. Mantener compatibilidad de rutas legacy cuando sea necesario.
4. Establecer una capa `core/` y una estrategia clara de `shared/`.
5. Añadir pruebas de frontend para los flujos críticos.
6. Eliminar componentes de página legacy luego de migrar su funcionalidad.

## Alcance

### Incluye
- Todas las features en `frontend/src/app/features`.
- Rutas, páginas, servicios, modelos y componentes compartidos.
- UX de tablas de datos, filtros y drawers de detalle/edición.
- Validación de build y pruebas de componentes/servicios.

### Excluye
- Cambios en backend o API.
- Nuevas funcionalidades de negocio.
- Infraestructura de despliegue.

## Fases

### Estado actual (progreso)

- Se extrajeron modelos para: receipts, meters, occupancies, properties, tenants, readings, settlements y units.
- Se actualizaron los servicios API de esas features para importar los tipos desde `models/`, re-exportarlos y usar `ApiBaseService<T>` donde aplica.
- Se creó la estructura de carpetas `models/` en las features mencionadas.
- Se añadió la carpeta `src/app/core/` con implementaciones iniciales: `core.providers.ts`, `http/error.interceptor.ts` y `services/api-base.service.ts` para centralizar lógica HTTP.
- Se añadieron componentes shared iniciales: `drawer-field` y `entity-drawer` para soportar el patrón list+drawer.
- `npm run build` pasa correctamente; el compilador Angular muestra advertencias (NG8011, NG8113) relacionadas con proyección de contenido y imports no usados en algunos componentes. Estas advertencias son no bloqueantes pero deben resolverse durante la fase de limpieza.
- Los cambios han sido commiteados y pusheados a la rama `main` (ver commit reciente). 

### Fase 1: Auditoría y diagnóstico

- Auditar rutas y páginas de cada feature.
- Documentar componentes legacy y dependencias cruzadas.
- Validar qué rutas deben conservar compatibilidad.


### Fase 2: Arquitectura común

- Crear `src/app/core/` con interceptores, guards y servicios globales.
- Estandarizar `shared/` para UI reutilizable.
- Evitar imports directos entre features.

### Fase 3: Modelos de dominio

- Añadir carpetas `models/` en cada feature.
- Centralizar tipos e interfaces de dominio.
- Refactorizar servicios y componentes para usar esos modelos.
- Extraer modelos para receipts, meters, occupancies, properties, tenants, readings, settlements y units.

### Fase 4: Migración de features

- Finalizar receipts como patrón canónico.
- Migrar a lista + drawer:
  - properties
  - tenants
  - services
  - meters
  - readings
  - settlements
  - units
  - occupancies
- Mantener rutas `new`, `:id`, `:id/edit` cuando apliquen.

### Fase 5: Limpieza y validación

- Eliminar componentes de página obsoletos.
- Limpiar imports y archivos huérfanos.
- Agregar tests de componente/servicio.
- Verificar `npm run build` y las rutas migradas.

## Plan de migración por feature

### Receipts
- List page con drawer es la entrada canónica.
- Eliminar `receipt-form.component.ts` y `receipt-detail.component.ts` después de consolidar la ruta.
- Preservar compatibilidad de rutas legacy.

### Properties
- Migrar `property-list`, `property-form`, `property-detail` a un solo flujo con drawer.

### Tenants
- Migrar `tenant-list`, `tenant-form`, `tenant-detail`.

### Services
- Migrar `service-list`, `service-form`, `service-detail`.

### Meters
- Migrar `meter-list`, `meter-form`, `meter-detail`.

### Readings
- Migrar `reading-list`, `reading-form`, `reading-detail`.

### Settlements
- Migrar `settlement-list`, `settlement-detail`.

### Units
- Migrar `unit-list`, `unit-form`, `unit-detail`.

### Occupancies
- Migrar `occupancy-list`, `occupancy-form`, `occupancy-detail`.

## Validación

- `npm run build` pasa.
- Las rutas existen y cargan los componentes esperados.
- Los drawers se abren para crear, ver y editar.
- Se conservan las rutas legacy si el módulo lo requiere.
- Al menos receipts y dos features adicionales tienen tests.

## Tareas de ejecución

- [x] Crear `models/` en features (receipts, meters, occupancies, properties, tenants, readings, settlements, units).
- [ ] Auditar el frontend (rutas y componentes) — en progreso.
- [ ] Crear `core/` (interceptores, guards, servicios globales).
- [ ] Migrar features a lista + drawer (prioridad: receipts, properties, tenants, services).
- [ ] Resolver advertencias Angular (content projection, imports) — revisar property-list, settlement-detail, reading-detail, meter-detail.
  - En progreso: se aplicaron cambios para mover texto fuera de bloques condicionales en property-list y settlement-detail para que únicamente los <mat-icon> estén dentro de los @if/@else (reduce NG8011). Ejecutar build y verificar advertencias restantes.

- [ ] Añadir tests de componente/servicio para receipts y al menos dos features adicionales.
- [ ] Limpiar y eliminar componentes legacy después de validar rutas.

Siguiente inmediato:

- Commit y push de los modelos y cambios en servicios.
- Crear tareas detalladas por feature en el tracker (todos) para la migración a lista+drawer.
- Priorizar resolver las advertencias Angular antes de eliminar componentes legacy.
