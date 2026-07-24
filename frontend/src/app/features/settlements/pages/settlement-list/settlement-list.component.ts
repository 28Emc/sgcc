import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
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
    RouterModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatPaginatorModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent
  ],
  template: `
    <app-page-header
      title="Liquidaciones de Cobro"
      subtitle="Cálculo automático de montos a cobrar por inquilino mediante prorrateo de recibos y lecturas">
      <button mat-raised-button color="primary" (click)="generateSettlements()" [disabled]="calculating()" class="btn-primary">
        <mat-icon class="mr-1">calculate</mat-icon>
        {{ calculating() ? 'Calculando...' : 'Recalcular Liquidaciones del Mes' }}
      </button>
    </app-page-header>

    <!-- Calculation Engine Formula Infographic -->
    <div class="mb-8 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
        <mat-icon class="!w-64 !h-64 !text-9xl">calculate</mat-icon>
      </div>
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
            Motor de Prorrateo Automático
          </span>
          <h3 class="text-xl font-extrabold tracking-tight text-white">Reglas del Cálculo Transparente</h3>
          <p class="text-xs text-slate-300 max-w-xl mt-1">
            Garantiza una distribución justa del costo del recibo sin discrepancias ni pérdidas.
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
          <div class="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
            <span class="text-[10px] font-semibold text-slate-400 uppercase">Fórmula Valor Unitario</span>
            <p class="font-mono text-xs font-bold text-indigo-200 mt-0.5">VU = Recibo ($) / Consumo Global</p>
          </div>
          <div class="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
            <span class="text-[10px] font-semibold text-slate-400 uppercase">Cobro por Inquilino</span>
            <p class="font-mono text-xs font-bold text-emerald-200 mt-0.5">Monto = (Lectura × VU) + Prorrateo</p>
          </div>
        </div>
      </div>
    </div>

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

    <!-- Settlements Table View -->
    @if (loading()) {
      <app-loading-spinner message="Ejecutando motor de liquidaciones..."></app-loading-spinner>
    } @else {
      @if (filteredSettlements().length === 0) {
        <app-empty-state
          icon="payments"
          title="No hay liquidaciones en este periodo"
          description="Presione el botón 'Recalcular Liquidaciones' para procesar los cobros del mes."
          actionLabel="Generar Liquidación"
          actionIcon="calculate"
          (actionClicked)="generateSettlements()">
        </app-empty-state>
      } @else {
        <mat-card class="card-container mb-8">
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="paginatedSettlements()" class="w-full">
              <ng-container matColumnDef="tenant">
                <th mat-header-cell *matHeaderCellDef>Inquilino</th>
                <td mat-cell *matCellDef="let s">
                  <div class="flex items-center gap-3 py-1">
                    <div class="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                      {{ getInitials(s.tenantName) }}
                    </div>
                    <div>
                      <p class="font-bold text-slate-900 leading-tight">{{ s.tenantName || 'Inquilino' }}</p>
                      <p class="text-xs text-slate-500 mt-0.5">Recibo {{ s.receiptNumber || 'N/A' }}</p>
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
                  <span class="font-mono text-xs font-semibold text-slate-600">$ {{ s.unitValue | number:'1.4-4' }} / unidad</span>
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
                  <span [class]="s.status === 'COMPLETED' ? 'status-badge status-badge-active' : 'status-badge status-badge-pending'">
                    {{ s.status === 'COMPLETED' ? 'PAGADO' : 'PENDIENTE' }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="text-right">Acciones</th>
                <td mat-cell *matCellDef="let s" class="text-right">
                  <button mat-icon-button [routerLink]="[s.id]" title="Ver detalle" class="!text-slate-500 hover:!text-indigo-600">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-stroked-button color="primary" (click)="openVoucherModal(s)" class="!rounded-lg !px-3 !py-1 text-xs">
                    <mat-icon class="!w-4 !h-4 text-xs mr-1">receipt</mat-icon>
                    Voucher
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <mat-paginator
            [length]="filteredSettlements().length"
            [pageIndex]="pageIndex()"
            [pageSize]="pageSize()"
            [pageSizeOptions]="[5, 10, 25, 50]"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        </mat-card>

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
      }
    }
  `
})
export class SettlementListComponent implements OnInit {
  private settlementApi = inject(SettlementApiService);
  private receiptApi = inject(ReceiptApiService);
  private propertyApi = inject(PropertyApiService);
  private tenantApi = inject(TenantApiService);
  private readingApi = inject(ReadingApiService);
  private meterApi = inject(MeterApiService);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['tenant', 'consumption', 'unitRate', 'commonShare', 'totalAmount', 'status', 'actions'];

  selectedReceiptId = signal('');
  selectedPropertyId = signal('');

  settlements = signal<Settlement[]>([]);
  receipts = signal<Receipt[]>([]);
  properties = signal<Property[]>([]);
  loading = signal(true);
  calculating = signal(false);
  selectedVoucher = signal<any | null>(null);
  pageIndex = signal(0);
  pageSize = signal(10);

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

  openVoucherModal(item: any): void {
    this.selectedVoucher.set(item);
  }

  printVoucher(): void {
    window.print();
  }

  getInitials(name: string): string {
    if (!name) return 'IN';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  }
}
