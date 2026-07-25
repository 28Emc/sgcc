import { Routes } from '@angular/router';

export const RECEIPTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/receipt-list/receipt-list.component').then(m => m.ReceiptListComponent)
  }
];
