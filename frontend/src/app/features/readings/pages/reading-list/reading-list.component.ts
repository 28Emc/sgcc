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
import { ReadingApiService, Reading } from '../../services/reading-api.service';
import { MeterApiService, Meter } from '../../../meters/services/meter-api.service';

type DrawerMode = 'closed' | 'view' | 'create';

@Component({
  selector: 'app-reading-list',
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
      title="Lecturas de Medidores"
      subtitle="Registro mensual de toma de lecturas por departamento o medidor general">
      <button mat-raised-button color="primary" (click)="openCreate()">
        <mat-icon>add</mat-icon>
        Capturar Nueva Lectura
      </button>
    </app-page-header>

    <!-- Search Toolbar -->
    <div class="toolbar">
      <div class="toolbar-search">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar por medidor o inquilino...</mat-label>
          <input matInput [ngModel]="searchTerm()" (ngModelChange)="onSearchChange($event)">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>
      <div class="total-count">
        {{ filteredReadings().length }} lecturas
      </div>
    </div>

    <!-- Main content area + Drawer -->
    <div class="content-with-drawer">
      @if (loading()) {
        <app-loading-spinner message="Cargando historial de lecturas..."></app-loading-spinner>
      } @else if (filteredReadings().length === 0) {
        <app-empty-state
          icon="edit_note"
          title="No hay lecturas registradas"
          description="Aún no ha ingresado la primera lectura del mes."
          actionLabel="Capturar Lectura"
          actionIcon="add"
          (actionClicked)="openCreate()">
        </app-empty-state>
      } @else {
        <div class="card-container">
          <table mat-table [dataSource]="paginatedReadings()">
            <ng-container matColumnDef="meter">
              <th mat-header-cell *matHeaderCellDef>Medidor / Inquilino</th>
              <td mat-cell *matCellDef="let r">
                <div class="cell-name">
                  <span class="cell-icon cell-icon-blue">
                    <mat-icon>speed</mat-icon>
                  </span>
                  <div>
                    <span class="cell-primary font-mono">{{ r.meterSerial }}</span>
                    <span class="cell-sub">{{ r.tenantName }} ({{ r.unitName }})</span>
                  </div>
                </div>
              </td>
            </ng-container>

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

            <ng-container matColumnDef="netConsumption">
              <th mat-header-cell *matHeaderCellDef>Consumo Generado</th>
              <td mat-cell *matCellDef="let r">
                <span class="inline-flex items-center gap-1 font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 font-mono text-sm">
                  <mat-icon class="!w-4 !h-4 text-blue-500">bolt</mat-icon>
                  +{{ (r.readingValue || 0) - (r.previousValue || 0) | number:'1.0-2' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Fecha de Toma</th>
              <td mat-cell *matCellDef="let r">
                <span class="text-xs text-slate-600 font-medium">{{ r.readingDate }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let r">
                <div class="cell-actions">
                  <button mat-icon-button (click)="openView(r); $event.stopPropagation()" title="Ver detalle">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button (click)="deleteReading(r); $event.stopPropagation()" title="Eliminar" class="btn-icon-danger">
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
            [length]="filteredReadings().length"
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
        @if (drawerMode() === 'view' && selectedReading()) {
          <div class="drawer-header">
            <div class="drawer-header-text">
              <h2 class="drawer-title">Lectura de Medidor</h2>
              <p class="drawer-subtitle">{{ selectedReading()!.meterSerial }} — {{ selectedReading()!.readingDate }}</p>
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
                <span class="badge badge-success">REGISTRADA</span>
                <span class="drawer-summary-count">
                  {{ selectedReading()!.tenantName || '—' }} — {{ selectedReading()!.unitName || '—' }}
                </span>
              </div>
            </div>

            <mat-divider></mat-divider>

            <!-- Reading Comparison -->
            <div class="drawer-section">
              <div class="drawer-section-header">
                <mat-icon>compare_arrows</mat-icon>
                <h4>Comparación de Lecturas</h4>
              </div>
              <div class="reading-comparison">
                <div class="reading-box reading-box-prev">
                  <p class="reading-box-label">Anterior</p>
                  <p class="reading-box-value text-slate-500">
                    {{ selectedReading()!.previousValue != null ? (selectedReading()!.previousValue! | number:'1.0-2') : '0.00' }}
                  </p>
                </div>
                <mat-icon class="!w-5 !h-5 text-blue-400">arrow_forward</mat-icon>
                <div class="reading-box reading-box-current">
                  <p class="reading-box-label text-blue-600">Actual</p>
                  <p class="reading-box-value text-blue-700">
                    {{ selectedReading()!.readingValue != null ? (selectedReading()!.readingValue | number:'1.0-2') : '—' }}
                  </p>
                </div>
              </div>

              <div class="consumption-result">
                <div class="flex items-center gap-2 font-medium text-sm">
                  <mat-icon>bolt</mat-icon>
                  <span>Consumo Neto:</span>
                </div>
                <div class="text-xl font-extrabold font-mono">
                  +{{ (selectedReading()!.readingValue || 0) - (selectedReading()!.previousValue || 0) | number:'1.0-2' }}
                </div>
              </div>
            </div>

            <mat-divider></mat-divider>

            <!-- Details -->
            <div class="drawer-section">
              <div class="drawer-section-header">
                <mat-icon>info</mat-icon>
                <h4>Datos de la Lectura</h4>
              </div>
              <app-drawer-field label="Medidor">{{ selectedReading()!.meterSerial || '—' }}</app-drawer-field>
              <app-drawer-field label="Fecha de Toma">{{ selectedReading()!.readingDate }}</app-drawer-field>
              <app-drawer-field label="Inquilino">{{ selectedReading()!.tenantName || '—' }}</app-drawer-field>
              <app-drawer-field label="Unidad">{{ selectedReading()!.unitName || '—' }}</app-drawer-field>
            </div>

            <!-- Actions -->
            <mat-divider></mat-divider>
            <div class="drawer-actions">
              <button mat-stroked-button color="warn" (click)="deleteReading(selectedReading()!)">
                <mat-icon>delete</mat-icon><span class="button-text">Eliminar</span>
              </button>
            </div>
          </div>
        }

        <!-- CREATE MODE -->
        @if (drawerMode() === 'create') {
          <div class="drawer-header">
            <div class="drawer-header-text">
              <h2 class="drawer-title">Nueva Lectura</h2>
              <p class="drawer-subtitle">Registrar la toma de lectura física del medidor</p>
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
                  <mat-icon>edit_note</mat-icon>
                  <h4>Datos de la Lectura</h4>
                </div>

                <mat-form-field appearance="outline" class="drawer-field">
                  <mat-label>Medidor Asociado</mat-label>
                  <mat-select formControlName="meterId" (selectionChange)="onMeterSelected($event.value)">
                    @for (meter of meters(); track meter.id) {
                      <mat-option [value]="meter.id">
                        <div class="flex items-center gap-2">
                          <mat-icon class="!w-4 !h-4" [class]="getServiceIconClass(meter.serviceName)">{{ getServiceIcon(meter.serviceName || '') }}</mat-icon>
                          {{ meter.serialNumber }}
                          <span class="text-xs text-slate-400">({{ meter.serviceName }})</span>
                        </div>
                      </mat-option>
                    }
                  </mat-select>
                  @if (form.get('meterId')?.hasError('required') && form.get('meterId')?.touched) {
                    <mat-error>Debe seleccionar un medidor</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="drawer-field">
                  <mat-label>Fecha de Toma</mat-label>
                  <input matInput type="date" formControlName="readingDate">
                  <mat-icon matSuffix class="text-slate-400">calendar_today</mat-icon>
                  @if (form.get('readingDate')?.hasError('required') && form.get('readingDate')?.touched) {
                    <mat-error>La fecha es obligatoria</mat-error>
                  }
                </mat-form-field>

                <div class="grid grid-cols-2 gap-3">
                  <mat-form-field appearance="outline" class="drawer-field">
                    <mat-label>Lectura Anterior</mat-label>
                    <input matInput type="number" formControlName="previousValue" readonly class="!bg-slate-100 !text-slate-600 font-mono font-bold !cursor-not-allowed">
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="drawer-field">
                    <mat-label>Lectura Actual</mat-label>
                    <input matInput type="number" formControlName="readingValue" (input)="calculateConsumption()" placeholder="0.00" class="font-mono">
                    @if (form.get('readingValue')?.hasError('required') && form.get('readingValue')?.touched) {
                      <mat-error>Requerido</mat-error>
                    }
                  </mat-form-field>
                </div>

                <!-- Consumption Preview -->
                <div class="consumption-preview" [class.consumption-negative]="calculatedConsumption() < 0">
                  <div class="flex items-center gap-2">
                    <mat-icon class="!w-4 !h-4">calculate</mat-icon>
                    <span class="text-xs font-bold uppercase tracking-wider">Consumo Neto</span>
                  </div>
                  <span class="text-lg font-extrabold font-mono">
                    {{ calculatedConsumption() | number:'1.0-2' }}
                  </span>
                </div>

                @if (calculatedConsumption() < 0) {
                  <div class="warning-box">
                    <mat-icon class="!w-4 !h-4 text-red-500">warning</mat-icon>
                    La lectura actual es menor a la anterior. Verifique el valor.
                  </div>
                }
              </div>

              <mat-divider></mat-divider>

              <div class="drawer-actions">
                <button mat-stroked-button type="button" (click)="closeDrawer()">Cancelar</button>
                <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || calculatedConsumption() < 0 || saving()">
                  @if (saving()) {
                    <mat-icon class="spinning">sync</mat-icon>
                  } @else {
                    <mat-icon>save</mat-icon>
                  }
                  <span class="button-text">{{ saving() ? 'Guardando...' : 'Guardar Lectura' }}</span>
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
      width: 520px !important;
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

    .cell-icon-blue {
      background: #eff6ff;
      color: #2563eb;
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

    .reading-comparison {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .reading-box {
      flex: 1;
      text-align: center;
      padding: 14px 12px;
      border-radius: 10px;
      border: 1px solid var(--surface-border-light);
    }

    .reading-box-prev {
      background: var(--surface-bg);
    }

    .reading-box-current {
      background: #eff6ff;
      border-color: #bfdbfe;
    }

    .reading-box-label {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin: 0 0 4px;
    }

    .reading-box-value {
      font-size: 1.2rem;
      font-weight: 800;
      font-family: 'Inter', monospace;
      margin: 0;
    }

    .consumption-result {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border-radius: 10px;
      background: #2563eb;
      color: #fff;
    }

    .consumption-preview {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px;
      border-radius: 8px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #2563eb;
      margin-top: 12px;
    }

    .consumption-negative {
      background: #fef2f2;
      border-color: #fecaca;
      color: #dc2626;
    }

    .warning-box {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      border-radius: 8px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #b91c1c;
      font-size: 0.78rem;
      margin-top: 8px;
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
export class ReadingListComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;

  private readingApi = inject(ReadingApiService);
  private meterApi = inject(MeterApiService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  displayedColumns = ['meter', 'readingsComparison', 'netConsumption', 'date', 'actions'];

  readings = signal<Reading[]>([]);
  meters = signal<Meter[]>([]);
  loading = signal(true);
  searchTerm = signal('');
  pageIndex = signal(0);
  pageSize = signal(10);

  drawerMode = signal<DrawerMode>('closed');
  selectedReading = signal<Reading | null>(null);
  saving = signal(false);
  calculatedConsumption = signal(0);

  form: FormGroup = this.fb.group({
    meterId: ['', Validators.required],
    readingDate: [new Date().toISOString().split('T')[0], Validators.required],
    previousValue: [0, Validators.required],
    readingValue: [0, Validators.required]
  });

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
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.readingApi.findAll().subscribe({
      next: (data) => { this.readings.set(data || []); this.loading.set(false); },
      error: () => { this.readings.set([]); this.loading.set(false); }
    });
    this.meterApi.findAll().subscribe({
      next: (data) => this.meters.set(data || []),
      error: () => this.meters.set([])
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

  openView(reading: Reading): void {
    this.selectedReading.set(reading);
    this.drawerMode.set('view');
  }

  openCreate(): void {
    this.selectedReading.set(null);
    this.form.reset({ meterId: '', readingDate: new Date().toISOString().split('T')[0], previousValue: 0, readingValue: 0 });
    this.calculatedConsumption.set(0);
    this.drawerMode.set('create');
  }

  closeDrawer(): void {
    this.drawerMode.set('closed');
    this.selectedReading.set(null);
  }

  onMeterSelected(meterId: string): void {
    const meter = this.meters().find(m => m.id === meterId);
    const prev = meter?.lastReadingValue || 0;
    this.form.patchValue({ previousValue: prev });
    this.calculateConsumption();
  }

  calculateConsumption(): void {
    const prev = this.form.get('previousValue')?.value || 0;
    const curr = this.form.get('readingValue')?.value || 0;
    this.calculatedConsumption.set(curr - prev);
  }

  onSubmit(): void {
    if (this.form.invalid || this.calculatedConsumption() < 0) return;
    this.saving.set(true);

    const payload: Reading = {
      meterId: this.form.value.meterId,
      readingDate: this.form.value.readingDate,
      readingValue: this.form.value.readingValue
    };

    this.readingApi.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.snackBar.open('Lectura registrada exitosamente', 'OK', { duration: 3000 });
        this.closeDrawer();
        this.loadData();
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open('Error al guardar la lectura. Intente de nuevo.', 'Cerrar', { duration: 4000 });
      }
    });
  }

  deleteReading(reading: Reading): void {
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
            this.closeDrawer();
            this.loadData();
          },
          error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }

  getServiceIcon(name: string): string {
    const n = (name || '').toLowerCase();
    if (n.includes('electricidad') || n.includes('electr')) return 'bolt';
    if (n.includes('agua')) return 'water_drop';
    if (n.includes('gas')) return 'local_fire_department';
    return 'speed';
  }

  getServiceIconClass(name?: string): string {
    const n = (name || '').toLowerCase();
    if (n.includes('electricidad') || n.includes('electr')) return 'text-amber-500';
    if (n.includes('agua')) return 'text-blue-500';
    if (n.includes('gas')) return 'text-orange-500';
    return 'text-slate-500';
  }
}
