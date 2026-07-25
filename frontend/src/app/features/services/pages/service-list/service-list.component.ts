import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { DrawerFieldComponent } from '@shared/components/drawer-field/drawer-field.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { EntityDrawerComponent } from '@shared/components/entity-drawer/entity-drawer.component';
import { ServiceApiService } from '../../services/service-api.service';
import { Service } from '../../models/service.model';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSidenavModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    DrawerFieldComponent,
    EntityDrawerComponent
  ],
  template: `
    <app-page-header
      title="Servicios"
      subtitle="Gestión de servicios disponibles para los inquilinos (agua, luz, internet, etc.)">
      <button mat-raised-button color="primary" (click)="openCreate()">
        <mat-icon>add</mat-icon><span class="button-text">Nuevo servicio</span>
      </button>
    </app-page-header>

    <div class="toolbar">
      <div class="toolbar-search">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar servicio por nombre o unidad</mat-label>
          <input matInput [ngModel]="searchTerm()" (ngModelChange)="onSearchChange($event)">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>
      <div class="total-count">{{ filteredServices().length }} servicios</div>
    </div>

    <!-- Main content area + Drawer -->
    <div class="content-with-drawer">
      @if (loading()) {
        <app-loading-spinner message="Cargando servicios..."></app-loading-spinner>
      } @else if (filteredServices().length === 0) {
        <app-empty-state
          icon="build"
          title="No hay servicios registrados"
          description="Aún no hay servicios en el catálogo o la búsqueda no coincide."
          actionLabel="Registrar servicio"
          actionIcon="add"
          (actionClicked)="openCreate()">
        </app-empty-state>
      } @else {
        <div class="card-container">
          <table mat-table [dataSource]="paginatedServices()">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Servicio</th>
              <td mat-cell *matCellDef="let service">
                <div class="cell-name">
                  <span class="cell-icon cell-icon-primary">
                    <mat-icon>build</mat-icon>
                  </span>
                  <span class="cell-primary">{{ service.name }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="measurementUnit">
              <th mat-header-cell *matHeaderCellDef>Unidad</th>
              <td mat-cell *matCellDef="let service">
                <span class="badge badge-secondary">{{ service.measurementUnit }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let service">
                <span [class]="service.status === 'ACTIVE' || !service.status ? 'badge badge-success' : 'badge badge-neutral'">
                  {{ service.status === 'ACTIVE' || !service.status ? 'ACTIVO' : 'INACTIVO' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let service">
                <div class="cell-actions">
                  <button mat-icon-button title="Ver detalle" (click)="openView(service); $event.stopPropagation()">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button title="Editar" (click)="openEdit(service); $event.stopPropagation()">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button title="Eliminar" (click)="deleteService(service); $event.stopPropagation()" class="btn-icon-danger">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"
                class="clickable-row"
                (click)="openView(row)"></tr>
          </table>

          <mat-paginator
            [length]="filteredServices().length"
            [pageIndex]="pageIndex()"
            [pageSize]="pageSize()"
            [pageSizeOptions]="[5, 10, 25]"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        </div>
      }

      <!-- Detail Drawer -->
      <mat-drawer mode="over" position="end" [opened]="drawerMode() !== 'closed'" (closedStart)="closeDrawer()" class="entity-drawer">
        <app-entity-drawer
          [title]="drawerMode() === 'create' ? 'Nuevo servicio' : selectedService()?.name || 'Servicio'"
          [summaryTpl]="summaryTpl"
          [detailsTpl]="detailsTpl"
          [contentTpl]="contentTpl"
          [actionsTpl]="actionsTpl"
          (close)="closeDrawer()">
        </app-entity-drawer>

        <ng-template #summaryTpl>
          @if (drawerMode() === 'view' && selectedService()) {
            <div class="drawer-summary">
              <span class="drawer-status">
                {{ selectedService()!.status === 'ACTIVE' || !selectedService()!.status ? 'ACTIVO' : 'INACTIVO' }}
              </span>
            </div>
          }
        </ng-template>

        <ng-template #detailsTpl>
          @if (drawerMode() === 'view' && selectedService()) {
            <app-drawer-field label="Servicio">{{ selectedService()!.name }}</app-drawer-field>
            <app-drawer-field label="Unidad de medida">{{ selectedService()!.measurementUnit }}</app-drawer-field>
            <app-drawer-field label="Estado">{{ selectedService()!.status === 'ACTIVE' || !selectedService()!.status ? 'Activo' : 'Inactivo' }}</app-drawer-field>
          }
        </ng-template>

        <ng-template #contentTpl>
          @if (drawerMode() === 'edit' || drawerMode() === 'create') {
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="drawer-section">
                <mat-form-field appearance="outline" class="drawer-field">
                  <mat-label>Nombre del servicio</mat-label>
                  <input matInput formControlName="name" placeholder="Ej: Agua, Luz, Internet">
                  @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
                    <mat-error>El nombre es requerido</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="drawer-field">
                  <mat-label>Unidad de medida</mat-label>
                  <input matInput formControlName="measurementUnit" placeholder="Ej: m³, kWh, MB">
                  @if (form.get('measurementUnit')?.hasError('required') && form.get('measurementUnit')?.touched) {
                    <mat-error>La unidad de medida es requerida</mat-error>
                  }
                </mat-form-field>
              </div>
            </form>
          }
        </ng-template>

        <ng-template #actionsTpl>
          @if (drawerMode() === 'view' && selectedService()) {
            <button mat-stroked-button type="button" (click)="openEdit(selectedService()!)">
              <mat-icon>edit</mat-icon><span class="button-text">Editar</span>
            </button>
            <button mat-stroked-button color="warn" type="button" (click)="deleteService(selectedService()!)">
              <mat-icon>delete</mat-icon><span class="button-text">Eliminar</span>
            </button>
          }
          @if (drawerMode() === 'edit' || drawerMode() === 'create') {
            <button mat-stroked-button type="button" (click)="closeDrawer()">Cancelar</button>
            <button mat-raised-button color="primary" type="button" (click)="onSubmit()" [disabled]="form.invalid || saving()">
              <mat-icon>{{ drawerMode() === 'edit' ? 'save' : 'add' }}</mat-icon>
              <span class="button-text">{{ drawerMode() === 'edit' ? 'Guardar cambios' : 'Crear servicio' }}</span>
            </button>
          }
        </ng-template>
      </mat-drawer>
    </div>
  `,
  styles: [`
    .content-with-drawer {
      position: relative;
    }

    .entity-drawer {
      width: 460px !important;
    }

    .cell-name {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .cell-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .cell-icon mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .cell-icon-primary {
      background: var(--color-primary-50);
      color: var(--color-primary-600);
    }

    .cell-primary {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .cell-actions {
      display: flex;
      justify-content: flex-end;
      gap: 2px;
    }

    .btn-icon-danger:hover {
      color: #dc2626 !important;
    }

    .drawer-summary {
      padding: 4px 0;
    }

    .drawer-section {
      display: grid;
      gap: 16px;
      margin-top: 4px;
    }

    .drawer-field {
      width: 100%;
      margin-bottom: 0 !important;
    }
  `]
})
export class ServiceListComponent implements OnInit {
  private serviceApi = inject(ServiceApiService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  displayedColumns = ['name', 'measurementUnit', 'status', 'actions'];

  services = signal<Service[]>([]);
  searchTerm = signal('');
  loading = signal(true);
  saving = signal(false);
  pageIndex = signal(0);
  pageSize = signal(10);
  drawerMode = signal<'closed' | 'view' | 'edit' | 'create'>('closed');
  selectedService = signal<Service | null>(null);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    measurementUnit: ['', Validators.required]
  });

  filteredServices = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.services();
    return this.services().filter(service =>
      service.name.toLowerCase().includes(term) ||
      service.measurementUnit.toLowerCase().includes(term)
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
      next: (data) => { this.services.set(data || []); this.loading.set(false); },
      error: () => { this.services.set([]); this.loading.set(false); }
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

  /* ── Drawer operations ── */

  openView(service: Service): void {
    this.selectedService.set(service);
    this.drawerMode.set('view');
  }

  openEdit(service: Service): void {
    this.selectedService.set(service);
    this.drawerMode.set('edit');
    this.form.setValue({
      name: service.name,
      measurementUnit: service.measurementUnit
    });
  }

  openCreate(): void {
    this.selectedService.set(null);
    this.drawerMode.set('create');
    this.form.reset({ name: '', measurementUnit: '' });
  }

  closeDrawer(): void {
    this.drawerMode.set('closed');
    this.selectedService.set(null);
    this.form.reset({ name: '', measurementUnit: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const serviceData: Service = this.form.value;
    const selected = this.selectedService();
    const request = this.drawerMode() === 'edit' && selected?.id
      ? this.serviceApi.update(selected.id, serviceData)
      : this.serviceApi.create(serviceData);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.drawerMode() === 'edit' ? 'Servicio actualizado' : 'Servicio creado',
          'OK',
          { duration: 3000 }
        );
        this.saving.set(false);
        this.closeDrawer();
        this.loadServices();
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open('Error al guardar el servicio', 'Cerrar', { duration: 3000 });
      }
    });
  }

  deleteService(service: Service): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar servicio',
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
            if (this.selectedService()?.id === service.id) {
              this.closeDrawer();
            }
            this.loadServices();
          },
          error: () => {
            this.snackBar.open('Error al eliminar el servicio', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }
}
