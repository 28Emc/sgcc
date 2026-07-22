import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    PageHeaderComponent
  ],
  template: `
    <app-page-header 
      title="Propiedades" 
      subtitle="Administración de propiedades y unidades">
      <button mat-raised-button color="primary" routerLink="new">
        <mat-icon>add</mat-icon>
        Nueva Propiedad
      </button>
    </app-page-header>
    
    <mat-card>
      <table mat-table [dataSource]="properties" class="w-full">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Nombre</th>
          <td mat-cell *matCellDef="let property">{{ property.name }}</td>
        </ng-container>
        
        <ng-container matColumnDef="address">
          <th mat-header-cell *matHeaderCellDef>Dirección</th>
          <td mat-cell *matCellDef="let property">{{ property.address }}</td>
        </ng-container>
        
        <ng-container matColumnDef="units">
          <th mat-header-cell *matHeaderCellDef>Unidades</th>
          <td mat-cell *matCellDef="let property">{{ property.units }}</td>
        </ng-container>
        
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Estado</th>
          <td mat-cell *matCellDef="let property">
            <span [class]="property.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'">
              {{ property.status }}
            </span>
          </td>
        </ng-container>
        
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Acciones</th>
          <td mat-cell *matCellDef="let property">
            <div class="flex gap-2">
              <button mat-icon-button [routerLink]="[property.id]">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button [routerLink]="[property.id, 'edit']">
                <mat-icon>edit</mat-icon>
              </button>
            </div>
          </td>
        </ng-container>
        
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </mat-card>
  `
})
export class PropertyListComponent {
  displayedColumns = ['name', 'address', 'units', 'status', 'actions'];
  
  properties = [
    { id: '1', name: 'Propiedad Ejemplo', address: 'Calle Principal 123', units: 5, status: 'ACTIVE' }
  ];
}
