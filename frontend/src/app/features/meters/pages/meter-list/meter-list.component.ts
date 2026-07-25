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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { DrawerFieldComponent } from '@shared/components/drawer-field/drawer-field.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { MeterApiService, Meter } from '../../services/meter-api.service';
import { ServiceApiService, Service } from '../../../services/services/service-api.service';
import { UnitApiService, Unit } from '../../../units/services/unit-api.service';
import { ReadingApiService, Reading } from '../../../readings/services/reading-api.service';

type DrawerMode = 'closed' | 'view' | 'edit' | 'create';

@Component({
  selector: 'app-meter-list',
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
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    DrawerFieldComponent,
  ],
  template: `
    <app-page-header
      title="Medidores de Servicios"
      subtitle="Registro de contadores eléctricos, de agua potable y otros servicios por unidad">
      <button mat-raised-button color="primary" (click)="openCreate()">
        <mat-icon>add</mat-icon>
        Nuevo Medidor
      </button>
    </app-page-header>

    <!-- Search Toolbar -->
    <div class="toolbar">
      <div class="toolbar-search">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar por número de serie, unidad o propiedad...</mat-label>
          <input matInput [ngModel]="searchTerm()" (ngModelChange)="onSearchChange($event)">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>
      <div class="total-count">
        {{ filteredMeters().length }} medidores
      </div>
    </div>

    <!-- Main content area + Drawer -->
    <div class="content-with-drawer">
      @if (loading()) {
        <app-loading-spinner message="Cargando medidores..."></app-loading-spinner>
      } @else if (filteredMeters().length === 0) {
        <app-empty-state
          icon="speed"
          title="No hay medidores registrados"
          description="Aún no ha asociado ningún medidor de servicio público a las unidades."
          actionLabel="Agregar Medidor"
          actionIcon="add"
          (actionClicked)="openCreate()">
        </app-empty-state>
      } @else {
        <div class="card-container">
          <table mat-table [dataSource]="paginatedMeters()">
            <ng-container matColumnDef="serialNumber">
              <th mat-header-cell *matHeaderCellDef>N° Serie / Código</th>
              <td mat-cell *matCellDef="let meter">
                <div class="cell-name">
                  <span [class]="getServiceIconClass(meter.serviceName)">
                    <mat-icon class="!w-5 !h-5">{{ getServiceIcon(meter.serviceName) }}</mat-icon>
                  </span>
                  <div>
                    <span class="cell-primary font-mono">{{ meter.serialNumber }}</span>
                    <span class="cell-sub">{{ meter.serviceName }}</span>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="location">
              <th mat-header-cell *matHeaderCellDef>Asignación</th>
              <td mat-cell *matCellDef="let meter">
                <div>
                  <span class="cell-primary">{{ meter.propertyName }}</span>
                  <span class="cell-sub">{{ meter.unitName }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="lastReading">
              <th mat-header-cell *matHeaderCellDef>Última Lectura</th>
              <td mat-cell *matCellDef="let meter">
                <span class="font-mono text-sm font-bold text-slate-900">
                  {{ meter.lastReadingValue != null ? (meter.lastReadingValue | number:'1.0-2') : '—' }}
                </span>
                <span class="text-xs text-slate-500 ml-1">{{ meter.unitOfMeasure || '' }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let meter">
                <span [class]="meter.status === 'ACTIVE' ? 'badge badge-success' : 'badge badge-neutral'">
                  {{ meter.status === 'ACTIVE' ? 'OPERATIVO' : 'INACTIVO' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let meter">
                <div class="cell-actions">
                  <button mat-icon-button (click)="openView(meter); $event.stopPropagation()" title="Ver detalle">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button (click)="openEdit(meter); $event.stopPropagation()" title="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="deleteMeter(meter); $event.stopPropagation()" title="Eliminar" class="btn-icon-danger">
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
            [length]="filteredMeters().length"
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
        <!-- VIEW MODE -->
        @if (drawerMode() === 'view' && selectedMeter()) {
          <div class="drawer-header">
            <div class="drawer-header-text">
              <h2 class="drawer-title font-mono">{{ selectedMeter()!.serialNumber }}</h2>
              <p class="drawer-subtitle">{{ selectedMeter()!.serviceName || 'Servicio' }} — {{ selectedMeter()!.unitName || 'Sin unidad' }}</p>
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
                <span [class]="selectedMeter()!.status === 'ACTIVE' ? 'badge badge-success' : 'badge badge-neutral'">
                  {{ selectedMeter()!.status === 'ACTIVE' ? 'OPERATIVO' : 'INACTIVO' }}
                </span>
                <span class="drawer-summary-count">
                  {{ selectedMeter()!.propertyName || '—' }}
                </span>
              </div>
            </div>

            <mat-divider></mat-divider>

            <!-- Details -->
            <div class="drawer-section">
              <div class="drawer-section-header">
                <mat-icon>info</mat-icon>
                <h4>Datos del Medidor</h4>
              </div>
              <app-drawer-field label="Servicio">
                <div class="flex items-center gap-2">
                  <mat-icon class="!w-4 !h-4" [style.color]="getServiceColor(selectedMeter()?.serviceName)">{{ getServiceIcon(selectedMeter()?.serviceName) }}</mat-icon>
                  {{ selectedMeter()?.serviceName || '—' }}
                </div>
              </app-drawer-field>
              <app-drawer-field label="Unidad Asignada">{{ selectedMeter()!.unitName || 'Sin asignar' }}</app-drawer-field>
              <app-drawer-field label="Propiedad">{{ selectedMeter()!.propertyName || '—' }}</app-drawer-field>
              <app-drawer-field label="Última Lectura">
                <span class="font-mono font-bold">
                  {{ selectedMeter()!.lastReadingValue != null ? (selectedMeter()!.lastReadingValue! | number:'1.0-2') : '—' }}
                </span>
                <span class="text-xs text-slate-400 ml-1">{{ selectedMeter()!.unitOfMeasure || '' }}</span>
              </app-drawer-field>
            </div>

            <!-- Reading History -->
            @if (readingsForMeter().length > 0) {
              <mat-divider></mat-divider>
              <div class="drawer-section">
                <div class="drawer-section-header">
                  <mat-icon>history</mat-icon>
                  <h4>Historial de Lecturas ({{ readingsForMeter().length }})</h4>
                </div>
                <div class="space-y-2">
                  @for (reading of readingsForMeter(); track reading.id) {
                    <div class="reading-row">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <mat-icon class="!w-4 !h-4">speed</mat-icon>
                        </div>
                        <div>
                          <p class="text-xs text-slate-500">{{ reading.readingDate }}</p>
                          <p class="font-mono text-sm font-bold text-slate-900">{{ reading.readingValue | number:'1.0-2' }}</p>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Actions -->
            <mat-divider></mat-divider>
            <div class="drawer-actions">
              <button mat-stroked-button (click)="openEdit(selectedMeter()!)">
                <mat-icon>edit</mat-icon><span class="button-text">Editar</span>
              </button>
              <button mat-stroked-button color="warn" (click)="deleteMeter(selectedMeter()!)">
                <mat-icon>delete</mat-icon><span class="button-text">Eliminar</span>
              </button>
            </div>
          </div>
        }

        <!-- EDIT / CREATE MODE -->
        @if (drawerMode() === 'edit' || drawerMode() === 'create') {
          <div class="drawer-header">
            <div class="drawer-header-text">
              <h2 class="drawer-title">{{ drawerMode() === 'edit' ? 'Editar Medidor' : 'Nuevo Medidor' }}</h2>
              <p class="drawer-subtitle">{{ drawerMode() === 'edit' ? 'Modificar datos del medidor' : 'Registrar un nuevo medidor de servicio público' }}</p>
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
                  <h4>Datos del Medidor</h4>
                </div>

                <mat-form-field appearance="outline" class="drawer-field">
                  <mat-label>Número de Serie / Código</mat-label>
                  <input matInput formControlName="serialNumber" placeholder="ej. MED-ELEC-101">
                  <mat-icon matSuffix class="text-slate-400">tag</mat-icon>
                  @if (form.get('serialNumber')?.hasError('required') && form.get('serialNumber')?.touched) {
                    <mat-error>El número de serie es obligatorio</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="drawer-field">
                  <mat-label>Tipo de Servicio</mat-label>
                  <mat-select formControlName="serviceId">
                    @for (svc of services(); track svc.id) {
                      <mat-option [value]="svc.id">
                        <div class="flex items-center gap-2">
                          <mat-icon class="!w-4 !h-4" [class]="getServiceIconClass(svc.name)">{{ getServiceIcon(svc.name) }}</mat-icon>
                          {{ svc.name }} ({{ svc.measurementUnit }})
                        </div>
                      </mat-option>
                    }
                  </mat-select>
                  @if (form.get('serviceId')?.hasError('required') && form.get('serviceId')?.touched) {
                    <mat-error>Debe seleccionar un servicio</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="drawer-field">
                  <mat-label>Unidad Asignada</mat-label>
                  <mat-select formControlName="unitId">
                    @for (unit of units(); track unit.id) {
                      <mat-option [value]="unit.id">{{ unit.name }}</mat-option>
                    }
                  </mat-select>
                  <mat-icon matSuffix class="text-slate-400">door_front</mat-icon>
                  @if (form.get('unitId')?.hasError('required') && form.get('unitId')?.touched) {
                    <mat-error>Debe seleccionar una unidad</mat-error>
                  }
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

    .cell-actions {
      display: flex;
      justify-content: flex-end;
      gap: 2px;
    }

    .btn-icon-danger:hover {
      color: #dc2626 !important;
    }

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

    .reading-row {
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid var(--surface-border-light);
      background: var(--surface-bg);
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
export class MeterListComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;

  private meterApi = inject(MeterApiService);
  private serviceApi = inject(ServiceApiService);
  private unitApi = inject(UnitApiService);
  private readingApi = inject(ReadingApiService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  displayedColumns = ['serialNumber', 'location', 'lastReading', 'status', 'actions'];

  meters = signal<Meter[]>([]);
  services = signal<Service[]>([]);
  units = signal<Unit[]>([]);
  readingsForMeter = signal<Reading[]>([]);
  searchTerm = signal('');
  loading = signal(true);
  pageIndex = signal(0);
  pageSize = signal(10);

  drawerMode = signal<DrawerMode>('closed');
  selectedMeter = signal<Meter | null>(null);
  saving = signal(false);

  form: FormGroup = this.fb.group({
    serialNumber: ['', Validators.required],
    serviceId: ['', Validators.required],
    unitId: ['', Validators.required]
  });

  filteredMeters = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.meters();
    return this.meters().filter(m =>
      (m.serialNumber || '').toLowerCase().includes(term) ||
      (m.propertyName || '').toLowerCase().includes(term) ||
      (m.unitName || '').toLowerCase().includes(term) ||
      (m.serviceName || '').toLowerCase().includes(term)
    );
  });

  paginatedMeters = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredMeters().slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.meterApi.findAll().subscribe({
      next: (data) => { this.meters.set(data || []); this.loading.set(false); },
      error: () => { this.meters.set([]); this.loading.set(false); }
    });
    this.serviceApi.findAll().subscribe({
      next: (data) => this.services.set(data || []),
      error: () => this.services.set([])
    });
    this.unitApi.findAll().subscribe({
      next: (data) => this.units.set(data || []),
      error: () => this.units.set([])
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

  openView(meter: Meter): void {
    this.selectedMeter.set(meter);
    this.drawerMode.set('view');
    this.loadMeterReadings(meter.id!);
  }

  openEdit(meter: Meter): void {
    this.selectedMeter.set(meter);
    this.form.patchValue({
      serialNumber: meter.serialNumber,
      serviceId: meter.serviceId,
      unitId: meter.unitId
    });
    this.drawerMode.set('edit');
  }

  openCreate(): void {
    this.selectedMeter.set(null);
    this.form.reset({ serialNumber: '', serviceId: '', unitId: '' });
    this.drawerMode.set('create');
  }

  closeDrawer(): void {
    this.drawerMode.set('closed');
    this.selectedMeter.set(null);
    this.readingsForMeter.set([]);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);

    const payload: Meter = this.form.getRawValue();
    const mode = this.drawerMode();
    const id = this.selectedMeter()?.id;

    const request$ = mode === 'edit' && id
      ? this.meterApi.update(id, payload)
      : this.meterApi.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.snackBar.open(
          mode === 'edit' ? 'Medidor actualizado' : 'Medidor creado',
          'OK',
          { duration: 3000 }
        );
        this.closeDrawer();
        this.loadData();
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open('Error al guardar. Intente de nuevo.', 'Cerrar', { duration: 4000 });
      }
    });
  }

  deleteMeter(meter: Meter): void {
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
            this.closeDrawer();
            this.loadData();
          },
          error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }

  private loadMeterReadings(meterId: string): void {
    this.readingApi.findAll().subscribe({
      next: (all) => {
        const meterReadings = all
          .filter((r: any) => r.meterId === meterId)
          .sort((a: any, b: any) => (b.readingDate || '').localeCompare(a.readingDate || ''));
        this.readingsForMeter.set(meterReadings);
      },
      error: () => this.readingsForMeter.set([])
    });
  }

  getServiceIcon(name?: string): string {
    const n = (name || '').toLowerCase();
    if (n.includes('electricidad') || n.includes('electr')) return 'bolt';
    if (n.includes('agua')) return 'water_drop';
    if (n.includes('gas')) return 'local_fire_department';
    return 'speed';
  }

  getServiceIconClass(name?: string): string {
    const base = 'w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-sm ';
    const n = (name || '').toLowerCase();
    if (n.includes('electricidad') || n.includes('electr')) return base + 'bg-amber-50 text-amber-600';
    if (n.includes('agua')) return base + 'bg-blue-50 text-blue-600';
    if (n.includes('gas')) return base + 'bg-orange-50 text-orange-600';
    return base + 'bg-slate-100 text-slate-600';
  }

  getServiceColor(name?: string): string {
    const n = (name || '').toLowerCase();
    if (n.includes('electricidad') || n.includes('electr')) return '#d97706';
    if (n.includes('agua')) return '#2563eb';
    if (n.includes('gas')) return '#ea580c';
    return '#059669';
  }
}
