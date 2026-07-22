# SGCC Frontend Implementation Plan

## Document Information

| Attribute | Value |
|---|---|
| Product | SGCC |
| Full Name | Sistema de Gestión de Cobros y Consumos de Recibos |
| Document Type | Frontend Implementation Plan |
| Version | 1.0 |
| Status | Draft |
| Based On | Cloud Lab v1.0 |
| Framework | Angular 20+ |
| UI Stack | Angular Material + Tailwind CSS |
| Architecture | Feature Based + Clean Architecture Principles |
| Last Updated | 2026-07-21 |

---

## 1. Purpose

Este documento define el plan técnico para construir el frontend Angular de SGCC.

El objetivo es permitir que un desarrollador o agente IA pueda crear la aplicación respetando:

- Arquitectura frontend definida.
- Design system de Cloud Lab.
- Separación por features.
- Convenciones Angular modernas.

---

## 2. Frontend Application Definition

SGCC frontend será:

- Angular Standalone Application
- Feature Based Architecture
- Signals State Management
- Angular Material
- Tailwind CSS

---

## 3. Initial Project Configuration

### Application

Nombre:

```
sgcc-web
```

---

### Framework

```
Angular 20+
```

---

### Language

```
TypeScript Strict Mode
```

---

### Rendering

Inicialmente:

> CSR (Client Side Rendering)

---

## 4. Workspace Creation

Comando base:

```bash
ng new sgcc-web
```

Configuración:

- Standalone Components: YES
- Routing: YES
- SCSS: YES
- Strict Mode: YES

---

## 5. Required Dependencies

### Angular Material

Uso:

- UI Components
- Dialogs
- Tables
- Forms
- Navigation

---

### Tailwind CSS

Uso:

- Layout
- Spacing
- Responsive Design
- Utility Classes

---

### Additional Packages

Inicialmente:

- `rxjs`
- `date-fns`
- `uuid`

---

## 6. Application Structure

Estructura:

```
src/app/
├── core/
├── shared/
├── layouts/
├── features/
├── infrastructure/
├── app.routes.ts
└── app.config.ts
```

---

## 7. Core Layer

Responsabilidad:

> Servicios globales.

Estructura:

```
core/
├── auth/
├── guards/
├── interceptors/
├── services/
└── config/
```

---

Implementación inicial:

- `AuthService`
- `TokenInterceptor`
- `ErrorInterceptor`
- `EnvironmentService`

---

## 8. Shared Layer

Responsabilidad:

> Elementos reutilizables.

Estructura:

```
shared/
├── components/
├── directives/
├── pipes/
├── models/
└── utils/
```

---

Componentes iniciales:

- `LoadingSpinnerComponent`
- `ConfirmDialogComponent`
- `EmptyStateComponent`
- `PageHeaderComponent`

---

## 9. Layout Architecture

Estructura:

```
layouts/
├── main-layout/
├── auth-layout/
└── components/
```

---

Main Layout:

Contendrá:

- Sidebar
- Navbar
- Content Area

---

## 10. Feature Implementation Order

La implementación seguirá dependencia funcional.

Orden:

```
1. Core
      ↓
2. Shared
      ↓
3. Layout
      ↓
4. Property
      ↓
5. Tenant
      ↓
6. Service
      ↓
7. Meter
      ↓
8. Reading
      ↓
9. Receipt
      ↓
10. Settlement
      ↓
11. Reports
```

---

## 11. Property Feature

Ruta:

```
/properties
```

Estructura:

```
features/property/
├── pages/
├── components/
├── services/
├── models/
└── routes.ts
```

---

Pantallas:

- `PropertyListPage`
- `PropertyDetailPage`
- `PropertyFormPage`

---

## 12. Tenant Feature

Ruta:

```
/tenants
```

Pantallas:

- `TenantListPage`
- `TenantFormPage`
- `OccupancyManagementPage`

---

## 13. Meter Feature

Ruta:

```
/meters
```

Pantallas:

- `MeterListPage`
- `MeterFormPage`
- `ReadingHistoryPage`

---

## 14. Reading Feature

Ruta:

```
/readings
```

Pantallas:

- `ReadingRegisterPage`
- `ReadingHistoryPage`

---

Validación:

No permitir:

```
lectura actual < lectura anterior
```

---

## 15. Receipt Feature

Ruta:

```
/receipts
```

Pantallas:

- `ReceiptListPage`
- `ReceiptRegisterPage`
- `ReceiptDetailPage`

---

## 16. Settlement Feature

Ruta:

```
/settlements
```

> Módulo principal.

Pantallas:

- `SettlementGeneratorPage`
- `SettlementListPage`
- `SettlementDetailPage`
- `AdjustmentDialog`

---

## 17. State Management

Versión inicial:

> Angular Signals

Ejemplo:

```typescript
settlements = signal<Settlement[]>([]);
```

---

No implementar:

> NgRx en versión inicial.

---

## 18. API Communication

Cada feature tendrá:

```
FeatureApiService
```

Ejemplo:

```
SettlementApiService
```

Responsabilidad:

- HTTP requests.
- Mapping DTO.
- Error handling.

---

## 19. Forms

Tecnología:

> Reactive Forms

Formularios iniciales:

- `PropertyForm`
- `TenantForm`
- `MeterForm`
- `ReadingForm`
- `ReceiptForm`

---

## 20. UI Guidelines

Todos los componentes deben usar:

```
Angular Material + Tailwind utilities
```

Evitar:

- CSS duplicado.
- Estilos inline excesivos.
- Componentes gigantes.

---

## 21. Testing Strategy

Testing inicial:

- Component Tests
- Service Tests
- Route Tests

---

Prioridad:

**Alta:**

- Settlement
- Reading
- Receipt

---

## 22. Initial Frontend Deliverable

Debe incluir:

- Angular workspace + Theme configured
- Main layout + Routing
- Authentication placeholder
- First feature implemented

---

## 23. Acceptance Criteria

Frontend aceptado cuando:

- Ejecuta localmente.
- Consume API.
- Tiene navegación funcional.
- Usa arquitectura definida.
- Tiene pruebas básicas.
- Respeta design system.

---

## 24. Status

| Item | Status |
|---|---|
| Frontend Plan | ✓ |
| Implementation Ready | Pending |
