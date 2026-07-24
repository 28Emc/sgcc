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
import { OccupancyApiService, Occupancy } from '../../services/occupancy-api.service';

@Component({
  selector: 'app-occupancy-list',
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
      title="Ocupaciones"
      subtitle="Gestión de contratos de alquiler y asignación de inquilinos a unidades">
      <button mat-raised-button color="primary" (click)="navigateToNew()" class="btn-primary">
        <mat-icon class="mr-1">add</mat-icon>
        Nueva Ocupación
      </button>
    </app-page-header>

    <!-- Filter Search Bar -->
    <div class="toolbar">
      <div class="toolbar-search">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar ocupación por inquilino o unidad...</mat-label>
          <input matInput [ngModel]="searchTerm()" (ngModelChange)="onSearchChange($event)">
          <mat-icon matSuffix class="text-slate-400">search</mat-icon>
        </mat-form-field>
      </div>

      <div class="total-count">
        Mostrando <span class="font-bold text-slate-800">{{ paginatedOccupancies().length }}</span> de <span class="font-bold text-slate-800">{{ filteredOccupancies().length }}</span> ocupaciones
      </div>
    </div>

    <!-- Loading State -->
    @if (loading()) {
      <app-loading-spinner message="Cargando directorio de ocupaciones..."></app-loading-spinner>
    } @else {
      <!-- Empty State -->
      @if (filteredOccupancies().length === 0) {
        <app-empty-state
          icon="key"
          title="No hay ocupaciones registradas"
          description="Aún no ha registrado ninguna ocupación o la búsqueda no coincide."
          actionLabel="Registrar Ocupación"
          actionIcon="add"
          (actionClicked)="navigateToNew()">
        </app-empty-state>
      } @else {
        <!-- Table View -->
        <mat-card class="card-container">
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="paginatedOccupancies()" class="w-full">
              <!-- Tenant Column -->
              <ng-container matColumnDef="tenant">
                <th mat-header-cell *matHeaderCellDef>Inquilino</th>
                <td mat-cell *matCellDef="let occupancy">
                  <div class="flex items-center gap-3 py-1.5">
                    <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                      <mat-icon class="!w-5 !h-5">person</mat-icon>
                    </div>
                    <div>
                      <p class="font-semibold text-slate-900 leading-tight">{{ occupancy.tenantName || 'Sin inquilino' }}</p>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Unit Column -->
              <ng-container matColumnDef="unit">
                <th mat-header-cell *matHeaderCellDef>Unidad</th>
                <td mat-cell *matCellDef="let occupancy">
                  <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 border border-violet-100">
                    <mat-icon class="!w-3.5 !h-3.5 text-violet-500">home</mat-icon>
                    {{ occupancy.unitName || 'Sin unidad' }}
                  </span>
                </td>
              </ng-container>

              <!-- Dates Column -->
              <ng-container matColumnDef="dates">
                <th mat-header-cell *matHeaderCellDef>Fechas</th>
                <td mat-cell *matCellDef="let occupancy">
                  <div class="text-sm">
                    <p class="text-slate-700 font-medium">{{ occupancy.startDate }}</p>
                    <p class="text-xs text-slate-500">al {{ occupancy.endDate || 'Actual' }}</p>
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let occupancy">
                  <span [class]="occupancy.status === 'ACTIVE' || !occupancy.status ? 'status-badge status-badge-active' : 'status-badge status-badge-inactive'">
                    {{ occupancy.status === 'ACTIVE' || !occupancy.status ? 'ACTIVA' : 'INACTIVA' }}
                  </span>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="text-right">Acciones</th>
                <td mat-cell *matCellDef="let occupancy" class="text-right">
                  <button mat-icon-button [routerLink]="[occupancy.id]" title="Ver detalle" class="!text-slate-500 hover:!text-violet-600">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button [routerLink]="[occupancy.id, 'edit']" title="Editar" class="!text-slate-500 hover:!text-violet-600">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="deleteOccupancy(occupancy)" title="Eliminar" class="!text-slate-500 hover:!text-red-600">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <mat-paginator
            [length]="filteredOccupancies().length"
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
export class OccupancyListComponent implements OnInit {
  private occupancyApi = inject(OccupancyApiService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  displayedColumns = ['tenant', 'unit', 'dates', 'status', 'actions'];

  occupancies = signal<Occupancy[]>([]);
  searchTerm = signal('');
  loading = signal(true);
  pageIndex = signal(0);
  pageSize = signal(10);

  filteredOccupancies = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.occupancies();
    return this.occupancies().filter(o =>
      (o.tenantName || '').toLowerCase().includes(term) ||
      (o.unitName || '').toLowerCase().includes(term)
    );
  });

  paginatedOccupancies = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredOccupancies().slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.loadOccupancies();
  }

  loadOccupancies(): void {
    this.loading.set(true);
    this.occupancyApi.findAll().subscribe({
      next: (data) => {
        this.occupancies.set(data || []);
        this.loading.set(false);
      },
      error: () => {
        this.occupancies.set([]);
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
    this.router.navigate(['/occupancies/new']);
  }

  deleteOccupancy(occupancy: Occupancy): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Ocupación',
        message: `¿Está seguro de eliminar esta ocupación? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        color: 'warn'
      } as ConfirmDialogData
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && occupancy.id) {
        this.occupancyApi.delete(occupancy.id).subscribe({
          next: () => {
            this.snackBar.open('Ocupación eliminada', 'OK', { duration: 3000 });
            this.loadOccupancies();
          },
          error: () => this.snackBar.open('Error al eliminar la ocupación', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }
}
