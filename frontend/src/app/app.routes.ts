import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'properties',
    pathMatch: 'full'
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
  }
];
