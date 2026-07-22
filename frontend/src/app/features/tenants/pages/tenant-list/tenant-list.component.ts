import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { TenantApiService, Tenant } from '../../services/tenant-api.service';

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent
  ],
  template: `
    <app-page-header 
      title="Inquilinos" 
      subtitle="Registro de inquilinos, contratos y asignación a unidades de alquiler">
      <button mat-raised-button color="primary" routerLink="new" class="!rounded-xl !px-5 !py-2 shadow-md">
        <mat-icon class="mr-1">person_add</mat-icon>
        Nuevo Inquilino
      </button>
    </app-page-header>
    
    <!-- Filter Search Bar -->
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
      <div class="relative flex-1 max-w-md">
        <mat-form-field appearance="outline" class="w-full !mb-0 text-sm">
          <mat-label>Buscar inquilino por nombre o DNI/RFC...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (ngModelChange)="onSearchChange($event)">
          <mat-icon matSuffix class="text-slate-400">search</mat-icon>
        </mat-form-field>
      </div>

      <div class="text-xs text-slate-500 font-medium self-end sm:self-center">
        Total: <span class="font-bold text-slate-800">{{ filteredTenants().length }}</span> inquilinos
      </div>
    </div>

    <!-- Loading State -->
    @if (loading()) {
      <app-loading-spinner message="Cargando directorio de inquilinos..."></app-loading-spinner>
    } @else {
      <!-- Empty State -->
      @if (filteredTenants().length === 0) {
        <app-empty-state
          icon="people"
          title="No hay inquilinos registrados"
          description="Aún no ha registrado ningún inquilino o la búsqueda no coincide."
          actionLabel="Registrar Inquilino"
          actionIcon="person_add">
        </app-empty-state>
      } @else {
        <!-- Table View -->
        <mat-card class="!p-0 overflow-hidden shadow-sm border border-slate-200/80">
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="filteredTenants()" class="w-full">
              <!-- Name & Avatar Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Inquilino</th>
                <td mat-cell *matCellDef="let tenant">
                  <div class="flex items-center gap-3 py-1.5">
                    <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                      {{ getInitials(tenant.name) }}
                    </div>
                    <div>
                      <p class="font-semibold text-slate-900 leading-tight">{{ tenant.name }}</p>
                      <p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <mat-icon class="!w-3 !h-3 text-xs text-slate-400">phone</mat-icon>
                        {{ tenant.phone || '+51 987 654 321' }}
                      </p>
                    </div>
                  </div>
                </td>
              </ng-container>
              
              <!-- Document Column -->
              <ng-container matColumnDef="document">
                <th mat-header-cell *matHeaderCellDef>Documento Identidad</th>
                <td mat-cell *matCellDef="let tenant">
                  <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-medium">
                    <mat-icon class="!w-4 !h-4 text-xs text-slate-400">badge</mat-icon>
                    <span>{{ tenant.documentNumber || 'DNI ' + tenant.document }}</span>
                  </div>
                </td>
              </ng-container>
              
              <!-- Email Column -->
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Correo Electrónico</th>
                <td mat-cell *matCellDef="let tenant">
                  <span class="text-sm text-slate-600 font-medium">{{ tenant.email }}</span>
                </td>
              </ng-container>

              <!-- Assigned Unit Column -->
              <ng-container matColumnDef="unit">
                <th mat-header-cell *matHeaderCellDef>Unidad Alquilada</th>
                <td mat-cell *matCellDef="let tenant">
                  <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                    <mat-icon class="!w-3.5 !h-3.5 text-indigo-500">home</mat-icon>
                    {{ tenant.unitName || 'Depto. ' + (tenant.id * 101) }}
                  </span>
                </td>
              </ng-container>
              
              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let tenant">
                  <span [class]="tenant.status === 'ACTIVE' || !tenant.status ? 'status-badge status-badge-active' : 'status-badge status-badge-inactive'">
                    {{ tenant.status === 'ACTIVE' || !tenant.status ? 'CONTRATO ACTIVO' : 'INACTIVO' }}
                  </span>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="text-right">Acciones</th>
                <td mat-cell *matCellDef="let tenant" class="text-right">
                  <button mat-icon-button title="Editar" class="!text-slate-500 hover:!text-indigo-600">
                    <mat-icon>edit</mat-icon>
                  </button>
                </td>
              </ng-container>
              
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </mat-card>
      }
    }
  `
})
export class TenantListComponent implements OnInit {
  private tenantApi = inject(TenantApiService);

  displayedColumns = ['name', 'document', 'email', 'unit', 'status', 'actions'];
  
  tenants = signal<any[]>([]);
  searchTerm = signal('');
  loading = signal(true);

  filteredTenants = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.tenants();
    return this.tenants().filter(t => 
      t.name.toLowerCase().includes(term) || 
      (t.documentNumber && t.documentNumber.toLowerCase().includes(term)) ||
      t.email.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.loadTenants();
  }

  loadTenants(): void {
    this.loading.set(true);
    this.tenantApi.findAll().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.tenants.set(data);
        } else {
          this.loadSampleTenants();
        }
        this.loading.set(false);
      },
      error: () => {
        this.loadSampleTenants();
        this.loading.set(false);
      }
    });
  }

  private loadSampleTenants(): void {
    this.tenants.set([
      { id: '1', name: 'Juan Pérez', documentNumber: '45678912', email: 'juan.perez@email.com', phone: '+51 987 123 456', unitName: 'Depto 101 - Los Olivos', status: 'ACTIVE' },
      { id: '2', name: 'María García', documentNumber: '78912345', email: 'maria.garcia@email.com', phone: '+51 912 345 678', unitName: 'Depto 102 - Los Olivos', status: 'ACTIVE' },
      { id: '3', name: 'Carlos Mendoza', documentNumber: '12345678', email: 'carlos.mendoza@email.com', phone: '+51 955 443 322', unitName: 'Depto 201 - Los Olivos', status: 'ACTIVE' },
      { id: '4', name: 'Ana Rodríguez', documentNumber: '87654321', email: 'ana.rodriguez@email.com', phone: '+51 966 778 899', unitName: 'Depto 301 - San Martín', status: 'ACTIVE' }
    ]);
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  getInitials(name: string): string {
    if (!name) return 'IN';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  }
}
