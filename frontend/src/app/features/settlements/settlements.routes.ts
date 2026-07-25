import { Routes } from '@angular/router';

export const SETTLEMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/settlement-list/settlement-list.component').then(m => m.SettlementListComponent)
  }
];
