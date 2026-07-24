import { Routes } from '@angular/router';

export const READINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/reading-list/reading-list.component').then(m => m.ReadingListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/reading-form/reading-form.component').then(m => m.ReadingFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/reading-detail/reading-detail.component').then(m => m.ReadingDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/reading-form/reading-form.component').then(m => m.ReadingFormComponent)
  }
];
