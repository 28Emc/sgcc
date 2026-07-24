import { Routes } from '@angular/router';

export const RECEIPTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/receipt-list/receipt-list.component').then(m => m.ReceiptListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/receipt-form/receipt-form.component').then(m => m.ReceiptFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/receipt-detail/receipt-detail.component').then(m => m.ReceiptDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/receipt-form/receipt-form.component').then(m => m.ReceiptFormComponent)
  }
];
