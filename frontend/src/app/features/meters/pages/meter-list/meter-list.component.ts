import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';

@Component({
  selector: 'app-meter-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, PageHeaderComponent],
  template: `
    <app-page-header title="Medidores" subtitle="Administración de medidores">
    </app-page-header>
    
    <mat-card>
      <p class="p-4 text-gray-500">Medidores registrados: 0</p>
    </mat-card>
  `
})
export class MeterListComponent {}
