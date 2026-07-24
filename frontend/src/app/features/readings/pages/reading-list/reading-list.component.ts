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
import { ReadingApiService, Reading } from '../../services/reading-api.service';

@Component({
  selector: 'app-reading-list',
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
      title="Lecturas de Medidores"
      subtitle="Registro mensual de toma de lecturas por departamento o medidor general">
      <button mat-raised-button color="primary" routerLink="new" class="btn-primary">
        <mat-icon class="mr-1">edit_note</mat-icon>
        Capturar Nueva Lectura
      </button>
    </app-page-header>

    <!-- Search and Filter Bar -->
    <div class="toolbar">
      <div class="toolbar-search">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar por medidor o inquilino...</mat-label>
          <input matInput [ngModel]="searchTerm()" (ngModelChange)="onSearchChange($event)">
          <mat-icon matSuffix class="text-slate-400">search</mat-icon>
        </mat-form-field>
      </div>

      <div class="total-count">
        Mostrando <span class="font-bold text-slate-800">{{ paginatedReadings().length }}</span> de <span class="font-bold text-slate-800">{{ filteredReadings().length }}</span> lecturas
      </div>
    </div>

    <!-- Readings Table -->
    @if (loading()) {
      <app-loading-spinner message="Cargando historial de lecturas..."></app-loading-spinner>
    } @else {
      @if (filteredReadings().length === 0) {
        <app-empty-state
          icon="edit_note"
          title="No hay lecturas registradas"
          description="Aún no ha ingresado la primera lectura del mes."
          actionLabel="Capturar Lectura"
          actionIcon="add"
          (actionClicked)="navigateToNew()">
        </app-empty-state>
      } @else {
        <mat-card class="card-container">
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="paginatedReadings()" class="w-full">
              <!-- Meter & Tenant Column -->
              <ng-container matColumnDef="meter">
                <th mat-header-cell *matHeaderCellDef>Medidor / Inquilino</th>
                <td mat-cell *matCellDef="let r">
                  <div class="flex items-center gap-3 py-1">
                    <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <mat-icon>speed</mat-icon>
                    </div>
                    <div>
                      <a [routerLink]="[r.id]" class="font-bold text-slate-900 leading-tight font-mono hover:text-blue-600 transition-colors">{{ r.meterSerial }}</a>
                      <p class="text-xs text-slate-500 mt-0.5">{{ r.tenantName }} ({{ r.unitName }})</p>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Readings Comparison Column -->
              <ng-container matColumnDef="readingsComparison">
                <th mat-header-cell *matHeaderCellDef>Anterior vs. Actual</th>
                <td mat-cell *matCellDef="let r">
                  <div class="font-mono text-xs">
                    <span class="text-slate-400">{{ r.previousValue != null ? (r.previousValue | number:'1.0-2') : '0.00' }}</span>
                    <mat-icon class="!w-3 !h-3 text-slate-400 mx-1 align-middle">arrow_forward</mat-icon>
                    <span class="font-bold text-slate-900 text-sm">{{ r.readingValue != null ? (r.readingValue | number:'1.0-2') : '—' }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Net Consumption Column -->
              <ng-container matColumnDef="netConsumption">
                <th mat-header-cell *matHeaderCellDef>Consumo Generado</th>
                <td mat-cell *matCellDef="let r">
                  <span class="inline-flex items-center gap-1 font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 font-mono text-sm">
                    <mat-icon class="!w-4 !h-4 text-blue-500">bolt</mat-icon>
                    +{{ (r.readingValue || 0) - (r.previousValue || 0) | number:'1.0-2' }} kWh
                  </span>
                </td>
              </ng-container>

              <!-- Date Column -->
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Fecha de Toma</th>
                <td mat-cell *matCellDef="let r">
                  <span class="text-xs text-slate-600 font-medium">{{ r.readingDate }}</span>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="text-right">Acciones</th>
                <td mat-cell *matCellDef="let r" class="text-right">
                  <button mat-icon-button [routerLink]="[r.id]" title="Ver detalle" class="!text-slate-500 hover:!text-blue-600">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button [routerLink]="[r.id, 'edit']" title="Editar" class="!text-slate-500 hover:!text-blue-600">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="deleteReading(r)" title="Eliminar" class="!text-slate-500 hover:!text-red-600">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <mat-paginator
            [length]="filteredReadings().length"
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
export class ReadingListComponent implements OnInit {
  private readingApi = inject(ReadingApiService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  displayedColumns = ['meter', 'readingsComparison', 'netConsumption', 'date', 'actions'];

  readings = signal<Reading[]>([]);
  loading = signal(true);
  searchTerm = signal('');
  pageIndex = signal(0);
  pageSize = signal(10);

  filteredReadings = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.readings();
    return this.readings().filter(r =>
      (r.meterSerial || '').toLowerCase().includes(term) ||
      (r.tenantName || '').toLowerCase().includes(term) ||
      (r.unitName || '').toLowerCase().includes(term)
    );
  });

  paginatedReadings = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredReadings().slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.loadReadings();
  }

  loadReadings(): void {
    this.loading.set(true);
    this.readingApi.findAll().subscribe({
      next: (data) => {
        this.readings.set(data || []);
        this.loading.set(false);
      },
      error: () => {
        this.readings.set([]);
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
    this.router.navigate(['/readings/new']);
  }

  deleteReading(reading: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Lectura',
        message: `¿Está seguro de eliminar esta lectura del medidor "${reading.meterSerial}"? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        color: 'warn'
      } as ConfirmDialogData
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && reading.id) {
        this.readingApi.delete(reading.id).subscribe({
          next: () => {
            this.snackBar.open('Lectura eliminada', 'OK', { duration: 3000 });
            this.loadReadings();
          },
          error: () => this.snackBar.open('Error al eliminar la lectura', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }
}
