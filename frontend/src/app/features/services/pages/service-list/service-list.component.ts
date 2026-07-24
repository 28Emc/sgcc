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
import { ServiceApiService, Service } from '../../services/service-api.service';

@Component({
  selector: 'app-service-list',
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
      title="Servicios"
      subtitle="Gestión de servicios disponibles para los inquilinos (agua, luz, internet, etc.)">
      <button mat-raised-button color="primary" (click)="navigateToNew()" class="btn-primary">
        <mat-icon class="mr-1">add</mat-icon>
        Nuevo Servicio
      </button>
    </app-page-header>

    <!-- Filter Search Bar -->
    <div class="toolbar">
      <div class="toolbar-search">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar servicio por nombre o unidad de medida...</mat-label>
          <input matInput [ngModel]="searchTerm()" (ngModelChange)="onSearchChange($event)">
          <mat-icon matSuffix class="text-slate-400">search</mat-icon>
        </mat-form-field>
      </div>

      <div class="total-count">
        Mostrando <span class="font-bold text-slate-800">{{ paginatedServices().length }}</span> de <span class="font-bold text-slate-800">{{ filteredServices().length }}</span> servicios
      </div>
    </div>

    <!-- Loading State -->
    @if (loading()) {
      <app-loading-spinner message="Cargando directorio de servicios..."></app-loading-spinner>
    } @else {
      <!-- Empty State -->
      @if (filteredServices().length === 0) {
        <app-empty-state
          icon="build"
          title="No hay servicios registrados"
          description="Aún no ha registrado ningún servicio o la búsqueda no coincide."
          actionLabel="Registrar Servicio"
          actionIcon="add"
          (actionClicked)="navigateToNew()">
        </app-empty-state>
      } @else {
        <!-- Table View -->
        <mat-card class="card-container">
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="paginatedServices()" class="w-full">
              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Servicio</th>
                <td mat-cell *matCellDef="let service">
                  <div class="flex items-center gap-3 py-1.5">
                    <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                      <mat-icon class="!w-5 !h-5">build</mat-icon>
                    </div>
                    <div>
                      <p class="font-semibold text-slate-900 leading-tight">{{ service.name }}</p>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Measurement Unit Column -->
              <ng-container matColumnDef="measurementUnit">
                <th mat-header-cell *matHeaderCellDef>Unidad de Medida</th>
                <td mat-cell *matCellDef="let service">
                  <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <mat-icon class="!w-3.5 !h-3.5 text-emerald-500">straighten</mat-icon>
                    {{ service.measurementUnit }}
                  </span>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let service">
                  <span [class]="service.status === 'ACTIVE' || !service.status ? 'status-badge status-badge-active' : 'status-badge status-badge-inactive'">
                    {{ service.status === 'ACTIVE' || !service.status ? 'ACTIVO' : 'INACTIVO' }}
                  </span>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="text-right">Acciones</th>
                <td mat-cell *matCellDef="let service" class="text-right">
                  <button mat-icon-button [routerLink]="[service.id]" title="Ver detalle" class="!text-slate-500 hover:!text-emerald-600">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button [routerLink]="[service.id, 'edit']" title="Editar" class="!text-slate-500 hover:!text-emerald-600">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="deleteService(service)" title="Eliminar" class="!text-slate-500 hover:!text-red-600">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <mat-paginator
            [length]="filteredServices().length"
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
export class ServiceListComponent implements OnInit {
  private serviceApi = inject(ServiceApiService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  displayedColumns = ['name', 'measurementUnit', 'status', 'actions'];

  services = signal<Service[]>([]);
  searchTerm = signal('');
  loading = signal(true);
  pageIndex = signal(0);
  pageSize = signal(10);

  filteredServices = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.services();
    return this.services().filter(s =>
      (s.name || '').toLowerCase().includes(term) ||
      (s.measurementUnit || '').toLowerCase().includes(term)
    );
  });

  paginatedServices = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredServices().slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading.set(true);
    this.serviceApi.findAll().subscribe({
      next: (data) => {
        this.services.set(data || []);
        this.loading.set(false);
      },
      error: () => {
        this.services.set([]);
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
    this.router.navigate(['/services/new']);
  }

  deleteService(service: Service): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Servicio',
        message: `¿Está seguro de eliminar el servicio "${service.name}"? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        color: 'warn'
      } as ConfirmDialogData
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && service.id) {
        this.serviceApi.delete(service.id).subscribe({
          next: () => {
            this.snackBar.open('Servicio eliminado', 'OK', { duration: 3000 });
            this.loadServices();
          },
          error: () => this.snackBar.open('Error al eliminar el servicio', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }
}
