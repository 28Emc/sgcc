import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '@shared/components/confirm-dialog/confirm-dialog.component';
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
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent
  ],
  template: `
    <app-page-header 
      title="Inquilinos" 
      subtitle="Registro de inquilinos, contratos y asignación a unidades de alquiler">
      <button mat-raised-button color="primary" routerLink="new" class="btn-primary">
        <mat-icon class="mr-1">person_add</mat-icon>
        Nuevo Inquilino
      </button>
    </app-page-header>
    
    <!-- Filter Search Bar -->
    <div class="toolbar">
      <div class="toolbar-search">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar inquilino por nombre o DNI/RFC...</mat-label>
          <input matInput [ngModel]="searchTerm()" (ngModelChange)="onSearchChange($event)">
          <mat-icon matSuffix class="text-slate-400">search</mat-icon>
        </mat-form-field>
      </div>

      <div class="total-count">
        Mostrando <span class="font-bold text-slate-800">{{ paginatedTenants().length }}</span> de <span class="font-bold text-slate-800">{{ filteredTenants().length }}</span> inquilinos
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
          actionIcon="person_add"
          (actionClicked)="navigateToNew()">
        </app-empty-state>
      } @else {
        <!-- Table View -->
        <mat-card class="card-container">
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="paginatedTenants()" class="w-full">
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
                    <span>{{ tenant.documentNumber || '—' }}</span>
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
                    {{ tenant.unitName || 'Sin unidad' }}
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
                  <button mat-icon-button [routerLink]="[tenant.id]" title="Ver detalle" class="!text-slate-500 hover:!text-indigo-600">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button [routerLink]="[tenant.id, 'edit']" title="Editar" class="!text-slate-500 hover:!text-indigo-600">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="deleteTenant(tenant)" title="Eliminar" class="!text-slate-500 hover:!text-red-600">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>
              
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <mat-paginator
            [length]="filteredTenants().length"
            [pageIndex]="pageIndex()"
            [pageSize]="pageSize()"
            [pageSizeOptions]="[5, 10, 25, 50]"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        </mat-card>
      }
    }
  `
})
export class TenantListComponent implements OnInit {
  private tenantApi = inject(TenantApiService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  displayedColumns = ['name', 'document', 'email', 'unit', 'status', 'actions'];
  
  tenants = signal<Tenant[]>([]);
  searchTerm = signal('');
  loading = signal(true);
  pageIndex = signal(0);
  pageSize = signal(10);

  filteredTenants = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.tenants();
    return this.tenants().filter(t => 
      (t.name || '').toLowerCase().includes(term) || 
      (t.documentNumber || '').toLowerCase().includes(term) ||
      (t.email || '').toLowerCase().includes(term)
    );
  });

  paginatedTenants = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredTenants().slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.loadTenants();
  }

  loadTenants(): void {
    this.loading.set(true);
    this.tenantApi.findAll().subscribe({
      next: (data) => {
        this.tenants.set(data || []);
        this.loading.set(false);
      },
      error: () => {
        this.tenants.set([]);
        this.loading.set(false);
      }
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.pageIndex.set(0);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  navigateToNew(): void {
    this.router.navigate(['/tenants/new']);
  }

  getInitials(name: string): string {
    if (!name) return 'IN';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  }

  deleteTenant(tenant: Tenant): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Inquilino',
        message: `¿Está seguro de eliminar al inquilino "${tenant.name}"? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        color: 'warn'
      } as ConfirmDialogData
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && tenant.id) {
        this.tenantApi.delete(tenant.id).subscribe({
          next: () => {
            this.snackBar.open('Inquilino eliminado', 'OK', { duration: 3000 });
            this.loadTenants();
          },
          error: () => this.snackBar.open('Error al eliminar el inquilino', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }
}
