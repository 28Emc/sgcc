import { Routes } from '@angular/router';

export const TENANTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/tenant-list/tenant-list.component').then(m => m.TenantListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/tenant-form/tenant-form.component').then(m => m.TenantFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/tenant-detail/tenant-detail.component').then(m => m.TenantDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/tenant-form/tenant-form.component').then(m => m.TenantFormComponent)
  }
];
