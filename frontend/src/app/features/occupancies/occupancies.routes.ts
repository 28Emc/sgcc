import { Routes } from '@angular/router';

export const OCCUPANCIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/occupancy-list/occupancy-list.component').then(m => m.OccupancyListComponent)
  }
];
