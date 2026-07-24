import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

type DrawerMode = 'closed' | 'view' | 'edit' | 'create';

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

    <mat-drawer-container class="drawer-container">
      <mat-drawer-content>
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
          <mat-card class="card-container">
            <div class="overflow-x-auto">
              <table mat-table [dataSource]="paginatedServices()" class="w-full">

                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Servicio</th>
                  <td mat-cell *matCellDef="let service">
                    <button mat-button class="table-button" type="button" (click)="openView(service)">
                      <span class="service-chip"><mat-icon>build</mat-icon><span class="chip-text">{{ service.name }}</span></span>
                    </button>
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
                    <span [class]="service.status === 'ACTIVE' || !service.status ? 'status-badge status-badge-active' : 'status-badge status-badge-inactive'">
                      {{ service.status === 'ACTIVE' || !service.status ? 'ACTIVO' : 'INACTIVO' }}
                    </span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef class="text-right">Acciones</th>
                  <td mat-cell *matCellDef="let service" class="text-right">
                    <button mat-icon-button title="Ver detalle" (click)="openView(service); $event.stopPropagation()">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button mat-icon-button title="Editar" (click)="openEdit(service); $event.stopPropagation()">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" title="Eliminar" (click)="deleteService(service); $event.stopPropagation()">
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
      </mat-drawer-content>

      <mat-drawer mode="over" position="end" [opened]="drawerMode() !== 'closed'" class="entity-drawer">
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

          @if (drawerMode() === 'edit' || drawerMode() === 'create') {
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="drawer-section">
                <mat-form-field appearance="outline" class="drawer-form-field">
                  <mat-label>Nombre del servicio</mat-label>
                  <input matInput formControlName="name" placeholder="Ej: Agua, Luz, Internet">
                  @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
                    <mat-error>El nombre es requerido</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="drawer-form-field">
                  <mat-label>Unidad de medida</mat-label>
                  <input matInput formControlName="measurementUnit" placeholder="Ej: m³, kWh, MB">
                  @if (form.get('measurementUnit')?.hasError('required') && form.get('measurementUnit')?.touched) {
                    <mat-error>La unidad de medida es requerida</mat-error>
                  }
                </mat-form-field>
              </div>

              <div class="drawer-actions drawer-form-actions">
                <button mat-stroked-button type="button" (click)="closeDrawer()">Cancelar</button>
                <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving()">
                  <mat-icon>{{ drawerMode() === 'edit' ? 'save' : 'add' }}</mat-icon><span class="button-text">{{ drawerMode() === 'edit' ? 'Guardar cambios' : 'Crear servicio' }}</span>
                </button>
              </div>
            </form>
          }
        </ng-template>

        <ng-template #contentTpl></ng-template>

        <ng-template #actionsTpl>
          @if (drawerMode() === 'view' && selectedService()) {
            <button mat-stroked-button type="button" (click)="openEdit(selectedService()!)">
              <mat-icon>edit</mat-icon><span class="button-text">Editar</span>
            </button>
            <button mat-stroked-button color="warn" type="button" (click)="deleteService(selectedService()!)">
              <mat-icon>delete</mat-icon><span class="button-text">Eliminar</span>
            </button>
          }
        </ng-template>
      </mat-drawer>
    </mat-drawer-container>
  `,
  styles: [`
      .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        margin-bottom: 20px;
      }

      .toolbar-search {
        flex: 1;
        min-width: 0;
      }

      .search-field {
        width: 100%;
      }

      .total-count {
        color: var(--text-secondary);
        font-size: 0.95rem;
        white-space: nowrap;
      }

      .card-container {
        padding: 0;
      }

      .table-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        justify-content: flex-start;
        text-transform: none;
      }

      .service-chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--text-primary);
        font-weight: 600;
      }

      .badge-secondary {
        display: inline-flex;
        align-items: center;
        padding: 0.4rem 0.75rem;
        border-radius: 9999px;
        background: var(--surface-2);
        color: var(--text-secondary);
        font-size: 0.8rem;
        font-weight: 600;
      }

      .drawer-container {
        position: relative;
        min-height: 0;
      }

      .entity-drawer {
        width: 460px;
      }

      .drawer-section {
        display: grid;
        gap: 16px;
        margin-top: 16px;
      }

      .drawer-form-field {
        width: 100%;
      }

      .drawer-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        padding: 16px 0 0;
      }

      .drawer-form-actions {
        border-top: 1px solid var(--surface-border-light);
        padding-top: 16px;
      }
    `]
})
export class ServiceListComponent implements OnInit {
  private serviceApi = inject(ServiceApiService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  displayedColumns = ['name', 'measurementUnit', 'status', 'actions'];

  services = signal<Service[]>([]);
  searchTerm = signal('');
  loading = signal(true);
  saving = signal(false);
  pageIndex = signal(0);
  pageSize = signal(10);
  drawerMode = signal<DrawerMode>('closed');
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
    this.route.paramMap.subscribe(() => this.handleRouteState());
    this.loadServices();
  }

  loadServices(): void {
    this.loading.set(true);
    this.serviceApi.findAll().subscribe({
      next: (data) => {
        this.services.set(data || []);
        this.loading.set(false);
        this.handleRouteState();
      },
      error: () => {
        this.services.set([]);
        this.loading.set(false);
        this.handleRouteState();
      }
    });
  }

  private handleRouteState(): void {
    const routePath = this.route.snapshot.routeConfig?.path;
    const serviceId = this.route.snapshot.paramMap.get('id');

    if (routePath === 'new') {
      this.openCreate(false);
      return;
    }

    if (routePath === ':id') {
      this.openViewById(serviceId, false);
      return;
    }

    if (routePath === ':id/edit') {
      this.openEditById(serviceId, false);
      return;
    }

    this.closeDrawer(false);
  }

  private openViewById(serviceId: string | null, navigate = true): void {
    if (!serviceId) {
      this.closeDrawer(navigate);
      return;
    }

    const existing = this.services().find(service => service.id === serviceId);
    if (existing) {
      this.openView(existing, navigate);
      return;
    }

    this.loading.set(true);
    this.serviceApi.findById(serviceId).subscribe({
      next: (service) => {
        this.openView(service, navigate);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.closeDrawer(navigate);
      }
    });
  }

  private openEditById(serviceId: string | null, navigate = true): void {
    if (!serviceId) {
      this.closeDrawer(navigate);
      return;
    }

    const existing = this.services().find(service => service.id === serviceId);
    if (existing) {
      this.openEdit(existing, navigate);
      return;
    }

    this.loading.set(true);
    this.serviceApi.findById(serviceId).subscribe({
      next: (service) => {
        this.openEdit(service, navigate);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.closeDrawer(navigate);
      }
    });
  }

  openCreate(navigate = true): void {
    this.selectedService.set(null);
    this.drawerMode.set('create');
    this.form.reset({ name: '', measurementUnit: '' });
    if (navigate) {
      this.router.navigate(['new'], { relativeTo: this.route });
    }
  }

  openView(service: Service, navigate = true): void {
    this.selectedService.set(service);
    this.drawerMode.set('view');
    if (navigate) {
      this.router.navigate([service.id], { relativeTo: this.route });
    }
  }

  openEdit(service: Service, navigate = true): void {
    this.selectedService.set(service);
    this.drawerMode.set('edit');
    this.form.setValue({
      name: service.name,
      measurementUnit: service.measurementUnit
    });
    if (navigate) {
      this.router.navigate([service.id, 'edit'], { relativeTo: this.route });
    }
  }

  closeDrawer(navigate = true): void {
    this.drawerMode.set('closed');
    this.selectedService.set(null);
    this.form.reset({ name: '', measurementUnit: '' });
    if (navigate) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.pageIndex.set(0);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
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
