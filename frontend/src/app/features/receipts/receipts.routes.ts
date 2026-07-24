import { Routes } from '@angular/router';

export const RECEIPTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/receipt-list/receipt-list.component').then(m => m.ReceiptListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/receipt-list/receipt-list.component').then(m => m.ReceiptListComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/receipt-list/receipt-list.component').then(m => m.ReceiptListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/receipt-list/receipt-list.component').then(m => m.ReceiptListComponent)
  }
];
