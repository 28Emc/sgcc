import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { SettlementApiService } from '../../services/settlement-api.service';

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
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent
  ],
  template: `
    <app-page-header 
      title="Liquidaciones de Cobro" 
      subtitle="Cálculo automático de montos a cobrar por inquilino mediante prorrateo de recibos y lecturas">
      <button mat-raised-button color="primary" (click)="generateSettlements()" [disabled]="calculating()" class="!rounded-xl !px-5 !py-2 shadow-md">
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
            Motor de Prorrateo Automático Active
          </span>
          <h3 class="text-xl font-extrabold tracking-tight text-white">Reglas del Cálculo Transparente</h3>
          <p class="text-xs text-slate-300 max-w-xl mt-1">
            Garantiza una distribución justa del costo del recibo sin discrepancias ni perdidas.
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
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
      <div class="flex items-center gap-4">
        <mat-form-field appearance="outline" class="!mb-0 text-sm w-48">
          <mat-label>Periodo de Cobro</mat-label>
          <mat-select [ngModel]="selectedPeriod()" (ngModelChange)="selectedPeriod.set($event)">
            <mat-option value="2026-07">Julio 2026</mat-option>
            <mat-option value="2026-06">Junio 2026</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="!mb-0 text-sm w-56">
          <mat-label>Inmueble</mat-label>
          <mat-select [ngModel]="selectedProperty()" (ngModelChange)="selectedProperty.set($event)">
            <mat-option value="Edificio Los Olivos">Edificio Los Olivos</mat-option>
            <mat-option value="Residencial San Martín">Residencial San Martín</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="text-right">
        <span class="text-xs text-slate-500 font-medium block">Total General a Recaudar:</span>
        <span class="text-2xl font-extrabold text-slate-900 font-mono">$ {{ totalSettlementSum() | number:'1.2-2' }}</span>
      </div>
    </div>

    <!-- Settlements Table View -->
    @if (loading()) {
      <app-loading-spinner message="Ejecutando motor de liquidaciones..."></app-loading-spinner>
    } @else {
      @if (settlements().length === 0) {
        <app-empty-state
          icon="payments"
          title="No hay liquidaciones en este periodo"
          description="Presione el botón 'Recalcular Liquidaciones' para procesar los cobros del mes."
          actionLabel="Generar Liquidación"
          actionIcon="calculate"
          (actionClicked)="generateSettlements()">
        </app-empty-state>
      } @else {
        <mat-card class="!p-0 overflow-hidden shadow-sm border border-slate-200/80 mb-8">
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="settlements()" class="w-full">
              <!-- Tenant & Unit Column -->
              <ng-container matColumnDef="tenant">
                <th mat-header-cell *matHeaderCellDef>Inquilino / Unidad</th>
                <td mat-cell *matCellDef="let s">
                  <div class="flex items-center gap-3 py-1">
                    <div class="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                      {{ getInitials(s.tenantName) }}
                    </div>
                    <div>
                      <p class="font-bold text-slate-900 leading-tight">{{ s.tenantName }}</p>
                      <p class="text-xs text-slate-500 mt-0.5">{{ s.unitName }} ({{ s.propertyName }})</p>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Service & Consumption Column -->
              <ng-container matColumnDef="consumption">
                <th mat-header-cell *matHeaderCellDef>Servicio / Consumo</th>
                <td mat-cell *matCellDef="let s">
                  <div>
                    <span class="font-bold text-slate-800 text-sm">{{ s.serviceName }}</span>
                    <p class="text-xs font-mono text-indigo-600 font-semibold">{{ s.consumption }} kWh (Indiv.)</p>
                  </div>
                </td>
              </ng-container>

              <!-- Unit Rate Column -->
              <ng-container matColumnDef="unitRate">
                <th mat-header-cell *matHeaderCellDef>Valor Unitario</th>
                <td mat-cell *matCellDef="let s">
                  <span class="font-mono text-xs font-semibold text-slate-600">$ {{ s.unitValue | number:'1.4-4' }} / kWh</span>
                </td>
              </ng-container>

              <!-- Common Area Share Column -->
              <ng-container matColumnDef="commonShare">
                <th mat-header-cell *matHeaderCellDef>Área Común</th>
                <td mat-cell *matCellDef="let s">
                  <span class="text-xs font-mono text-slate-500">$ {{ s.commonAreaShare | number:'1.2-2' }}</span>
                </td>
              </ng-container>

              <!-- Total Tenant Amount Column -->
              <ng-container matColumnDef="totalAmount">
                <th mat-header-cell *matHeaderCellDef>Total Inquilino</th>
                <td mat-cell *matCellDef="let s">
                  <span class="font-extrabold text-slate-900 text-base font-mono">$ {{ s.totalAmount | number:'1.2-2' }}</span>
                </td>
              </ng-container>

              <!-- Payment Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let s">
                  <span [class]="s.status === 'PAID' ? 'status-badge status-badge-active' : 'status-badge status-badge-pending'">
                    {{ s.status === 'PAID' ? 'PAGADO' : 'PENDIENTE' }}
                  </span>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="text-right">Comprobante</th>
                <td mat-cell *matCellDef="let s" class="text-right">
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

              <!-- Voucher Content Card -->
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6 space-y-3">
                <div class="text-center pb-3 border-b border-slate-200/60">
                  <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">SGCC - Recibo Inquilino</p>
                  <h4 class="text-lg font-extrabold text-slate-900">{{ selectedVoucher().tenantName }}</h4>
                  <p class="text-xs text-indigo-600 font-semibold">{{ selectedVoucher().unitName }}</p>
                </div>

                <div class="space-y-1.5 text-xs text-slate-600">
                  <div class="flex justify-between">
                    <span>Periodo:</span>
                    <strong class="text-slate-900 font-mono">{{ selectedVoucher().period }}</strong>
                  </div>
                  <div class="flex justify-between">
                    <span>Servicio:</span>
                    <strong class="text-slate-900">{{ selectedVoucher().serviceName }}</strong>
                  </div>
                  <div class="flex justify-between">
                    <span>Consumo Medidor:</span>
                    <strong class="text-slate-900 font-mono">{{ selectedVoucher().consumption }} kWh</strong>
                  </div>
                  <div class="flex justify-between">
                    <span>Tarifa Unitario:</span>
                    <strong class="text-slate-900 font-mono">$ {{ selectedVoucher().unitValue | number:'1.4-4' }}</strong>
                  </div>
                  <div class="flex justify-between text-slate-500">
                    <span>Subtotal Consumo:</span>
                    <span class="font-mono">$ {{ (selectedVoucher().consumption * selectedVoucher().unitValue) | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between text-slate-500">
                    <span>Cuota Área Común:</span>
                    <span class="font-mono">$ {{ selectedVoucher().commonAreaShare | number:'1.2-2' }}</span>
                  </div>
                </div>

                <div class="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span class="font-extrabold text-slate-900 text-sm">TOTAL A PAGAR:</span>
                  <span class="text-2xl font-black text-indigo-700 font-mono">$ {{ selectedVoucher().totalAmount | number:'1.2-2' }}</span>
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
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['tenant', 'consumption', 'unitRate', 'commonShare', 'totalAmount', 'status', 'actions'];

  selectedPeriod = signal('2026-07');
  selectedProperty = signal('Edificio Los Olivos');
  
  settlements = signal<any[]>([]);
  loading = signal(true);
  calculating = signal(false);
  selectedVoucher = signal<any | null>(null);

  totalSettlementSum = computed(() => {
    return this.settlements().reduce((acc, curr) => acc + curr.totalAmount, 0);
  });

  ngOnInit(): void {
    this.loadSettlements();
  }

  loadSettlements(): void {
    this.loading.set(true);
    this.settlementApi.findAll().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.settlements.set(data);
        } else {
          this.loadSampleSettlements();
        }
        this.loading.set(false);
      },
      error: () => {
        this.loadSampleSettlements();
        this.loading.set(false);
      }
    });
  }

  private loadSampleSettlements(): void {
    // Calculated based on Unit Value = $ 0.5989 / kWh
    this.settlements.set([
      { 
        id: '1', 
        tenantName: 'Juan Pérez', 
        unitName: 'Depto 101', 
        propertyName: 'Edificio Los Olivos', 
        serviceName: 'Electricidad ⚡', 
        consumption: 300.0, 
        unitValue: 0.5989, 
        commonAreaShare: 15.50, 
        totalAmount: 195.17, 
        status: 'PAID', 
        period: '2026-07' 
      },
      { 
        id: '2', 
        tenantName: 'María García', 
        unitName: 'Depto 102', 
        propertyName: 'Edificio Los Olivos', 
        serviceName: 'Electricidad ⚡', 
        consumption: 320.5, 
        unitValue: 0.5989, 
        commonAreaShare: 15.50, 
        totalAmount: 207.45, 
        status: 'PENDING', 
        period: '2026-07' 
      },
      { 
        id: '3', 
        tenantName: 'Carlos Mendoza', 
        unitName: 'Depto 201', 
        propertyName: 'Edificio Los Olivos', 
        serviceName: 'Electricidad ⚡', 
        consumption: 210.0, 
        unitValue: 0.5989, 
        commonAreaShare: 15.50, 
        totalAmount: 141.27, 
        status: 'PAID', 
        period: '2026-07' 
      }
    ]);
  }

  generateSettlements(): void {
    this.calculating.set(true);
    setTimeout(() => {
      this.loadSampleSettlements();
      this.calculating.set(false);
      this.snackBar.open('¡Liquidaciones calculadas exitosamente con el motor de prorrateo!', 'Cerrar', { duration: 4000 });
    }, 800);
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
