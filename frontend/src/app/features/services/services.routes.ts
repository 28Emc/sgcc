import { Routes } from '@angular/router';

export const SERVICES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/service-list/service-list.component').then(m => m.ServiceListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/service-list/service-list.component').then(m => m.ServiceListComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/service-list/service-list.component').then(m => m.ServiceListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/service-list/service-list.component').then(m => m.ServiceListComponent)
  }
];
