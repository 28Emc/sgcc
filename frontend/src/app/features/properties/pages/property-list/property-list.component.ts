import { Component, OnInit, signal, computed, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { DrawerFieldComponent } from '@shared/components/drawer-field/drawer-field.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { PropertyApiService, Property } from '../../services/property-api.service';
import { UnitApiService, Unit } from '../../../units/services/unit-api.service';

type DrawerMode = 'closed' | 'view' | 'edit' | 'create';

@Component({
  selector: 'app-property-list',
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
    MatSelectModule,
    MatSidenavModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatPaginatorModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    DrawerFieldComponent,
  ],
  template: `
    <app-page-header
      title="Propiedades"
      subtitle="Administración de inmuebles y condominios">
      <button mat-raised-button color="primary" (click)="openCreate()">
        <mat-icon>add</mat-icon>
        Nueva Propiedad
      </button>
    </app-page-header>

    <!-- Search Toolbar -->
    <div class="toolbar">
      <div class="toolbar-search">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar por nombre o dirección...</mat-label>
          <input matInput [ngModel]="searchTerm()" (ngModelChange)="onSearchChange($event)">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>
      <div class="total-count">
        {{ filteredProperties().length }} propiedades
      </div>
    </div>

    <!-- Main content area + Drawer -->
    <div class="content-with-drawer">
      <!-- Table -->
      @if (loading()) {
        <app-loading-spinner message="Cargando propiedades..."></app-loading-spinner>
      } @else if (filteredProperties().length === 0) {
        <app-empty-state
          icon="apartment"
          title="No se encontraron propiedades"
          description="Aún no hay propiedades registradas o la búsqueda no arrojó resultados."
          actionLabel="Crear Propiedad"
          actionIcon="add"
          (actionClicked)="openCreate()">
        </app-empty-state>
      } @else {
        <div class="card-container">
          <table mat-table [dataSource]="paginatedProperties()">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let p">
                <div class="cell-name">
                  <span class="cell-icon">
                    <mat-icon>apartment</mat-icon>
                  </span>
                  <div>
                    <span class="cell-primary">{{ p.name }}</span>
                    <span class="cell-sub">{{ p.description || 'Sin descripción' }}</span>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="address">
              <th mat-header-cell *matHeaderCellDef>Dirección</th>
              <td mat-cell *matCellDef="let p">
                <span class="cell-address">
                  <mat-icon>location_on</mat-icon>
                  {{ p.address }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let p">
                <span [class]="p.status === 'ACTIVE' || !p.status ? 'badge badge-success' : 'badge badge-neutral'">
                  {{ p.status === 'ACTIVE' || !p.status ? 'ACTIVO' : 'INACTIVO' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let p">
                <div class="cell-actions">
                  <button mat-icon-button (click)="openView(p); $event.stopPropagation()" title="Ver detalle">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button (click)="openEdit(p); $event.stopPropagation()" title="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="deleteProperty(p); $event.stopPropagation()" title="Eliminar" class="btn-icon-danger">
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
            [length]="filteredProperties().length"
            [pageIndex]="pageIndex()"
            [pageSize]="pageSize()"
            [pageSizeOptions]="[5, 10, 25]"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        </div>
      }

      <!-- Detail Drawer -->
      <mat-drawer #drawer mode="over" position="end" [opened]="drawerMode() !== 'closed'" (closedStart)="closeDrawer()" class="entity-drawer">
        @if (drawerMode() === 'view' && selectedProperty()) {
          <!-- VIEW MODE -->
          <div class="drawer-header">
            <div class="drawer-header-text">
              <h2 class="drawer-title">{{ selectedProperty()!.name }}</h2>
              <p class="drawer-subtitle">{{ selectedProperty()!.address }}</p>
            </div>
            <button mat-icon-button (click)="closeDrawer()" title="Cerrar">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <mat-divider></mat-divider>

          <div class="drawer-body">
            <!-- Summary -->
            <div class="drawer-section">
              <div class="drawer-summary-row">
                <span [class]="selectedProperty()!.status === 'ACTIVE' ? 'badge badge-success' : 'badge badge-neutral'">
                  {{ selectedProperty()!.status === 'ACTIVE' ? 'ACTIVO' : 'INACTIVO' }}
                </span>
                <span class="drawer-summary-count">
                  {{ propertyUnits().length }} unidades
                </span>
              </div>
            </div>

            <mat-divider></mat-divider>

            <!-- Details -->
            <div class="drawer-section">
              <div class="drawer-section-header">
                <mat-icon>info</mat-icon>
                <h4>Detalles</h4>
              </div>
              <app-drawer-field label="Nombre">{{ selectedProperty()!.name }}</app-drawer-field>
              <app-drawer-field label="Dirección">{{ selectedProperty()!.address }}</app-drawer-field>
              <app-drawer-field label="Descripción">{{ selectedProperty()!.description || 'Sin descripción' }}</app-drawer-field>
              <app-drawer-field label="Estado">
                {{ selectedProperty()!.status === 'ACTIVE' ? 'Activo' : 'Inactivo' }}
              </app-drawer-field>
            </div>

            <!-- Units -->
            @if (propertyUnits().length > 0) {
              <mat-divider></mat-divider>
              <div class="drawer-section">
                <div class="drawer-section-header">
                  <mat-icon>home</mat-icon>
                  <h4>Unidades ({{ propertyUnits().length }})</h4>
                </div>
                <div class="units-grid">
                  @for (unit of propertyUnits(); track unit.id) {
                    <div class="unit-chip">
                      <span class="unit-chip-name">{{ unit.name }}</span>
                      <span [class]="unit.status === 'ACTIVE' ? 'badge badge-success badge-xs' : 'badge badge-neutral badge-xs'">
                        {{ unit.status === 'ACTIVE' ? 'ACT' : 'INA' }}
                      </span>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Actions -->
            <mat-divider></mat-divider>
            <div class="drawer-actions">
              <button mat-stroked-button (click)="openEdit(selectedProperty()!)">
                <mat-icon>edit</mat-icon> Editar
              </button>
              <button mat-stroked-button color="warn" (click)="deleteProperty(selectedProperty()!)">
                <mat-icon>delete</mat-icon> Eliminar
              </button>
            </div>
          </div>
        }

        @if (drawerMode() === 'edit' || drawerMode() === 'create') {
          <!-- EDIT / CREATE MODE -->
          <div class="drawer-header">
            <div class="drawer-header-text">
              <h2 class="drawer-title">{{ drawerMode() === 'edit' ? 'Editar Propiedad' : 'Nueva Propiedad' }}</h2>
              <p class="drawer-subtitle">{{ drawerMode() === 'edit' ? 'Modificar datos del inmueble' : 'Registrar un nuevo inmueble' }}</p>
            </div>
            <button mat-icon-button (click)="closeDrawer()" title="Cerrar">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <mat-divider></mat-divider>

          <div class="drawer-body">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="drawer-section">
                <div class="drawer-section-header">
                  <mat-icon>edit</mat-icon>
                  <h4>Datos de la Propiedad</h4>
                </div>

                <mat-form-field appearance="outline" class="drawer-field">
                  <mat-label>Nombre del inmueble</mat-label>
                  <input matInput formControlName="name" placeholder="Edificio Los Olivos">
                  @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
                    <mat-error>El nombre es obligatorio</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="drawer-field">
                  <mat-label>Dirección</mat-label>
                  <textarea matInput formControlName="address" rows="2" placeholder="Av. Las Palmeras 456"></textarea>
                  @if (form.get('address')?.hasError('required') && form.get('address')?.touched) {
                    <mat-error>La dirección es obligatoria</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="drawer-field">
                  <mat-label>Descripción</mat-label>
                  <textarea matInput formControlName="description" rows="2" placeholder="Detalles adicionales..."></textarea>
                </mat-form-field>
              </div>

              <mat-divider></mat-divider>

              <div class="drawer-actions">
                <button mat-stroked-button type="button" (click)="closeDrawer()">Cancelar</button>
                <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving()">
                  @if (saving()) {
                    <mat-icon class="spinning">sync</mat-icon>
                  } @else {
                    <mat-icon>save</mat-icon>
                  }
                  <span class="button-text">{{ saving() ? 'Guardando...' : (drawerMode() === 'edit' ? 'Actualizar' : 'Crear') }}</span>
                </button>
              </div>
            </form>
          </div>
        }
      </mat-drawer>
    </div>
  `,
  styles: [`
    .content-with-drawer {
      position: relative;
    }

    .entity-drawer {
      width: 480px !important;
    }

    /* ── Table Cell Layouts ── */
    .cell-name {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .cell-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--color-primary-50);
      color: var(--color-primary-600);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .cell-icon mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .cell-primary {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .cell-sub {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
      max-width: 280px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .cell-address {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .cell-address mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: var(--text-muted);
    }

    .cell-actions {
      display: flex;
      justify-content: flex-end;
      gap: 2px;
    }

    .btn-icon-danger:hover {
      color: #dc2626 !important;
    }

    /* ── Drawer Styles ── */
    .drawer-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      padding: 20px 20px 12px;
    }

    .drawer-header-text { flex: 1; min-width: 0; }

    .drawer-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    .drawer-subtitle {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin: 4px 0 0;
    }

    .drawer-body {
      padding: 16px 20px 20px;
      overflow-y: auto;
      flex: 1;
    }

    .drawer-section { margin-bottom: 20px; }

    .drawer-summary-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .drawer-summary-count {
      font-size: 0.85rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .units-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .unit-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: var(--surface-bg);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-sm);
    }

    .unit-chip-name {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .badge-xs {
      padding: 1px 6px;
      font-size: 0.6rem;
    }

    .drawer-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
      margin-top: 16px;
    }

    .drawer-field {
      width: 100%;
      margin-bottom: 0 !important;
    }

    .spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class PropertyListComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;

  private propertyApi = inject(PropertyApiService);
  private unitApi = inject(UnitApiService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  displayedColumns = ['name', 'address', 'status', 'actions'];

  properties = signal<Property[]>([]);
  searchTerm = signal('');
  loading = signal(true);
  pageIndex = signal(0);
  pageSize = signal(10);

  drawerMode = signal<DrawerMode>('closed');
  selectedProperty = signal<Property | null>(null);
  propertyUnits = signal<Unit[]>([]);
  saving = signal(false);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    description: ['']
  });

  filteredProperties = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.properties();
    return this.properties().filter(p =>
      (p.name || '').toLowerCase().includes(term) ||
      (p.address || '').toLowerCase().includes(term)
    );
  });

  paginatedProperties = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredProperties().slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.loading.set(true);
    this.propertyApi.findAll().subscribe({
      next: (data) => { this.properties.set(data || []); this.loading.set(false); },
      error: () => { this.properties.set([]); this.loading.set(false); }
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

  openView(property: Property): void {
    this.selectedProperty.set(property);
    this.drawerMode.set('view');
    this.loadPropertyUnits(property.id!);
  }

  openEdit(property: Property): void {
    this.selectedProperty.set(property);
    this.form.patchValue({
      name: property.name,
      address: property.address,
      description: property.description || ''
    });
    this.drawerMode.set('edit');
  }

  openCreate(): void {
    this.selectedProperty.set(null);
    this.form.reset({ name: '', address: '', description: '' });
    this.drawerMode.set('create');
  }

  closeDrawer(): void {
    this.drawerMode.set('closed');
    this.selectedProperty.set(null);
    this.propertyUnits.set([]);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);

    const payload: Property = this.form.getRawValue();
    const mode = this.drawerMode();
    const id = this.selectedProperty()?.id;

    const request$ = mode === 'edit' && id
      ? this.propertyApi.update(id, payload)
      : this.propertyApi.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.snackBar.open(
          mode === 'edit' ? 'Propiedad actualizada' : 'Propiedad creada',
          'OK',
          { duration: 3000 }
        );
        this.closeDrawer();
        this.loadProperties();
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open('Error al guardar. Intente de nuevo.', 'Cerrar', { duration: 4000 });
      }
    });
  }

  deleteProperty(property: Property): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Propiedad',
        message: `¿Está seguro de eliminar "${property.name}"? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        color: 'warn'
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && property.id) {
        this.propertyApi.delete(property.id).subscribe({
          next: () => {
            this.snackBar.open('Propiedad eliminada', 'OK', { duration: 3000 });
            this.closeDrawer();
            this.loadProperties();
          },
          error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }

  private loadPropertyUnits(propertyId: string): void {
    this.unitApi.findByPropertyId(propertyId).subscribe({
      next: (data) => this.propertyUnits.set(data || []),
      error: () => this.propertyUnits.set([])
    });
  }
}
