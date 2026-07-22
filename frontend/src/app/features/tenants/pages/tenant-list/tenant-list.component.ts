import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';

@Component({
  selector: 'app-tenant-list',
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
      title="Inquilinos" 
      subtitle="Administración de inquilinos">
      <button mat-raised-button color="primary" routerLink="new">
        <mat-icon>add</mat-icon>
        Nuevo Inquilino
      </button>
    </app-page-header>
    
    <mat-card>
      <table mat-table [dataSource]="tenants" class="w-full">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Nombre</th>
          <td mat-cell *matCellDef="let tenant">{{ tenant.name }}</td>
        </ng-container>
        
        <ng-container matColumnDef="document">
          <th mat-header-cell *matHeaderCellDef>Documento</th>
          <td mat-cell *matCellDef="let tenant">{{ tenant.documentNumber }}</td>
        </ng-container>
        
        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let tenant">{{ tenant.email }}</td>
        </ng-container>
        
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Estado</th>
          <td mat-cell *matCellDef="let tenant">
            <span [class]="tenant.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'">
              {{ tenant.status }}
            </span>
          </td>
        </ng-container>
        
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </mat-card>
  `
})
export class TenantListComponent {
  displayedColumns = ['name', 'document', 'email', 'status'];
  
  tenants = [
    { id: '1', name: 'Juan Pérez', documentNumber: '12345678', email: 'juan@email.com', status: 'ACTIVE' }
  ];
}
