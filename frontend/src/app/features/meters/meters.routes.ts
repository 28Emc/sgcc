import { Routes } from '@angular/router';

export const METERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/meter-list/meter-list.component').then(m => m.MeterListComponent)
  }
];
