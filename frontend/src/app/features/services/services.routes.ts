import { Routes } from '@angular/router';

export const SERVICES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/service-list/service-list.component').then(m => m.ServiceListComponent)
  }
];
