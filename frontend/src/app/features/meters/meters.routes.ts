import { Routes } from '@angular/router';

export const METERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/meter-list/meter-list.component').then(m => m.MeterListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/meter-form/meter-form.component').then(m => m.MeterFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/meter-detail/meter-detail.component').then(m => m.MeterDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/meter-form/meter-form.component').then(m => m.MeterFormComponent)
  }
];
