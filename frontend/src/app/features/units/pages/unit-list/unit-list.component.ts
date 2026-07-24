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
import { UnitApiService, Unit } from '../../services/unit-api.service';

@Component({
  selector: 'app-unit-list',
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
      title="Unidades"
      subtitle="Gestión de unidades de alquiler por propiedad">
      <button mat-raised-button color="primary" (click)="navigateToNew()" class="btn-primary">
        <mat-icon class="mr-1">add</mat-icon>
        Nueva Unidad
      </button>
    </app-page-header>

    <!-- Filter Search Bar -->
    <div class="toolbar">
      <div class="toolbar-search">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar unidad por nombre o descripción...</mat-label>
          <input matInput [ngModel]="searchTerm()" (ngModelChange)="onSearchChange($event)">
          <mat-icon matSuffix class="text-slate-400">search</mat-icon>
        </mat-form-field>
      </div>

      <div class="total-count">
        Mostrando <span class="font-bold text-slate-800">{{ paginatedUnits().length }}</span> de <span class="font-bold text-slate-800">{{ filteredUnits().length }}</span> unidades
      </div>
    </div>

    <!-- Loading State -->
    @if (loading()) {
      <app-loading-spinner message="Cargando directorio de unidades..."></app-loading-spinner>
    } @else {
      <!-- Empty State -->
      @if (filteredUnits().length === 0) {
        <app-empty-state
          icon="home"
          title="No hay unidades registradas"
          description="Aún no ha registrado ninguna unidad o la búsqueda no coincide."
          actionLabel="Registrar Unidad"
          actionIcon="add"
          (actionClicked)="navigateToNew()">
        </app-empty-state>
      } @else {
        <!-- Table View -->
        <mat-card class="card-container">
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="paginatedUnits()" class="w-full">
              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Unidad</th>
                <td mat-cell *matCellDef="let unit">
                  <div class="flex items-center gap-3 py-1.5">
                    <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                      <mat-icon class="!w-5 !h-5">home</mat-icon>
                    </div>
                    <div>
                      <p class="font-semibold text-slate-900 leading-tight">{{ unit.name }}</p>
                      <p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        {{ unit.description || 'Sin descripción' }}
                      </p>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Property Column -->
              <ng-container matColumnDef="property">
                <th mat-header-cell *matHeaderCellDef>Propiedad</th>
                <td mat-cell *matCellDef="let unit">
                  <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                    <mat-icon class="!w-3.5 !h-3.5 text-blue-500">apartment</mat-icon>
                    {{ unit.propertyName || 'Sin propiedad' }}
                  </span>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let unit">
                  <span [class]="unit.status === 'ACTIVE' || !unit.status ? 'status-badge status-badge-active' : 'status-badge status-badge-inactive'">
                    {{ unit.status === 'ACTIVE' || !unit.status ? 'ACTIVO' : 'INACTIVO' }}
                  </span>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="text-right">Acciones</th>
                <td mat-cell *matCellDef="let unit" class="text-right">
                  <button mat-icon-button [routerLink]="[unit.id]" title="Ver detalle" class="!text-slate-500 hover:!text-blue-600">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button [routerLink]="[unit.id, 'edit']" title="Editar" class="!text-slate-500 hover:!text-blue-600">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="deleteUnit(unit)" title="Eliminar" class="!text-slate-500 hover:!text-red-600">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <mat-paginator
            [length]="filteredUnits().length"
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
export class UnitListComponent implements OnInit {
  private unitApi = inject(UnitApiService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  displayedColumns = ['name', 'property', 'status', 'actions'];

  units = signal<Unit[]>([]);
  searchTerm = signal('');
  loading = signal(true);
  pageIndex = signal(0);
  pageSize = signal(10);

  filteredUnits = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.units();
    return this.units().filter(u =>
      (u.name || '').toLowerCase().includes(term) ||
      (u.description || '').toLowerCase().includes(term) ||
      (u.propertyName || '').toLowerCase().includes(term)
    );
  });

  paginatedUnits = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredUnits().slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.loadUnits();
  }

  loadUnits(): void {
    this.loading.set(true);
    this.unitApi.findAll().subscribe({
      next: (data) => {
        this.units.set(data || []);
        this.loading.set(false);
      },
      error: () => {
        this.units.set([]);
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
    this.router.navigate(['/units/new']);
  }

  deleteUnit(unit: Unit): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Unidad',
        message: `¿Está seguro de eliminar la unidad "${unit.name}"? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        color: 'warn'
      } as ConfirmDialogData
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && unit.id) {
        this.unitApi.delete(unit.id).subscribe({
          next: () => {
            this.snackBar.open('Unidad eliminada', 'OK', { duration: 3000 });
            this.loadUnits();
          },
          error: () => this.snackBar.open('Error al eliminar la unidad', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }
}
