# SGCC Frontend

Aplicacion web del Sistema de Gestion de Cobros y Consumos de Recibos. construida con Angular 18 y Tailwind CSS.

## Stack

- Angular 18.2
- TypeScript 5.5
- Angular Material 18.2
- Tailwind CSS 3.4
- RxJS 7.8
- date-fns 3.6

## Requisitos

- Node.js 20+
- npm 10+

## Ejecucion local

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

### 2. Ejecutar en modo desarrollo

```bash
ng serve
```

La app arranca en `http://localhost:4200`.

> **Proxy:** En produccion (Docker), nginx proxy-passa las rutas `/api/*` al backend en `backend:8080`. En desarrollo local, `ng serve` sirve la app sin proxy. Si necesitas conectar al backend local, configura un proxy en `proxy.conf.json`.

## Paginas

| Ruta | Modulo | Descripcion |
|------|--------|-------------|
| `/properties` | Properties | Lista, creacion, edicion y detalle de propiedades |
| `/tenants` | Tenants | Lista y creacion de inquilinos |
| `/meters` | Meters | Lista de medidores |
| `/readings` | Readings | Lista de lecturas de medidores |
| `/receipts` | Receipts | Lista de recibos de servicios |
| `/settlements` | Settlements | Lista de liquidaciones por inquilino |

## Estructura

```
frontend/
├── src/
│   ├── app/
│   │   ├── app.component.ts          # Root component
│   │   ├── app.routes.ts             # Rutas principales (lazy loading)
│   │   ├── layouts/
│   │   │   └── main-layout/          # Layout principal (sidebar + content)
│   │   ├── shared/
│   │   │   └── components/
│   │   │       └── page-header/      # Componente reutilizable de encabezado
│   │   └── features/                 # Modulos por dominio
│   │       ├── properties/           # CRUD propiedades + unidades
│   │       ├── tenants/              # CRUD inquilinos
│   │       ├── meters/               # CRUD medidores
│   │       ├── readings/             # Lecturas
│   │       ├── receipts/             # Recibos
│   │       └── settlements/          # Liquidaciones
│   ├── environments/                 # Configuracion por entorno
│   ├── styles.scss                   # Estilos globales (Tailwind)
│   └── index.html
├── angular.json
├── tsconfig.json
├── tailwind.config.js
├── package.json
├── nginx.conf                        # Configuracion nginx (produccion)
└── Dockerfile
```

Cada feature sigue la estructura:

```
features/<module>/
├── <module>.routes.ts                # Rutas lazy-loaded del modulo
├── pages/                            # Componentes de pantalla
│   └── <page>/
│       └── <page>.component.ts       # Standalone component
└── services/                         # Servicios API
    └── <module>-api.service.ts       # HTTP client para el modulo
```

## Path aliases

Configurados en `tsconfig.json`:

| Alias | Ruta |
|-------|------|
| `@core/*` | `src/app/core/*` |
| `@shared/*` | `src/app/shared/*` |
| `@features/*` | `src/app/features/*` |

Ejemplo de uso:

```typescript
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
```

## Comandos

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
ng serve

# Build para produccion
ng build

# Build con observador (watch mode)
ng build --watch --configuration development

# Ejecutar tests
ng test
```

## Build y despliegue

### Docker

```bash
# Desde la raiz del proyecto
docker-compose up -d frontend
```

El Dockerfile ejecuta un build multi-stage:
1. **Build stage:** `node:20-alpine` compila la app con `ng build`
2. **Runtime stage:** `nginx:alpine` sirve los archivos estaticos

Los archivos compilados se colocan en `/usr/share/nginx/html` y nginx sirve la SPA con routing fallback.

### nginx.conf

```nginx
location / {
    try_files $uri $uri/ /index.html;    # SPA fallback
}

location /api {
    proxy_pass http://backend:8080;       # Proxy al backend
}
```

## Tema visual

- **UI Library:** Angular Material 18.2 (tema prebuilt `indigo-pink`)
- **CSS Framework:** Tailwind CSS 3.4
- **Estilo:** Componentes standalone con templates inline, estilos Tailwind utility-first
