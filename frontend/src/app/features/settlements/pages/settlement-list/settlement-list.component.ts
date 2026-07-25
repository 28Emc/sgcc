import { Component, OnInit, signal, computed, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
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
import { SettlementApiService, Settlement } from '../../services/settlement-api.service';
import { ReceiptApiService, Receipt } from '../../../receipts/services/receipt-api.service';
import { PropertyApiService, Property } from '../../../properties/services/property-api.service';
import { TenantApiService } from '../../../tenants/services/tenant-api.service';
import { ReadingApiService } from '../../../readings/services/reading-api.service';
import { MeterApiService } from '../../../meters/services/meter-api.service';

@Component({
  selector: 'app-settlement-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
      title="Liquidaciones de Cobro"
      subtitle="Cálculo automático de montos a cobrar por inquilino mediante prorrateo de recibos y lecturas">
      <button mat-raised-button color="primary" (click)="generateSettlements()" [disabled]="calculating()">
        <mat-icon class="mr-1">calculate</mat-icon>
        {{ calculating() ? 'Calculando...' : 'Recalcular Liquidaciones del Mes' }}
      </button>
    </app-page-header>

    <!-- Filters & Period Bar -->
    <div class="toolbar">
      <div class="flex items-center gap-4">
        <mat-form-field appearance="outline" class="search-field w-48">
          <mat-label>Recibo</mat-label>
          <mat-select [ngModel]="selectedReceiptId()" (ngModelChange)="selectedReceiptId.set($event); onFilterChange()">
            <mat-option value="">Todos los recibos</mat-option>
            @for (receipt of receipts(); track receipt.id) {
              <mat-option [value]="receipt.id">
                {{ receipt.serviceName }} - {{ receipt.period }}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="search-field w-56">
          <mat-label>Inmueble</mat-label>
          <mat-select [ngModel]="selectedPropertyId()" (ngModelChange)="selectedPropertyId.set($event); onFilterChange()">
            <mat-option value="">Todos los inmuebles</mat-option>
            @for (prop of properties(); track prop.id) {
              <mat-option [value]="prop.id">{{ prop.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>

      <div class="text-right">
        <span class="text-xs text-slate-500 font-medium block">Mostrando {{ paginatedSettlements().length }} de {{ filteredSettlements().length }} liquidaciones</span>
        <span class="text-2xl font-extrabold text-slate-900 font-mono">$ {{ totalSettlementSum() | number:'1.2-2' }}</span>
      </div>
    </div>

    <!-- Main content area + Drawer -->
    <div class="content-with-drawer">
      @if (loading()) {
        <app-loading-spinner message="Ejecutando motor de liquidaciones..."></app-loading-spinner>
      } @else if (filteredSettlements().length === 0) {
        <app-empty-state
          icon="payments"
          title="No hay liquidaciones en este periodo"
          description="Presione el botón 'Recalcular Liquidaciones' para procesar los cobros del mes."
          actionLabel="Generar Liquidación"
          actionIcon="calculate"
          (actionClicked)="generateSettlements()">
        </app-empty-state>
      } @else {
        <div class="card-container">
          <table mat-table [dataSource]="paginatedSettlements()">
            <ng-container matColumnDef="tenant">
              <th mat-header-cell *matHeaderCellDef>Inquilino</th>
              <td mat-cell *matCellDef="let s">
                <div class="cell-name">
                  <span class="cell-icon cell-icon-dark">
                    {{ getInitials(s.tenantName) }}
                  </span>
                  <div>
                    <span class="cell-primary">{{ s.tenantName || 'Inquilino' }}</span>
                    <span class="cell-sub">Recibo {{ s.receiptNumber || 'N/A' }}</span>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="consumption">
              <th mat-header-cell *matHeaderCellDef>Consumo</th>
              <td mat-cell *matCellDef="let s">
                <span class="font-mono text-xs font-semibold text-indigo-600">{{ s.consumption }} unidades</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="unitRate">
              <th mat-header-cell *matHeaderCellDef>Valor Unitario</th>
              <td mat-cell *matCellDef="let s">
                <span class="font-mono text-xs font-semibold text-slate-600">$ {{ s.unitValue | number:'1.4-4' }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="commonShare">
              <th mat-header-cell *matHeaderCellDef>Monto Calculado</th>
              <td mat-cell *matCellDef="let s">
                <span class="text-xs font-mono text-slate-500">$ {{ s.calculatedAmount | number:'1.2-2' }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="totalAmount">
              <th mat-header-cell *matHeaderCellDef>Total Final</th>
              <td mat-cell *matCellDef="let s">
                <span class="font-extrabold text-slate-900 text-base font-mono">$ {{ (s.finalAmount || s.calculatedAmount) | number:'1.2-2' }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let s">
                <span [class]="s.status === 'COMPLETED' ? 'badge badge-success' : 'badge badge-neutral'">
                  {{ s.status === 'COMPLETED' ? 'PAGADO' : 'PENDIENTE' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let s">
                <div class="cell-actions">
                  <button mat-icon-button (click)="openView(s); $event.stopPropagation()" title="Ver detalle">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-stroked-button color="primary" (click)="openVoucherModal(s); $event.stopPropagation()" class="!rounded-lg !px-3 !py-1 text-xs">
                    <mat-icon class="!w-4 !h-4 mr-1">receipt</mat-icon>
                    Voucher
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
            [length]="filteredSettlements().length"
            [pageIndex]="pageIndex()"
            [pageSize]="pageSize()"
            [pageSizeOptions]="[5, 10, 25]"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        </div>
      }

      <!-- Detail Drawer -->
      <mat-drawer #drawer mode="over" position="end" [opened]="drawerOpen()" (closedStart)="closeDrawer()" class="entity-drawer">
        @if (selectedSettlement()) {
          <div class="drawer-header">
            <div class="drawer-header-text">
              <h2 class="drawer-title">{{ selectedSettlement()!.tenantName || 'Inquilino' }}</h2>
              <p class="drawer-subtitle">Recibo {{ selectedSettlement()!.receiptNumber || 'N/A' }} — {{ selectedSettlement()!.period }}</p>
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
                <span [class]="selectedSettlement()!.status === 'COMPLETED' ? 'badge badge-success' : 'badge badge-neutral'">
                  {{ selectedSettlement()!.status === 'COMPLETED' ? 'PAGADO' : 'PENDIENTE' }}
                </span>
                <span class="text-xl font-extrabold text-slate-900 font-mono">
                  $ {{ (selectedSettlement()!.finalAmount || selectedSettlement()!.calculatedAmount) | number:'1.2-2' }}
                </span>
              </div>
            </div>

            <mat-divider></mat-divider>

            <!-- Calculation Breakdown -->
            <div class="drawer-section">
              <div class="drawer-section-header">
                <mat-icon>calculate</mat-icon>
                <h4>Desglose del Cálculo</h4>
              </div>

              <div class="calc-grid">
                <div class="calc-box">
                  <p class="calc-label">Consumo</p>
                  <p class="calc-value">{{ selectedSettlement()!.consumption | number:'1.0-3' }}</p>
                  <p class="calc-unit">unidades</p>
                </div>
                <div class="calc-box">
                  <p class="calc-label">Valor Unitario</p>
                  <p class="calc-value text-amber-600">$ {{ selectedSettlement()!.unitValue | number:'1.4-4' }}</p>
                  <p class="calc-unit">/ unidad</p>
                </div>
                <div class="calc-box">
                  <p class="calc-label">Monto Calculado</p>
                  <p class="calc-value">$ {{ selectedSettlement()!.calculatedAmount | number:'1.2-2' }}</p>
                  <p class="calc-unit">subtotal</p>
                </div>
              </div>

              @if (selectedSettlement()!.adjustmentAmount && selectedSettlement()!.adjustmentAmount !== 0) {
                <div class="adjustment-box">
                  <div class="flex items-center gap-2 mb-1">
                    <mat-icon class="!w-4 !h-4 text-amber-600">tune</mat-icon>
                    <span class="text-xs font-bold text-amber-800">Ajuste Aplicado</span>
                  </div>
                  <p class="text-sm font-bold text-amber-700 font-mono">$ {{ selectedSettlement()!.adjustmentAmount | number:'1.2-2' }}</p>
                </div>
              }

              <div class="total-row">
                <div class="flex items-center gap-2 font-medium text-sm">
                  <mat-icon>payments</mat-icon>
                  <span>Total a Pagar:</span>
                </div>
                <div class="text-xl font-extrabold font-mono">
                  $ {{ (selectedSettlement()!.finalAmount || selectedSettlement()!.calculatedAmount) | number:'1.2-2' }}
                </div>
              </div>
            </div>

            <mat-divider></mat-divider>

            <!-- Details -->
            <div class="drawer-section">
              <div class="drawer-section-header">
                <mat-icon>info</mat-icon>
                <h4>Información General</h4>
              </div>
              <app-drawer-field label="Recibo">{{ selectedSettlement()!.receiptNumber || 'N/A' }}</app-drawer-field>
              <app-drawer-field label="Periodo">{{ selectedSettlement()!.period || 'N/A' }}</app-drawer-field>
              <app-drawer-field label="ID Liquidación">
                <span class="font-mono text-xs">{{ selectedSettlement()!.id }}</span>
              </app-drawer-field>
            </div>

            <!-- Adjustment Form (if pending) -->
            @if (selectedSettlement()!.status !== 'COMPLETED') {
              <mat-divider></mat-divider>
              <div class="drawer-section">
                <div class="drawer-section-header">
                  <mat-icon>tune</mat-icon>
                  <h4>Aplicar Ajuste</h4>
                </div>
                <mat-form-field appearance="outline" class="drawer-field">
                  <mat-label>Monto del Ajuste ($)</mat-label>
                  <input matInput type="number" [(ngModel)]="adjustmentAmount" placeholder="0.00" class="font-mono">
                  <span matPrefix class="mr-1 text-slate-500 font-bold">$</span>
                </mat-form-field>
                <mat-form-field appearance="outline" class="drawer-field">
                  <mat-label>Motivo del Ajuste</mat-label>
                  <input matInput [(ngModel)]="adjustmentReason" placeholder="ej. Ajuste por medición incorrecta">
                </mat-form-field>
              </div>
            }

            <!-- Actions -->
            <mat-divider></mat-divider>
            <div class="drawer-actions">
              @if (selectedSettlement()!.status !== 'COMPLETED') {
                <button mat-stroked-button color="warn" (click)="deleteSettlement()">
                  <mat-icon>delete</mat-icon><span class="button-text">Eliminar</span>
                </button>
                <button mat-stroked-button (click)="applyAdjustment()" [disabled]="!adjustmentAmount || !adjustmentReason || adjusting()">
                  @if (adjusting()) {
                    <mat-icon class="spinning">sync</mat-icon>
                  } @else {
                    <mat-icon>tune</mat-icon>
                  }
                  <span class="button-text">{{ adjusting() ? 'Aplicando...' : 'Aplicar Ajuste' }}</span>
                </button>
                <button mat-raised-button color="accent" (click)="completeSettlement()" [disabled]="completing()">
                  @if (completing()) {
                    <mat-icon class="spinning">sync</mat-icon>
                  } @else {
                    <mat-icon>check_circle</mat-icon>
                  }
                  <span class="button-text">{{ completing() ? 'Procesando...' : 'Completar' }}</span>
                </button>
              } @else {
                <button mat-stroked-button (click)="openVoucherModal(selectedSettlement()!)">
                  <mat-icon>receipt</mat-icon><span class="button-text">Ver Voucher</span>
                </button>
              }
            </div>
          </div>
        }
      </mat-drawer>
    </div>

    <!-- Printable Voucher Modal Overlay -->
    @if (selectedVoucher()) {
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                <mat-icon class="!w-4 !h-4 text-xs">receipt_long</mat-icon>
              </div>
              <h3 class="font-bold text-slate-900 text-base">Comprobante de Liquidación</h3>
            </div>
            <button mat-icon-button (click)="selectedVoucher.set(null)">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6 space-y-3">
            <div class="text-center pb-3 border-b border-slate-200/60">
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">SGCC - Comprobante de Liquidación</p>
              <h4 class="text-lg font-extrabold text-slate-900">{{ selectedVoucher().tenantName || 'Inquilino' }}</h4>
              <p class="text-xs text-indigo-600 font-semibold">Recibo {{ selectedVoucher().receiptNumber || 'N/A' }} - {{ selectedVoucher().period }}</p>
            </div>

            <div class="space-y-1.5 text-xs text-slate-600">
              <div class="flex justify-between">
                <span>Consumo:</span>
                <strong class="text-slate-900 font-mono">{{ selectedVoucher().consumption }} unidades</strong>
              </div>
              <div class="flex justify-between">
                <span>Valor Unitario:</span>
                <strong class="text-slate-900 font-mono">$ {{ selectedVoucher().unitValue | number:'1.4-4' }}</strong>
              </div>
              <div class="flex justify-between text-slate-500">
                <span>Monto Calculado:</span>
                <span class="font-mono">$ {{ selectedVoucher().calculatedAmount | number:'1.2-2' }}</span>
              </div>
              @if (selectedVoucher().adjustmentAmount && selectedVoucher().adjustmentAmount !== 0) {
                <div class="flex justify-between text-slate-500">
                  <span>Ajustes:</span>
                  <span class="font-mono">$ {{ selectedVoucher().adjustmentAmount | number:'1.2-2' }}</span>
                </div>
              }
            </div>

            <div class="pt-3 border-t border-slate-200/80 flex items-center justify-between">
              <span class="font-extrabold text-slate-900 text-sm">TOTAL A PAGAR:</span>
              <span class="text-2xl font-black text-indigo-700 font-mono">$ {{ (selectedVoucher().finalAmount || selectedVoucher().calculatedAmount) | number:'1.2-2' }}</span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button mat-stroked-button (click)="selectedVoucher.set(null)" class="!rounded-xl flex-1">Cerrar</button>
            <button mat-raised-button color="primary" (click)="printVoucher()" class="!rounded-xl flex-1 shadow-md">
              <mat-icon>print</mat-icon> Imprimir / PDF
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .content-with-drawer {
      position: relative;
    }

    .entity-drawer {
      width: 540px !important;
    }

    .cell-name {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .cell-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 0.7rem;
      font-weight: 700;
    }

    .cell-icon-dark {
      background: var(--color-primary);
      color: #fff;
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
      align-items: center;
      gap: 4px;
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

    .calc-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 14px;
    }

    .calc-box {
      text-align: center;
      padding: 12px 8px;
      border-radius: 10px;
      background: var(--surface-bg);
      border: 1px solid var(--surface-border-light);
    }

    .calc-label {
      font-size: 0.6rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin: 0 0 4px;
    }

    .calc-value {
      font-size: 1rem;
      font-weight: 800;
      font-family: 'Inter', monospace;
      color: var(--text-primary);
      margin: 0;
    }

    .calc-unit {
      font-size: 0.65rem;
      color: var(--text-muted);
      margin: 2px 0 0;
    }

    .adjustment-box {
      padding: 10px 12px;
      border-radius: 8px;
      background: #fffbeb;
      border: 1px solid #fde68a;
      margin-bottom: 12px;
    }

    .total-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border-radius: 10px;
      background: #d97706;
      color: #fff;
    }

    .drawer-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
      margin-top: 16px;
      flex-wrap: wrap;
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

    .fade-in {
      animation: fadeIn 0.25s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class SettlementListComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;

  private settlementApi = inject(SettlementApiService);
  private receiptApi = inject(ReceiptApiService);
  private propertyApi = inject(PropertyApiService);
  private tenantApi = inject(TenantApiService);
  private readingApi = inject(ReadingApiService);
  private meterApi = inject(MeterApiService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  displayedColumns = ['tenant', 'consumption', 'unitRate', 'commonShare', 'totalAmount', 'status', 'actions'];

  selectedReceiptId = signal('');
  selectedPropertyId = signal('');

  settlements = signal<Settlement[]>([]);
  receipts = signal<Receipt[]>([]);
  properties = signal<Property[]>([]);
  loading = signal(true);
  calculating = signal(false);
  drawerOpen = signal(false);
  selectedSettlement = signal<Settlement | null>(null);
  selectedVoucher = signal<any | null>(null);
  pageIndex = signal(0);
  pageSize = signal(10);
  adjusting = signal(false);
  completing = signal(false);
  adjustmentAmount = 0;
  adjustmentReason = '';

  filteredSettlements = computed(() => {
    let result = this.settlements();
    if (this.selectedReceiptId()) {
      result = result.filter(s => s.receiptId === this.selectedReceiptId());
    }
    if (this.selectedPropertyId()) {
      result = result.filter(s => s.propertyId === this.selectedPropertyId());
    }
    return result;
  });

  paginatedSettlements = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredSettlements().slice(start, start + this.pageSize());
  });

  totalSettlementSum = computed(() => {
    return this.filteredSettlements().reduce((acc, curr) => acc + (curr.finalAmount || curr.calculatedAmount || 0), 0);
  });

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading.set(true);
    forkJoin({
      settlements: this.settlementApi.findAll(),
      receipts: this.receiptApi.findAll(),
      properties: this.propertyApi.findAll()
    }).subscribe({
      next: (data) => {
        this.settlements.set(data.settlements || []);
        this.receipts.set(data.receipts || []);
        this.properties.set(data.properties || []);
        this.loading.set(false);
      },
      error: () => {
        this.settlements.set([]);
        this.receipts.set([]);
        this.properties.set([]);
        this.loading.set(false);
      }
    });
  }

  generateSettlements(): void {
    if (!this.selectedReceiptId()) {
      this.snackBar.open('Seleccione un recibo primero para generar las liquidaciones', 'Cerrar', { duration: 4000 });
      return;
    }

    this.calculating.set(true);
    forkJoin({
      receipt: this.receiptApi.findById(this.selectedReceiptId()),
      meters: this.meterApi.findAll(),
      readings: this.readingApi.findAll(),
      tenants: this.tenantApi.findAll()
    }).subscribe({
      next: ({ receipt, meters, readings, tenants }) => {
        const unitValue = receipt.totalAmount / receipt.totalConsumption;
        const tenantConsumptions = tenants.map((t: any) => {
          const tenantMeters = meters.filter((m: any) =>
            readings.some((r: any) => r.meterId === m.id)
          );
          let totalConsumption = 0;
          tenantMeters.forEach((m: any) => {
            const meterReadings = readings
              .filter((r: any) => r.meterId === m.id)
              .sort((a: any, b: any) => new Date(b.readingDate).getTime() - new Date(a.readingDate).getTime());
            if (meterReadings.length >= 2) {
              totalConsumption += (meterReadings[0].readingValue || 0) - (meterReadings[1].readingValue || 0);
            }
          });
          return { tenantId: t.id, consumption: totalConsumption };
        }).filter((tc: any) => tc.consumption > 0);

        this.settlementApi.generate(receipt.id!, tenantConsumptions, unitValue).subscribe({
          next: (data) => {
            this.settlements.set(data || []);
            this.calculating.set(false);
            this.pageIndex.set(0);
            this.snackBar.open('Liquidaciones calculadas exitosamente', 'OK', { duration: 4000 });
          },
          error: () => {
            this.calculating.set(false);
            this.snackBar.open('Error al calcular liquidaciones', 'Cerrar', { duration: 5000 });
          }
        });
      },
      error: () => {
        this.calculating.set(false);
        this.snackBar.open('Error al cargar datos para liquidaciones', 'Cerrar', { duration: 4000 });
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onFilterChange(): void {
    this.pageIndex.set(0);
  }

  /* ── Drawer operations ── */

  openView(settlement: Settlement): void {
    this.selectedSettlement.set(settlement);
    this.adjustmentAmount = 0;
    this.adjustmentReason = '';
    this.drawerOpen.set(true);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
    this.selectedSettlement.set(null);
  }

  applyAdjustment(): void {
    const s = this.selectedSettlement();
    if (!s?.id || !this.adjustmentAmount || !this.adjustmentReason) return;
    this.adjusting.set(true);
    this.settlementApi.applyAdjustment(s.id, this.adjustmentAmount, this.adjustmentReason).subscribe({
      next: (updated) => {
        this.selectedSettlement.set(updated);
        this.adjusting.set(false);
        this.adjustmentAmount = 0;
        this.adjustmentReason = '';
        this.snackBar.open('Ajuste aplicado exitosamente', 'OK', { duration: 3000 });
        this.loadAll();
      },
      error: () => { this.adjusting.set(false); this.snackBar.open('Error al aplicar el ajuste', 'Cerrar', { duration: 3000 }); }
    });
  }

  completeSettlement(): void {
    const s = this.selectedSettlement();
    if (!s?.id) return;
    this.completing.set(true);
    this.settlementApi.complete(s.id).subscribe({
      next: (updated) => {
        this.selectedSettlement.set(updated);
        this.completing.set(false);
        this.snackBar.open('Liquidación completada exitosamente', 'OK', { duration: 3000 });
        this.loadAll();
      },
      error: () => { this.completing.set(false); this.snackBar.open('Error al completar la liquidación', 'Cerrar', { duration: 3000 }); }
    });
  }

  deleteSettlement(): void {
    const s = this.selectedSettlement();
    if (!s?.id) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Eliminar Liquidación', message: '¿Está seguro de eliminar esta liquidación? Esta acción no se puede deshacer.', confirmLabel: 'Eliminar', color: 'warn' } as ConfirmDialogData
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.settlementApi.delete(s.id!).subscribe({
          next: () => {
            this.snackBar.open('Liquidación eliminada', 'OK', { duration: 3000 });
            this.closeDrawer();
            this.loadAll();
          },
          error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }

  openVoucherModal(item: any): void {
    this.selectedVoucher.set(item);
  }

  printVoucher(): void {
    window.print();
  }

  getInitials(name?: string): string {
    if (!name) return 'IN';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  }
}
