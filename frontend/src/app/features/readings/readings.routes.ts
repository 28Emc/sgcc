import { Routes } from '@angular/router';

export const READINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/reading-list/reading-list.component').then(m => m.ReadingListComponent)
  }
];
