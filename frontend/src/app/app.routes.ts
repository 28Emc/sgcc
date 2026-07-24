import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'properties',
    loadChildren: () => import('./features/properties/properties.routes').then(m => m.PROPERTIES_ROUTES)
  },
  {
    path: 'tenants',
    loadChildren: () => import('./features/tenants/tenants.routes').then(m => m.TENANTS_ROUTES)
  },
  {
    path: 'meters',
    loadChildren: () => import('./features/meters/meters.routes').then(m => m.METERS_ROUTES)
  },
  {
    path: 'readings',
    loadChildren: () => import('./features/readings/readings.routes').then(m => m.READINGS_ROUTES)
  },
  {
    path: 'receipts',
    loadChildren: () => import('./features/receipts/receipts.routes').then(m => m.RECEIPTS_ROUTES)
  },
  {
    path: 'settlements',
    loadChildren: () => import('./features/settlements/settlements.routes').then(m => m.SETTLEMENTS_ROUTES)
  },
  {
    path: 'services',
    loadChildren: () => import('./features/services/services.routes').then(m => m.SERVICES_ROUTES)
  },
  {
    path: 'units',
    loadChildren: () => import('./features/units/units.routes').then(m => m.UNITS_ROUTES)
  },
  {
    path: 'occupancies',
    loadChildren: () => import('./features/occupancies/occupancies.routes').then(m => m.OCCUPANCIES_ROUTES)
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
