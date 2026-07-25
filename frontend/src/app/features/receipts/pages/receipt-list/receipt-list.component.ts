import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
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
import { ReceiptApiService, Receipt } from '../../services/receipt-api.service';
import { ServiceApiService, Service } from '../../../services/services/service-api.service';

@Component({
  selector: 'app-receipt-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
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
    EntityDrawerComponent
  ],
  template: `
    <app-page-header
      title="Recibos de Servicios Públicos"
      subtitle="Registro de las facturas globales emitidas por las empresas proveedoras (Luz del Sur, Sedapal, Enel)">
      <button mat-raised-button color="primary" type="button" (click)="openCreate()">
        <mat-icon class="mr-1">add</mat-icon>
        Registrar Nuevo Recibo
      </button>
    </app-page-header>

    <!-- Search Toolbar -->
    <div class="toolbar">
      <div class="toolbar-search">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar por proveedor o periodo...</mat-label>
          <input matInput [ngModel]="searchTerm()" (ngModelChange)="onSearchChange($event)">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>
      <div class="total-count">
        {{ filteredReceipts().length }} recibos
      </div>
    </div>

    <!-- Main content area + Drawer -->
    <div class="content-with-drawer">
      @if (loading()) {
        <app-loading-spinner message="Cargando historial de recibos..."></app-loading-spinner>
      } @else if (filteredReceipts().length === 0) {
        <app-empty-state
          icon="receipt_long"
          title="No hay recibos ingresados"
          description="Registre el primer recibo del proveedor para iniciar el proceso de liquidación."
          actionLabel="Registrar Recibo"
          actionIcon="add"
          (actionClicked)="openCreate()">
        </app-empty-state>
      } @else {
        <div class="card-container">
          <table mat-table [dataSource]="paginatedReceipts()">
            <ng-container matColumnDef="provider">
              <th mat-header-cell *matHeaderCellDef>Proveedor / Servicio</th>
              <td mat-cell *matCellDef="let receipt">
                <div class="cell-name">
                  <span class="cell-icon cell-icon-indigo">
                    <mat-icon>receipt</mat-icon>
                  </span>
                  <div>
                    <span class="cell-primary">{{ receipt.serviceName }}</span>
                    <span class="cell-sub">N° {{ receipt.receiptNumber }}</span>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="period">
              <th mat-header-cell *matHeaderCellDef>Periodo</th>
              <td mat-cell *matCellDef="let receipt">
                <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                  <mat-icon class="!w-3.5 !h-3.5 text-slate-400">calendar_month</mat-icon>
                  {{ receipt.period }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="totalAmount">
              <th mat-header-cell *matHeaderCellDef>Monto Factura</th>
              <td mat-cell *matCellDef="let receipt">
                <span class="font-extrabold text-slate-900 text-sm font-mono">$ {{ receipt.totalAmount | number:'1.2-2' }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="unitValue">
              <th mat-header-cell *matHeaderCellDef>Valor Unitario Calculado</th>
              <td mat-cell *matCellDef="let receipt">
                <div>
                  <span class="font-mono font-bold text-indigo-600">$ {{ (receipt.totalConsumption > 0 ? receipt.totalAmount / receipt.totalConsumption : 0) | number:'1.4-4' }}</span>
                  <span class="text-xs text-slate-400"> / unidad</span>
                  <p class="text-xs text-slate-500">Consumo: {{ receipt.totalConsumption | number:'1.0-2' }} global</p>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let receipt">
                <span class="status-badge status-badge-active">REGISTRADO</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let receipt">
                <div class="cell-actions">
                  <button mat-icon-button type="button" (click)="openView(receipt); $event.stopPropagation()" title="Ver detalle">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button type="button" (click)="openEdit(receipt); $event.stopPropagation()" title="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button type="button" (click)="deleteReceipt(receipt); $event.stopPropagation()" title="Eliminar" class="btn-icon-danger">
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
            [length]="filteredReceipts().length"
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
          [title]="drawerTitle()"
          [subtitle]="drawerSubtitle()"
          [summaryTpl]="summaryTpl"
          [detailsTpl]="detailsTpl"
          [contentTpl]="contentTpl"
          [actionsTpl]="actionsTpl"
          (close)="closeDrawer()">
        </app-entity-drawer>

        <ng-template #summaryTpl>
          @if ((drawerMode() === 'view' || drawerMode() === 'edit') && selectedReceipt()) {
            <div class="drawer-summary">
              <span class="drawer-status">REGISTRADO</span>
              <p class="text-xs text-slate-500 mt-2">Servicio: {{ selectedReceipt()?.serviceName }}</p>
            </div>
          }
        </ng-template>

        <ng-template #detailsTpl>
          @if (drawerMode() === 'view' && selectedReceipt()) {
            <app-drawer-field label="Servicio">{{ selectedReceipt()?.serviceName }}</app-drawer-field>
            <app-drawer-field label="Periodo">{{ selectedReceipt()?.period }}</app-drawer-field>
            <app-drawer-field label="Número de recibo">{{ selectedReceipt()?.receiptNumber }}</app-drawer-field>
            <app-drawer-field label="Monto total">$ {{ selectedReceipt()?.totalAmount | number:'1.2-2' }}</app-drawer-field>
            <app-drawer-field label="Consumo global">{{ selectedReceipt()?.totalConsumption | number:'1.0-2' }} unidades</app-drawer-field>
            <app-drawer-field label="Valor unitario">$ {{ getSelectedReceiptUnitValue() | number:'1.4-4' }} / unidad</app-drawer-field>
          }
        </ng-template>

        <ng-template #contentTpl>
          @if (drawerMode() === 'edit' || drawerMode() === 'create') {
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="drawer-form">
              <mat-form-field appearance="outline" class="drawer-field">
                <mat-label>Empresa Proveedora / Servicio</mat-label>
                <mat-select formControlName="serviceId">
                  @for (service of services(); track service.id) {
                    <mat-option [value]="service.id">{{ service.name }} ({{ service.measurementUnit }})</mat-option>
                  }
                </mat-select>
                @if (form.get('serviceId')?.hasError('required') && form.get('serviceId')?.touched) {
                  <mat-error>El servicio es requerido</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="drawer-field">
                <mat-label>Periodo Facturado</mat-label>
                <input matInput formControlName="period" placeholder="ej. 2026-07">
                @if (form.get('period')?.hasError('required') && form.get('period')?.touched) {
                  <mat-error>El periodo es obligatorio</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="drawer-field">
                <mat-label>Número de Factura / Recibo</mat-label>
                <input matInput formControlName="receiptNumber" placeholder="ej. FAC-001234">
                @if (form.get('receiptNumber')?.hasError('required') && form.get('receiptNumber')?.touched) {
                  <mat-error>El número es obligatorio</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="drawer-field">
                <mat-label>Monto Total Factura ($)</mat-label>
                <input matInput type="number" formControlName="totalAmount" placeholder="0.00" class="font-mono">
                <span matPrefix class="mr-1 text-slate-500 font-bold">$</span>
                @if (form.get('totalAmount')?.hasError('required') && form.get('totalAmount')?.touched) {
                  <mat-error>Requerido</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="drawer-field">
                <mat-label>Consumo Global (kWh / m³)</mat-label>
                <input matInput type="number" formControlName="totalConsumption" placeholder="0.00" class="font-mono">
                @if (form.get('totalConsumption')?.hasError('required') && form.get('totalConsumption')?.touched) {
                  <mat-error>Requerido</mat-error>
                }
              </mat-form-field>
            </form>
          }
        </ng-template>

        <ng-template #actionsTpl>
          @if (drawerMode() === 'view' && selectedReceipt()) {
            <button mat-stroked-button type="button" (click)="openEdit(selectedReceipt()!)">
              <mat-icon>edit</mat-icon>
              Editar
            </button>
            <button mat-stroked-button color="warn" type="button" (click)="deleteReceipt(selectedReceipt()!)">
              <mat-icon>delete</mat-icon>
              Eliminar
            </button>
          }
          @if (drawerMode() === 'edit' || drawerMode() === 'create') {
            <button mat-stroked-button type="button" (click)="closeDrawer()">Cancelar</button>
            <button mat-raised-button color="primary" type="button" (click)="onSubmit()" [disabled]="form.invalid || saving()">
              <mat-icon>{{ drawerMode() === 'edit' ? 'save' : 'add' }}</mat-icon>
              {{ drawerMode() === 'edit' ? 'Guardar Recibo' : 'Crear Recibo' }}
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

    .cell-icon-indigo {
      background: #eef2ff;
      color: #4f46e5;
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

    .drawer-status {
      display: inline-flex;
      align-items: center;
      padding: 2px 10px;
      border-radius: 9999px;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.03em;
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
    }

    .drawer-form {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .drawer-field {
      width: 100%;
      margin-bottom: 0 !important;
    }
  `]
})
export class ReceiptListComponent implements OnInit {
  private receiptApi = inject(ReceiptApiService);
  private serviceApi = inject(ServiceApiService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  displayedColumns = ['provider', 'period', 'totalAmount', 'unitValue', 'status', 'actions'];

  receipts = signal<Receipt[]>([]);
  services = signal<Service[]>([]);
  loading = signal(true);
  saving = signal(false);
  drawerMode = signal<'closed' | 'view' | 'edit' | 'create'>('closed');
  selectedReceipt = signal<Receipt | null>(null);
  searchTerm = signal('');
  pageIndex = signal(0);
  pageSize = signal(10);

  form: FormGroup = this.fb.group({
    serviceId: ['', Validators.required],
    period: ['', Validators.required],
    receiptNumber: ['', Validators.required],
    totalAmount: [0, [Validators.required, Validators.min(0.01)]],
    totalConsumption: [0, [Validators.required, Validators.min(0.01)]]
  });

  readonly drawerTitle = computed(() => {
    const mode = this.drawerMode();
    if (mode === 'create') return 'Registrar Recibo';
    if (mode === 'edit') return 'Editar Recibo';
    return this.selectedReceipt()?.receiptNumber || 'Recibo';
  });

  readonly drawerSubtitle = computed(() => {
    const mode = this.drawerMode();
    if (mode === 'create') return 'Registre un nuevo recibo de servicio';
    if (mode === 'edit') return 'Actualice los datos del recibo';
    return 'Vista detallada del recibo';
  });

  filteredReceipts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.receipts();
    return this.receipts().filter(r =>
      (r.serviceName || '').toLowerCase().includes(term) ||
      (r.period || '').toLowerCase().includes(term) ||
      (r.receiptNumber || '').toLowerCase().includes(term)
    );
  });

  paginatedReceipts = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredReceipts().slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.loadReceipts();
    this.loadServices();
  }

  loadReceipts(): void {
    this.loading.set(true);
    this.receiptApi.findAll().subscribe({
      next: (data) => { this.receipts.set(data || []); this.loading.set(false); },
      error: () => { this.receipts.set([]); this.loading.set(false); }
    });
  }

  loadServices(): void {
    this.serviceApi.findAll().subscribe({
      next: (data) => this.services.set(data || []),
      error: () => this.services.set([])
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

  openView(receipt: Receipt): void {
    this.selectedReceipt.set(receipt);
    this.drawerMode.set('view');
    this.form.enable();
  }

  openEdit(receipt: Receipt): void {
    this.selectedReceipt.set(receipt);
    this.drawerMode.set('edit');
    this.form.enable();
    this.form.setValue({
      serviceId: receipt.serviceId || '',
      period: receipt.period || '',
      receiptNumber: receipt.receiptNumber || '',
      totalAmount: receipt.totalAmount || 0,
      totalConsumption: receipt.totalConsumption || 0
    });
    this.form.get('serviceId')?.disable();
    this.form.get('receiptNumber')?.disable();
  }

  openCreate(): void {
    this.selectedReceipt.set(null);
    this.drawerMode.set('create');
    this.form.enable();
    this.form.reset({
      serviceId: '',
      period: '',
      receiptNumber: '',
      totalAmount: 0,
      totalConsumption: 0
    });
  }

  closeDrawer(): void {
    this.drawerMode.set('closed');
    this.selectedReceipt.set(null);
    this.form.reset({
      serviceId: '',
      period: '',
      receiptNumber: '',
      totalAmount: 0,
      totalConsumption: 0
    });
    this.form.enable();
  }

  getSelectedReceiptUnitValue(): number {
    const receipt = this.selectedReceipt();
    if (!receipt || !receipt.totalConsumption) return 0;
    return receipt.totalAmount / receipt.totalConsumption;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();
    this.saving.set(true);

    const selected = this.selectedReceipt();
    const request$ = this.drawerMode() === 'edit' && selected?.id
      ? this.receiptApi.update(selected.id, payload)
      : this.receiptApi.create(payload);

    request$.subscribe({
      next: () => {
        this.snackBar.open(
          this.drawerMode() === 'edit' ? 'Recibo actualizado' : 'Recibo creado',
          'OK',
          { duration: 3000 }
        );
        this.loadReceipts();
        this.closeDrawer();
        this.saving.set(false);
      },
      error: () => {
        this.snackBar.open('Error al guardar el recibo', 'Cerrar', { duration: 3000 });
        this.saving.set(false);
      }
    });
  }

  deleteReceipt(receipt: Receipt): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Recibo',
        message: `¿Está seguro de eliminar el recibo "${receipt.receiptNumber}"? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        color: 'warn'
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && receipt.id) {
        this.receiptApi.delete(receipt.id).subscribe({
          next: () => {
            this.snackBar.open('Recibo eliminado', 'OK', { duration: 3000 });
            if (this.selectedReceipt()?.id === receipt.id) {
              this.closeDrawer();
            }
            this.loadReceipts();
          },
          error: () => this.snackBar.open('Error al eliminar el recibo', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }
}
