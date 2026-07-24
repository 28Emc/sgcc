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
import { MeterApiService, Meter } from '../../services/meter-api.service';

@Component({
  selector: 'app-meter-list',
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
      title="Medidores de Servicios" 
      subtitle="Registro de contadores eléctricos, de agua potable y otros servicios por unidad">
      <button mat-raised-button color="primary" routerLink="new" class="btn-primary">
        <mat-icon class="mr-1">speed</mat-icon>
        Nuevo Medidor
      </button>
    </app-page-header>
    
    <!-- Search and Filter Bar -->
    <div class="toolbar">
      <div class="toolbar-search">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar por código o número de serie...</mat-label>
          <input matInput [ngModel]="searchTerm()" (ngModelChange)="onSearchChange($event)">
          <mat-icon matSuffix class="text-slate-400">search</mat-icon>
        </mat-form-field>
      </div>

      <div class="total-count">
        Mostrando <span class="font-bold text-slate-800">{{ paginatedMeters().length }}</span> de <span class="font-bold text-slate-800">{{ filteredMeters().length }}</span> medidores
      </div>
    </div>

    <!-- Loading State -->
    @if (loading()) {
      <app-loading-spinner message="Cargando medidores..."></app-loading-spinner>
    } @else {
      <!-- Empty State -->
      @if (filteredMeters().length === 0) {
        <app-empty-state
          icon="speed"
          title="No hay medidores registrados"
          description="Aún no ha asociado ningún medidor de servicio público a las unidades."
          actionLabel="Agregar Medidor"
          actionIcon="add"
          (actionClicked)="navigateToNew()">
        </app-empty-state>
      } @else {
        <!-- Table View -->
        <mat-card class="card-container">
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="paginatedMeters()" class="w-full">
              <!-- Service Type & Serial Column -->
              <ng-container matColumnDef="serialNumber">
                <th mat-header-cell *matHeaderCellDef>N° Serie / Código</th>
                <td mat-cell *matCellDef="let meter">
                  <div class="flex items-center gap-3 py-1">
                    <div [class]="getServiceIconClass(meter.serviceName)">
                      <mat-icon class="!w-5 !h-5">{{ getServiceIcon(meter.serviceName) }}</mat-icon>
                    </div>
                    <div>
                      <p class="font-mono font-bold text-slate-900 leading-tight">{{ meter.serialNumber }}</p>
                      <p class="text-xs font-semibold text-slate-500 mt-0.5">{{ meter.serviceName }}</p>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Assigned Location Column -->
              <ng-container matColumnDef="location">
                <th mat-header-cell *matHeaderCellDef>Asignación</th>
                <td mat-cell *matCellDef="let meter">
                  <div>
                    <p class="font-semibold text-slate-800 text-sm">{{ meter.propertyName }}</p>
                    <p class="text-xs text-slate-500">{{ meter.unitName }}</p>
                  </div>
                </td>
              </ng-container>

              <!-- Last Reading Column -->
              <ng-container matColumnDef="lastReading">
                <th mat-header-cell *matHeaderCellDef>Última Lectura</th>
                <td mat-cell *matCellDef="let meter">
                  <div class="font-mono text-sm">
                    <span class="font-bold text-slate-900">{{ meter.lastReadingValue != null ? (meter.lastReadingValue | number:'1.0-2') : '—' }}</span>
                    <span class="text-xs text-slate-500 ml-1">{{ meter.unitOfMeasure || '' }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let meter">
                  <span class="status-badge" [class]="meter.status === 'ACTIVE' ? 'status-badge-active' : 'status-badge-inactive'">
                    {{ meter.status === 'ACTIVE' ? 'OPERATIVO' : 'INACTIVO' }}
                  </span>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="text-right">Acciones</th>
                <td mat-cell *matCellDef="let meter" class="text-right">
                  <button mat-icon-button [routerLink]="[meter.id]" title="Ver detalle" class="!text-slate-500 hover:!text-emerald-600">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button [routerLink]="[meter.id, 'edit']" title="Editar" class="!text-slate-500 hover:!text-emerald-600">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="deleteMeter(meter)" title="Eliminar" class="!text-slate-500 hover:!text-red-600">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>
              
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <mat-paginator
            [length]="filteredMeters().length"
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
export class MeterListComponent implements OnInit {
  private meterApi = inject(MeterApiService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  displayedColumns = ['serialNumber', 'location', 'lastReading', 'status', 'actions'];
  
  meters = signal<Meter[]>([]);
  searchTerm = signal('');
  loading = signal(true);
  pageIndex = signal(0);
  pageSize = signal(10);

  filteredMeters = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.meters();
    return this.meters().filter(m => 
      (m.serialNumber || '').toLowerCase().includes(term) || 
      (m.propertyName || '').toLowerCase().includes(term) ||
      (m.unitName || '').toLowerCase().includes(term)
    );
  });

  paginatedMeters = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredMeters().slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.loadMeters();
  }

  loadMeters(): void {
    this.loading.set(true);
    this.meterApi.findAll().subscribe({
      next: (data) => {
        this.meters.set(data || []);
        this.loading.set(false);
      },
      error: () => {
        this.meters.set([]);
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
    this.router.navigate(['/meters/new']);
  }

  getServiceIcon(name: string): string {
    const n = (name || '').toLowerCase();
    if (n.includes('electricidad') || n.includes('electr')) return 'bolt';
    if (n.includes('agua')) return 'water_drop';
    if (n.includes('gas')) return 'local_fire_department';
    return 'speed';
  }

  getServiceIconClass(name: string): string {
    const base = 'w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-sm ';
    const n = (name || '').toLowerCase();
    if (n.includes('electricidad') || n.includes('electr')) return base + 'bg-amber-50 text-amber-600';
    if (n.includes('agua')) return base + 'bg-blue-50 text-blue-600';
    if (n.includes('gas')) return base + 'bg-orange-50 text-orange-600';
    return base + 'bg-slate-100 text-slate-600';
  }

  deleteMeter(meter: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Medidor',
        message: `¿Está seguro de eliminar el medidor "${meter.serialNumber}"? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        color: 'warn'
      } as ConfirmDialogData
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && meter.id) {
        this.meterApi.delete(meter.id).subscribe({
          next: () => {
            this.snackBar.open('Medidor eliminado', 'OK', { duration: 3000 });
            this.loadMeters();
          },
          error: () => this.snackBar.open('Error al eliminar el medidor', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }
}
