# SGCC — Frontend Design & Architecture Reference

> Versión: 2.0 (implementación)
> Producto: SGCC — Sistema de Gestión de Cobros y Consumos de Recibos
> Base de diseño: Material Design 3 sobre Angular Material 18.2
> Última actualización: 2026-07-24

---

## 0. Cómo usar este documento

Este documento reemplaza al `SGCC Design System v1.0` como fuente única de verdad para construir el frontend **desde cero**. A diferencia de la v1.0 (que definía principios e intención de marca sin valores concretos), este documento entrega:

- Tokens de diseño con valores reales (no placeholders).
- Contratos de datos reales, derivados del OpenAPI del backend.
- Arquitectura de carpetas y patrones de Angular 18.2 listos para copiar.
- Una sección explícita de **decisiones abiertas** que dependen de que confirmes o ajustes el backend.

Cualquier agente de IA o desarrollador que genere código para SGCC debe leer este archivo completo antes de crear una pantalla.

---

## 1. Contexto de producto

SGCC automatiza la distribución de consumos compartidos (luz, agua, gas) entre inquilinos que comparten una misma propiedad, reemplazando un proceso manual en hojas de cálculo.

**Fórmulas de negocio (no modificar sin aprobación):**

```
consumo         = lectura_actual - lectura_anterior
valor_unitario  = importe_recibo / consumo_total_recibo
total_inquilino = consumo_inquilino * valor_unitario
```

**Reglas de negocio:**
- Una unidad (`Unit`) sin inquilino activo (`Occupancy`) no genera cobro.
- v1.0 no contempla cargos fijos (alquiler, mantenimiento, impuestos) — solo servicios consumidos.
- Los ajustes manuales (`Settlement.adjustmentAmount`) están permitidos pero siempre deben quedar registrados con motivo (`AdjustmentRequest.reason`).

**Arquitectura backend (para contexto, no la construye el frontend):** Modular Monolith + Clean Architecture + DDD, Java 21 / Spring Boot 3.3.2 / PostgreSQL 16, expuesto como REST API en `/api/v1`.

---

## 2. Stack de frontend

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Angular (Standalone Components) | 18.2 |
| Lenguaje | TypeScript (strict mode) | — |
| Componentes UI | Angular Material (M3 estable) | 18.2 |
| Utilidades CSS | Tailwind CSS | 3.4 |
| Estado | Angular Signals (sin NgRx) | nativo |
| HTTP | `HttpClient` + interceptors funcionales | nativo |

> **Nota sobre versión:** Angular 22 es la versión estable actual (jul-2026) y Angular 18 ya no recibe soporte activo. Este documento asume que te quedas en 18.2 porque el skeleton de Fase 0 ya compila y sirve sobre esa versión. Si decides migrar antes de escribir features, la sintaxis de standalone components y signals de este documento es compatible hacia adelante — solo cambiarían utilidades nuevas (ej. Signal Forms) que aquí no se usan.

No se usa NgRx ni ningún state manager externo: la filosofía de desarrollo del proyecto prioriza simplicidad y evitar complejidad prematura, y con Signals + servicios por dominio es suficiente para el volumen de datos de SGCC v1.

---

## 3. Principios de diseño (heredados del Design System v1.0)

SGCC se comporta como un centro de operaciones empresarial, no como un producto de consumo.

**Es:** eficiente, preciso, confiable, estructurado, profesional, orientado a datos, claro.
**No es:** juguetón, decorativo, experimental, cargado de emoción, orientado a marketing.

**Prioridades al generar UI (en orden):**
1. Eficiencia operativa
2. Legibilidad de datos
3. Navegación y finalización de tareas rápida
4. Consistencia entre módulos
5. Respetar Material Design 3

Cuando dos decisiones de diseño entran en conflicto, **la eficiencia gana sobre la decoración.**

**Inspiración:** Datadog (visibilidad operativa, densidad de datos), Azure Portal (navegación enterprise), Dynamics 365 (flujos CRUD).

**Anti-patrones prohibidos:** reemplazar tablas por cards en datasets grandes, dashboards decorativos, ocultar acciones primarias en menús, CRUD inconsistente entre módulos, flujos complejos dentro de diálogos.

---

## 4. Design Tokens

### 4.1 Color — Light mode

Paleta derivada del isotipo oficial (degradado teal → verde). El teal oscuro se usa como `primary` (ya transmite la seriedad/confianza que pedía la v1.0); el verde del logo se reserva como `secondary` y como base del token `success`, manteniéndolos como tokens distintos para no mezclar "marca" con "estado".

```scss
// tokens/_colors-light.scss

// Primary (teal del isotipo)
--sgcc-primary:                #15455B;
--sgcc-on-primary:             #FFFFFF;
--sgcc-primary-container:      #D6E7EC;
--sgcc-on-primary-container:   #072430;

// Secondary (verde del isotipo)
--sgcc-secondary:               #4A7A3E;  // uso en texto/iconos (cumple contraste AA sobre blanco)
--sgcc-secondary-accent:        #76A753;  // uso solo en superficies grandes/ilustración, NO en texto pequeño
--sgcc-on-secondary:            #FFFFFF;
--sgcc-secondary-container:     #E1EEDA;
--sgcc-on-secondary-container:  #16290F;

// Superficies
--sgcc-background:              #F5F7F8;
--sgcc-surface:                 #FFFFFF;
--sgcc-surface-container:       #EEF2F3;
--sgcc-surface-container-high:  #E4E9EB;
--sgcc-outline:                 #C7D0D3;
--sgcc-on-surface:              #1A2327;
--sgcc-on-surface-variant:      #4B5A60;

// Semántico — SIEMPRE acompañado de texto/ícono, nunca solo color
--sgcc-success:                 #2E7D32;
--sgcc-on-success:              #FFFFFF;
--sgcc-warning:                 #B7791F;
--sgcc-on-warning:              #FFFFFF;
--sgcc-error:                   #B3261E;
--sgcc-on-error:                #FFFFFF;
--sgcc-info:                    #0B6FA4;
--sgcc-on-info:                 #FFFFFF;
```

### 4.2 Color — Dark mode

```scss
// tokens/_colors-dark.scss

--sgcc-primary:                 #7FB6CC;
--sgcc-on-primary:              #063142;
--sgcc-primary-container:       #0D3C4F;
--sgcc-on-primary-container:    #C8E6F0;

--sgcc-secondary:               #9CC98B;
--sgcc-secondary-accent:        #76A753;
--sgcc-on-secondary:            #1B3712;
--sgcc-secondary-container:     #274420;
--sgcc-on-secondary-container:  #DCEEDA;

--sgcc-background:              #0E1417;
--sgcc-surface:                 #161F23;
--sgcc-surface-container:       #1D282D;
--sgcc-surface-container-high:  #26333A;
--sgcc-outline:                 #3A484E;
--sgcc-on-surface:              #E4E9EB;
--sgcc-on-surface-variant:      #A9B7BC;

--sgcc-success:                 #7FCB92;
--sgcc-on-success:              #0B3813;
--sgcc-warning:                 #E3B664;
--sgcc-on-warning:              #3D2B02;
--sgcc-error:                   #F2B8B5;
--sgcc-on-error:                #601410;
--sgcc-info:                    #7FC1E8;
--sgcc-on-info:                 #063049;
```

> **Regla no negociable heredada de la v1.0:** el color nunca comunica estado solo — siempre va acompañado de texto y/o ícono (ver `Status Chip`, sección 7.3). Nunca uses `--sgcc-background` puro negro; ya está evitado arriba.

### 4.3 Tipografía

Fuente primaria **Inter**, fallback `Roboto, system-ui, Arial, sans-serif`.

La escala se ajusta **por debajo** de los tamaños base de Material 3 (que están pensados para apps de consumo) porque la Prioridad 2 del producto es legibilidad/densidad de datos, siguiendo el patrón Datadog de UI compacta:

| Rol | Tamaño | Line-height | Peso | Uso |
|---|---|---|---|---|
| Display | 32px | 40px | 600 | Dashboards ejecutivos (uso raro) |
| Headline | 24px | 32px | 600 | Títulos de página, métricas principales |
| Title Large | 18px | 24px | 600 | Secciones, paneles |
| Title Medium | 16px | 22px | 500 | Entidades, sub-secciones |
| Body | 14px | 20px | 400 | Descripciones, contenido de tablas |
| Body Small | 12px | 16px | 400 | Texto secundario |
| Label | 13px | 16px | 500 | Botones, filtros, encabezados de columna |
| Caption | 11px | 14px | 400 | Metadatos, fechas, identificadores |

```scss
// tokens/_typography.scss
--sgcc-font-family: 'Inter', Roboto, system-ui, Arial, sans-serif;

--sgcc-type-display:      600 32px/40px var(--sgcc-font-family);
--sgcc-type-headline:     600 24px/32px var(--sgcc-font-family);
--sgcc-type-title-lg:     600 18px/24px var(--sgcc-font-family);
--sgcc-type-title-md:     500 16px/22px var(--sgcc-font-family);
--sgcc-type-body:         400 14px/20px var(--sgcc-font-family);
--sgcc-type-body-sm:      400 12px/16px var(--sgcc-font-family);
--sgcc-type-label:        500 13px/16px var(--sgcc-font-family);
--sgcc-type-caption:      400 11px/14px var(--sgcc-font-family);
```

### 4.4 Espaciado

Unidad base: 8px. Escala permitida: `4, 8, 12, 16, 24, 32, 40, 48, 64` (px).

```scss
// tokens/_spacing.scss
--sgcc-space-1: 4px;
--sgcc-space-2: 8px;
--sgcc-space-3: 12px;
--sgcc-space-4: 16px;
--sgcc-space-6: 24px;
--sgcc-space-8: 32px;
--sgcc-space-10: 40px;
--sgcc-space-12: 48px;
--sgcc-space-16: 64px;
```

### 4.5 Forma (border-radius)

```scss
--sgcc-radius-sm: 8px;
--sgcc-radius-md: 12px;
--sgcc-radius-lg: 16px;
--sgcc-radius-xl: 24px;
```

Evitar radios mayores — SGCC debe sentirse estructurado, no un producto de consumo.

### 4.6 Elevación

Usar las clases de elevación de Angular Material (`mat-elevation-zN`) según esta tabla:

| Elemento | Nivel |
|---|---|
| Background | 0 |
| Cards | 1 |
| Paneles | 1 |
| Drawers | 3 |
| Diálogos | 4 |

### 4.7 Movimiento

```scss
--sgcc-motion-fast: 150ms;
--sgcc-motion-base: 200ms;
--sgcc-motion-slow: 250ms;
--sgcc-motion-easing: cubic-bezier(0.2, 0, 0, 1); // M3 standard easing
```

Permitido: apertura de drawers, actualización de tablas, filtrado, feedback de guardado, transiciones de navegación. Evitar animaciones decorativas o de "atención".

### 4.8 Breakpoints

```scss
// tokens/_breakpoints.scss
--sgcc-bp-mobile: 480px;
--sgcc-bp-tablet: 768px;
--sgcc-bp-desktop: 1280px;
--sgcc-bp-wide: 1600px;
```

Estrategia **desktop-first**: tablas grandes, paneles múltiples y filtrado avanzado son el caso principal. Mobile se limita a operaciones críticas (ej. registrar una lectura de medidor en campo) — nunca forzar un flujo CRUD complejo a mobile.

---

## 5. Arquitectura de la aplicación Angular

### 5.1 Estructura de carpetas

Alineada 1:1 a los módulos de dominio del backend, para que cualquier desarrollador reconozca el mismo vocabulario en ambos lados.

```
src/
├── app/
│   ├── core/                          # transversal, un solo módulo
│   │   ├── http/
│   │   │   ├── auth.interceptor.ts
│   │   │   ├── error.interceptor.ts
│   │   │   └── api-config.ts
│   │   ├── guards/
│   │   └── models/
│   │       └── api-error.model.ts
│   │
│   ├── shared/                        # componentes reutilizables (sección 7)
│   │   ├── data-table/
│   │   ├── kpi-card/
│   │   ├── status-chip/
│   │   ├── detail-drawer/
│   │   └── form-controls/
│   │
│   ├── layout/
│   │   ├── app-shell/
│   │   ├── header/
│   │   └── sidenav/
│   │
│   ├── features/                      # un folder por módulo de dominio
│   │   ├── dashboard/
│   │   ├── properties/
│   │   │   ├── data/
│   │   │   │   ├── property.model.ts
│   │   │   │   └── property.service.ts
│   │   │   ├── property-list/
│   │   │   ├── property-detail/
│   │   │   └── properties.routes.ts
│   │   ├── units/
│   │   ├── tenants/
│   │   ├── occupancies/
│   │   ├── meters/
│   │   ├── services/                  # catálogo de servicios (luz/agua/gas)
│   │   ├── readings/
│   │   ├── receipts/
│   │   └── settlements/
│   │
│   ├── app.routes.ts
│   └── app.config.ts
│
├── styles/
│   ├── tokens/                        # sección 4
│   └── theme.scss                     # tema Angular Material M3
│
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

Cada `feature/*` sigue el mismo esqueleto que `properties/` de arriba. Esto es intencional: es el mismo patrón CRUD de la sección 8 replicado en código.

### 5.2 Patrón de estado (Signals, sin NgRx)

Cada feature expone un servicio con signals — sin librerías externas de estado:

```typescript
// features/properties/data/property.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Property, CreatePropertyRequest, UpdatePropertyRequest } from './property.model';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private readonly baseUrl = '/api/v1/properties';

  private readonly _items = signal<Property[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly items = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isEmpty = computed(() => !this._loading() && this._items().length === 0);

  constructor(private http: HttpClient) {}

  load(): void {
    this._loading.set(true);
    this._error.set(null);
    this.http.get<Property[]>(this.baseUrl).subscribe({
      next: (data) => { this._items.set(data); this._loading.set(false); },
      error: (err) => { this._error.set(err.message); this._loading.set(false); },
    });
  }

  create(request: CreatePropertyRequest) {
    return this.http.post<Property>(this.baseUrl, request);
  }

  update(id: string, request: UpdatePropertyRequest) {
    return this.http.put<Property>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
```

Este mismo patrón (`items` / `loading` / `error` / `isEmpty` como signals) se replica para los 9 módulos — es lo que alimenta directamente los estados `loadingState` / `emptyState` / `errorState` que exige el `DataTable` (sección 7.1).

### 5.3 Ruteo

Lazy loading con standalone routes, un archivo `.routes.ts` por feature:

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.routes') },
      { path: 'properties', loadChildren: () => import('./features/properties/properties.routes') },
      { path: 'units', loadChildren: () => import('./features/units/units.routes') },
      { path: 'tenants', loadChildren: () => import('./features/tenants/tenants.routes') },
      { path: 'occupancies', loadChildren: () => import('./features/occupancies/occupancies.routes') },
      { path: 'meters', loadChildren: () => import('./features/meters/meters.routes') },
      { path: 'services', loadChildren: () => import('./features/services/services.routes') },
      { path: 'readings', loadChildren: () => import('./features/readings/readings.routes') },
      { path: 'receipts', loadChildren: () => import('./features/receipts/receipts.routes') },
      { path: 'settlements', loadChildren: () => import('./features/settlements/settlements.routes') },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
```

### 5.4 Theming (Angular Material M3 + tokens)

```scss
// styles/theme.scss
@use '@angular/material' as mat;
@use './tokens/colors-light' as light;
@use './tokens/colors-dark' as dark;

$sgcc-primary-palette: mat.$blue-palette; // reemplazar por palette custom generada desde --sgcc-primary
$sgcc-theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: $sgcc-primary-palette,
  ),
  typography: (
    brand-family: 'Inter',
  ),
  density: (
    scale: -1, // clave: densidad reducida para tablas de datos enterprise
  ),
));

html {
  @include mat.all-component-themes($sgcc-theme);
}
```

> Usar `density: -1` (o `-2` en tablas muy densas) es la forma "oficial" de M3 en Angular Material de lograr la densidad tipo Datadog sin pelear contra el sistema de componentes — evita el anti-patrón "nunca rediseñar componentes Material sin justificación" de la sección 3.

---

## 6. Capa de integración con la API

### 6.1 Configuración base

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api/v1',
};
```

### 6.2 Autenticación — ⚠️ DECISIÓN ABIERTA

El backend usa Spring Security con **HTTP Basic**, pero el spec OpenAPI no declara `securitySchemes`. Este documento asume el patrón más simple mientras se confirma:

```typescript
// core/http/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../auth/auth.store'; // por crear

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthStore);
  const credentials = auth.basicAuthHeader(); // btoa(`${user}:${pass}`)
  if (!credentials) return next(req);
  return next(req.clone({ setHeaders: { Authorization: `Basic ${credentials}` } }));
};
```

**Antes de construir el módulo de login real**, confirmar con backend: ¿las credenciales se piden en cada sesión de navegador (guardadas en memoria, nunca en localStorage), o hay planeado un cambio a sesión/JWT? Este documento recomienda **no persistir credenciales Basic en `localStorage`** por seguridad — mantenerlas solo en memoria (signal) durante la sesión del tab.

### 6.3 Manejo de errores — ⚠️ SUPUESTO A VALIDAR

El spec no documenta respuestas 4xx/5xx. Se asume el formato por defecto de Spring Boot hasta confirmar lo contrario:

```typescript
// core/models/api-error.model.ts
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
```

```typescript
// core/http/error.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((err) => {
      // mapear err.error (ApiError) al errorState del DataTable / formularios
      return throwError(() => err);
    }),
  );
```

Mensajes de error en UI siguen la regla de la sección 3: nunca stack traces ni excepciones técnicas — responder qué pasó, por qué importa, qué puede hacer el usuario (ej. "No se pudo guardar la lectura. El medidor no existe o fue eliminado.").

### 6.4 Paginación — ⚠️ DECISIÓN ABIERTA

Todos los `GET /api/v1/{recurso}` del backend devuelven **arrays planos sin metadata de paginación** (`page`, `size`, `totalElements`). El `DataTable` de la sección 7.1 exige paginación como capability obligatoria — hasta que el backend la implemente server-side, este documento define **paginación client-side**:

```typescript
// shared/data-table/paginate.util.ts
export function paginate<T>(items: T[], pageIndex: number, pageSize: number): T[] {
  const start = pageIndex * pageSize;
  return items.slice(start, start + pageSize);
}
```

Esto es aceptable para volúmenes de MVP (una propiedad con pocos inquilinos), pero **no escala** — si el catálogo de `readings` o `settlements` crece (lecturas mensuales por medidor, histórico), hay que priorizar paginación real en el backend (`Pageable` de Spring Data) antes de producción.

### 6.5 Modelos de dominio (TypeScript)

Generados desde el OpenAPI real del backend. `camelCase` en todo el payload, `id` asumido `UUID` (a confirmar), fechas `date-time` ISO para auditoría y `date` simple para lecturas/ocupaciones.

```typescript
// shared/models/common.model.ts
export type EntityStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface AuditFields {
  id: string;
  createdAt: string;  // ISO date-time
  updatedAt: string;  // ISO date-time
}
```

```typescript
// features/properties/data/property.model.ts
export interface Property extends AuditFields {
  name: string;
  address: string;
  description?: string;
  status: EntityStatus;
}
export interface CreatePropertyRequest { name: string; address: string; description?: string; }
export interface UpdatePropertyRequest { name: string; address: string; description?: string; }
```

```typescript
// features/units/data/unit.model.ts
export interface Unit extends AuditFields {
  propertyId: string;
  name: string;
  description?: string;
  status: EntityStatus;
}
export interface CreateUnitRequest { propertyId: string; name: string; description?: string; }
export interface UpdateUnitRequest { propertyId: string; name: string; description?: string; }
```

```typescript
// features/tenants/data/tenant.model.ts
export interface Tenant extends AuditFields {
  name: string;
  documentNumber: string;
  phone?: string;
  email?: string;
  status: EntityStatus;
}
export interface TenantListItem {
  id: string; name: string; documentNumber: string; phone?: string;
  email?: string; status: string; unitName?: string; // denormalizado, listo para tabla
}
export interface CreateTenantRequest { name: string; documentNumber: string; phone?: string; email?: string; }
export interface UpdateTenantRequest { name: string; phone?: string; email?: string; }
```

```typescript
// features/occupancies/data/occupancy.model.ts
export interface Occupancy extends AuditFields {
  tenantId: string;
  unitId: string;
  startDate: string; // date
  endDate?: string;  // date
  status: EntityStatus;
}
export interface CreateOccupancyRequest { tenantId: string; unitId: string; startDate: string; endDate?: string; }
export interface UpdateOccupancyRequest { tenantId: string; unitId: string; startDate: string; endDate?: string; }
```

```typescript
// features/services/data/service.model.ts
export interface UtilityService extends AuditFields { // "Service" choca con Angular DI, renombrado
  name: string;
  measurementUnit: string; // kWh, m3, etc.
  status: EntityStatus;
}
export interface CreateServiceRequest { name: string; measurementUnit: string; }
export interface UpdateServiceRequest { name: string; measurementUnit: string; }
```

```typescript
// features/meters/data/meter.model.ts
export interface Meter extends AuditFields {
  unitId: string;
  serviceId: string;
  serialNumber: string;
  status: EntityStatus;
}
export interface MeterListItem {
  id: string; serialNumber: string; unitId: string; serviceId: string; status: string;
  serviceName?: string; unitName?: string; propertyName?: string;
  lastReadingValue?: number; unitOfMeasure?: string; // ya viene listo para la tabla
}
export interface CreateMeterRequest { unitId: string; serviceId: string; serialNumber: string; }
export interface UpdateMeterRequest { unitId: string; serviceId: string; serialNumber: string; }
```

```typescript
// features/readings/data/reading.model.ts
export interface Reading extends AuditFields {
  meterId: string;
  readingDate: string; // date
  readingValue: number;
}
export interface ReadingListItem {
  id: string; meterId: string; readingDate: string; readingValue: number;
  meterSerial?: string; tenantName?: string; unitName?: string; previousValue?: number;
}
export interface CreateReadingRequest { meterId: string; readingDate: string; readingValue: number; }
export interface UpdateReadingRequest { readingDate: string; readingValue: number; }
```

```typescript
// features/receipts/data/receipt.model.ts
export interface Receipt extends AuditFields {
  serviceId: string;
  period: string;
  receiptNumber: string;
  totalAmount: number;
  totalConsumption: number;
}
export interface ReceiptListItem {
  id: string; serviceId: string; period: string; receiptNumber: string;
  totalAmount: number; totalConsumption: number; serviceName?: string;
}
export interface CreateReceiptRequest {
  serviceId: string; period: string; receiptNumber: string;
  totalAmount: number; totalConsumption: number;
}
export interface UpdateReceiptRequest { period: string; totalAmount: number; totalConsumption: number; }
```

```typescript
// features/settlements/data/settlement.model.ts
export interface Settlement extends AuditFields {
  receiptId: string;
  tenantId: string;
  consumption: number;
  unitValue: number;
  calculatedAmount: number;
  adjustmentAmount?: number;
  finalAmount: number;
  status: EntityStatus;
}
export interface SettlementListItem {
  id: string; receiptId: string; tenantId: string; consumption: number; unitValue: number;
  calculatedAmount: number; adjustmentAmount?: number; finalAmount: number; status: string;
  tenantName?: string; receiptNumber?: string; period?: string;
}
export interface GenerateSettlementRequest {
  receiptId: string;
  unitValue: number;
  tenantConsumptions: { tenantId: string; consumption: number }[];
}
export interface AdjustmentRequest { amount: number; reason: string; }
```

---

## 7. Especificación de componentes

### 7.1 Data Table (componente central del sistema)

```typescript
// shared/data-table/data-table.component.ts
export interface DataTableColumn<T> {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  align?: 'start' | 'end' | 'center';
}

@Component({ selector: 'sgcc-data-table', standalone: true, /* ... */ })
export class DataTableComponent<T> {
  @Input({ required: true }) columns!: DataTableColumn<T>[];
  @Input({ required: true }) data: T[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() pageSize = 20;
  @Input() rowActions?: (row: T) => { label: string; action: () => void }[];
  @Output() rowClick = new EventEmitter<T>();
  @Output() sortChange = new EventEmitter<{ key: string; direction: 'asc' | 'desc' }>();
}
```

Reglas heredadas de la v1.0: nunca ocultar información operativa importante solo dentro de filas expandibles; tablas preferidas sobre cards para datasets grandes; siempre incluir `loadingState`, `emptyState` y `errorState` (alimentados directamente por los signals de la sección 5.2).

### 7.2 KPI Card

```typescript
@Component({ selector: 'sgcc-kpi-card', standalone: true })
export class KpiCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: string | number;
  @Input() trend?: { direction: 'up' | 'down'; value: string };
  @Input() status?: 'success' | 'warning' | 'error' | 'info';
}
```

Uso: Total de Propiedades, Medidores Activos, Pagos Pendientes, Alertas de Consumo.

### 7.3 Status Chip

Mapeo de `EntityStatus` (el enum real del backend) a tokens de color — obligatorio incluir texto, el color nunca es suficiente:

| Status | Color token | Texto sugerido |
|---|---|---|
| `ACTIVE` | `--sgcc-success` | Activo |
| `PENDING` | `--sgcc-warning` | Pendiente |
| `INACTIVE` | `--sgcc-on-surface-variant` (neutro) | Inactivo |
| `COMPLETED` | `--sgcc-info` | Completado |
| `CANCELLED` | `--sgcc-error` | Cancelado |

```typescript
@Component({ selector: 'sgcc-status-chip', standalone: true })
export class StatusChipComponent {
  @Input({ required: true }) status!: EntityStatus;
}
```

### 7.4 Detail Drawer

Patrón de edición preferido para no perder contexto (Property, Unit, Tenant, Meter, Receipt, Settlement). Estructura fija:

```
Summary → Details → Actions → History
```

```typescript
@Component({ selector: 'sgcc-detail-drawer', standalone: true })
export class DetailDrawerComponent {
  @Input({ required: true }) open = false;
  @Input() title = '';
  @Output() closed = new EventEmitter<void>();
}
```

### 7.5 Formularios

Controles preferidos: autocomplete (para `propertyId`, `unitId`, `tenantId`, `meterId` — nunca IDs crudos en un input de texto), select, date picker (`readingDate`, `startDate`/`endDate`), number input con validación (`readingValue`, `totalAmount`).

Regla clave del dominio: en el formulario de `Reading`, mostrar siempre la lectura anterior (`previousValue`, ya viene en `ReadingListItem`) junto al campo de lectura actual, para que el operador valide el consumo calculado antes de guardar.

### 7.6 Filtros y búsqueda

Default: búsqueda simple (`documentNumber`, `serialNumber`, `receiptNumber`, `name`) + filtro avanzado opcional por `status`, `propertyId`, rango de fechas. Dado que el backend aún no pagina ni filtra server-side, el filtrado también se hace client-side sobre el array cargado — mismo caveat de escalabilidad que la sección 6.4.

---

## 8. Inventario de pantallas (mapeado a rutas y API real)

| Pantalla | Ruta | Endpoint principal |
|---|---|---|
| Dashboard | `/dashboard` | agregación de varios endpoints |
| Propiedades | `/properties` | `/api/v1/properties` |
| Unidades | `/units` | `/api/v1/units`, `/api/v1/units/by-property/{id}` |
| Inquilinos | `/tenants` | `/api/v1/tenants` |
| Ocupaciones | `/occupancies` | `/api/v1/occupancies` |
| Medidores | `/meters` | `/api/v1/meters` |
| Servicios (catálogo) | `/services` | `/api/v1/services` |
| Lecturas | `/readings` | `/api/v1/readings` |
| Recibos | `/receipts` | `/api/v1/receipts` |
| Liquidaciones | `/settlements` | `/api/v1/settlements`, `/generate`, `/{id}/adjust`, `/{id}/complete` |

Patrón CRUD estándar (igual en los 9 módulos, del Design System v1.0):

```
Page Header → Acciones Primarias → Búsqueda → Filtros → Data Table → Paginación → Detail Drawer → Historial de Auditoría
```

La pantalla de **Liquidaciones** (`settlements`) es la única que no es CRUD puro: es un flujo (`generar` → `revisar` → `ajustar` → `completar`) que corresponde 1:1 con los endpoints `generate`, `adjust` y `complete` del backend — usar `Billing Timeline` (sección original 39) para visualizar ese flujo dentro del Detail Drawer.

---

## 9. Accesibilidad e i18n

Todo lo heredado de la v1.0 aplica sin cambios: navegación por teclado, screen readers, foco visible, alto contraste, targets grandes, `prefers-reduced-motion` respetado.

**i18n — supuesto a confirmar:** todo el contexto de negocio y la documentación de SGCC está en español; este documento asume `es` como locale único para v1 (sin selector de idioma) y formato de moneda/fecha de Perú (`es-PE`) dado el uso real del sistema. Si se planea soportar otro locale, definirlo antes de construir los formularios de montos/fechas para no reescribir validaciones después.

---

## 10. Decisiones abiertas (bloquean partes específicas, no todo el frontend)

| # | Decisión | Impacto si no se resuelve | Dónde está el supuesto |
|---|---|---|---|
| 1 | Estrategia real de autenticación (Basic en memoria vs sesión/JWT) | Módulo de login se reescribe | Sección 6.2 |
| 2 | Formato real de error del backend | Interceptor de errores puede no mapear bien mensajes | Sección 6.3 |
| 3 | Paginación server-side vs client-side | Rendimiento en `readings`/`settlements` a futuro | Sección 6.4 |
| 4 | Formato de `id` (¿UUID?) | Bajo impacto, solo tipado | Sección 6.5 |
| 5 | Versión final de Angular (18.2 vs migrar a 21/22) | Ninguno inmediato; migración más cara cuanto más se espere | Sección 2 |

Ninguna de estas bloquea empezar a construir — todas tienen un valor por defecto razonable ya definido arriba.

---

## 11. Checklist de diseño (antes de aprobar cualquier pantalla)

- [ ] Cumple Material Design 3 vía Angular Material (density -1)
- [ ] Layout enterprise (Header → Toolbar → Search → Filters → Table → Pagination → Drawer)
- [ ] Desktop-first, degrada correctamente en tablet/mobile
- [ ] Accesible (teclado, foco, contraste, `prefers-reduced-motion`)
- [ ] Usa componentes de la sección 7, no inventa nuevos sin justificación
- [ ] Usa los modelos TypeScript reales de la sección 6.5, no tipos inventados
- [ ] Incluye `loadingState`, `emptyState`, `errorState`
- [ ] Status siempre con texto + color (nunca solo color)
- [ ] Dark mode compatible con los tokens de la sección 4.2
- [ ] Considera auditoría (`createdAt`/`updatedAt`, historial en el Detail Drawer)