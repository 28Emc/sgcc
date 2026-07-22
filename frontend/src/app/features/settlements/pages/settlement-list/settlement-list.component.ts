import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';

@Component({
  selector: 'app-settlement-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, PageHeaderComponent],
  template: `
    <app-page-header title="Liquidaciones" subtitle="Cálculo de liquidaciones por inquilino">
    </app-page-header>
    
    <mat-card>
      <p class="p-4 text-gray-500">Liquidaciones generadas: 0</p>
    </mat-card>
  `
})
export class SettlementListComponent {}
