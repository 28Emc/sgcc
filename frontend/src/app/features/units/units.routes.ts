import { Routes } from '@angular/router';

export const UNITS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/unit-list/unit-list.component').then(m => m.UnitListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/unit-form/unit-form.component').then(m => m.UnitFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/unit-detail/unit-detail.component').then(m => m.UnitDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/unit-form/unit-form.component').then(m => m.UnitFormComponent)
  }
];
