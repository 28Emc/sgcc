# SGCC Frontend Guidelines

## Document Information

| Attribute | Value |
|---|---|
| Product | SGCC |
| Full Name | Sistema de Gestión de Cobros y Consumos de Recibos |
| Document Type | Frontend Development Guidelines |
| Version | 1.0 |
| Status | Draft |
| Based On | Cloud Lab v1.0 |
| Framework | Angular 20+ |
| Language | TypeScript |
| Last Updated | 2026-07-21 |

---

# 1. Purpose

Este documento define los estándares técnicos para construir el frontend de SGCC.

El objetivo es mantener una aplicación:

- Modular.
- Escalable.
- Fácil de mantener.
- Alineada al dominio.
- Consistente con Cloud Lab.

---

# 2. Frontend Architecture

SGCC utilizará:

- Angular Standalone Architecture
- Feature Based Architecture
- Clean Architecture Principles

La organización estará basada en capacidades del negocio:

```text
features/
├── properties
├── tenants
├── services
├── meters
├── readings
├── receipts
├── settlements
└── reports
```

---

# 3. Project Structure

Estructura principal:

```text
src/app/
├── core/
├── shared/
├── layouts/
├── features/
├── infrastructure/
└── app.routes.ts
```

---

# 4. Core Layer

Responsabilidad: Contiene elementos globales de la aplicación.

Incluye:

- Authentication
- Guards
- Interceptors
- Configuration
- Global Services

Ejemplo:

```text
core/
├── auth/
├── guards/
├── interceptors/
├── services/
└── config/
```

Reglas:

- Core puede ser utilizado por cualquier feature.
- Features no deben depender entre sí.

---

# 5. Shared Layer

Responsabilidad: Componentes reutilizables sin lógica de negocio.

Incluye:

- UI Components
- Pipes
- Directives
- Utilities
- Form Controls

Ejemplo:

```text
shared/
├── components/
├── pipes/
├── directives/
└── utils/
```

Ejemplos:

- DataTableComponent
- ConfirmDialogComponent
- MoneyPipe
- LoadingComponent

---

# 6. Feature Architecture

Cada módulo funcional tendrá su propia estructura.

Ejemplo:

```text
settlements/
├── pages/
├── components/
├── services/
├── models/
├── state/
├── routes.ts
└── settlement.routes.ts
```

---

# 7. Pages

Responsabilidad: Representan pantallas completas.

Ejemplos:

- SettlementListPage
- SettlementDetailPage
- SettlementCreatePage

Regla: Las páginas coordinan componentes. No deben contener lógica compleja.

---

# 8. Components

Responsabilidad: Componentes visuales reutilizables.

Ejemplo:

- SettlementSummaryComponent
- SettlementTableComponent

Regla: Un componente debe tener una única responsabilidad.

---

# 9. Services

Responsabilidad: Comunicación con backend y lógica de aplicación del frontend.

Ejemplo:

- SettlementApiService

Los servicios manejarán:

- HTTP.
- Transformaciones.
- Comunicación externa.

Ejemplo:

```typescript
@Injectable()
export class SettlementApiService {

    getSettlements() {
        return this.http.get(...);
    }
}
```

---

# 10. State Management

Versión inicial: Angular Signals

Uso:

- Estado local: Signal
- Computed
- Effect

Ejemplo:

```typescript
settlements = signal<Settlement[]>([]);
```

No introducir NgRx inicialmente.

Evaluación futura cuando:

- Exista estado complejo.
- Existan múltiples flujos compartidos.

---

# 11. Models

Los modelos deben representar conceptos del dominio.

Ejemplo:

```typescript
// settlement.model.ts
export interface Settlement {
    id: string;
    tenantId: string;
    amount: number;
}
```

No utilizar modelos generados directamente desde API sin adaptación.

---

# 12. Forms Strategy

Se utilizará: Reactive Forms

Motivos:

- Validaciones complejas.
- Mejor mantenibilidad.
- Separación clara.

Ejemplos:

- CreateSettlementForm
- TenantForm
- ReadingForm

---

# 13. Routing

Se utilizará: Standalone Router

Ejemplo:

```typescript
{
  path: 'settlements',
  loadChildren: () =>
    import('./features/settlements/routes')
}
```

Las features deben cargar bajo demanda.

---

# 14. HTTP Communication

Comunicación:

```text
Angular
  ↓
REST API
  ↓
Spring Boot
```

Configuración:

- HttpClient
- Interceptors
- Typed Responses

---

# 15. Error Handling

Errores tratados mediante:

```text
Global HTTP Interceptor
    +
Feature Notifications
```

Ejemplos:

- Error de validación.
- Sesión expirada.
- Error servidor.

---

# 16. UI Guidelines

El frontend seguirá: Tailwind CSS + Angular Material

Principios:

- Diseño consistente.
- Componentes reutilizables.
- Responsive design.

---

# 17. Theme System

Debe utilizar: Design Tokens

Ejemplo:

- colors
- spacing
- typography
- radius

No utilizar valores hardcoded repetidos.

Incorrecto:

```css
color: #2563eb;
```

Correcto:

```css
var(--primary-color)
```

---

# 18. Internationalization

Preparado para: i18n

Aunque inicialmente Español será el idioma principal.

---

# 19. Testing Strategy

Tipos:

- Component Tests
- Service Tests
- Integration Tests

Prioridad:

- Servicios críticos.
- Formularios.
- Componentes complejos.

---

# 20. Frontend Quality Rules

Todo cambio debe cumplir:

- Componentes standalone.
- TypeScript strict mode.
- Sin duplicación.
- Documentación actualizada.
- Tests agregados cuando aplique.

---

# 21. Recommended Feature Example

Ejemplo:

```text
features/
└── settlements/
    ├── pages/
    │   └── settlement-list.page.ts
    ├── components/
    │   └── settlement-table.component.ts
    ├── services/
    │   └── settlement-api.service.ts
    ├── models/
    │   └── settlement.model.ts
    └── routes.ts
```

---

# 22. Status

| Milestone | Status |
|---|---|
| Frontend Architecture | ✓ |
| Implementation Rules | ✓ |
| Coding | Pending |
