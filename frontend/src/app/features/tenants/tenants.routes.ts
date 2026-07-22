import { Routes } from '@angular/router';

export const TENANTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/tenant-list/tenant-list.component').then(m => m.TenantListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/tenant-form/tenant-form.component').then(m => m.TenantFormComponent)
  }
];
