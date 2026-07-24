import { Routes } from '@angular/router';

export const OCCUPANCIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/occupancy-list/occupancy-list.component').then(m => m.OccupancyListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/occupancy-form/occupancy-form.component').then(m => m.OccupancyFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/occupancy-detail/occupancy-detail.component').then(m => m.OccupancyDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/occupancy-form/occupancy-form.component').then(m => m.OccupancyFormComponent)
  }
];
