import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    PageHeaderComponent
  ],
  template: `
    <app-page-header 
      title="Dashboard General" 
      subtitle="Resumen de propiedades, consumos y estado de cobros de servicios">
      <button mat-raised-button color="primary" routerLink="/settlements" class="!rounded-xl !px-5 !py-2 shadow-md">
        <mat-icon class="mr-1">calculate</mat-icon>
        Generar Liquidación
      </button>
    </app-page-header>

    <!-- KPI Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- KPI 1 -->
      <mat-card class="!p-6 !mb-0 border-l-4 !border-l-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Propiedades</p>
            <h3 class="text-3xl font-extrabold text-slate-900 mt-1">{{ totalProperties() }}</h3>
            <span class="inline-flex items-center text-xs font-medium text-emerald-600 mt-2">
              <mat-icon class="!w-4 !h-4 text-xs mr-0.5">arrow_upward</mat-icon> 5 Unidades en total
            </span>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
            <mat-icon class="!w-6 !h-6">apartment</mat-icon>
          </div>
        </div>
      </mat-card>

      <!-- KPI 2 -->
      <mat-card class="!p-6 !mb-0 border-l-4 !border-l-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inquilinos Activos</p>
            <h3 class="text-3xl font-extrabold text-slate-900 mt-1">{{ totalTenants() }}</h3>
            <span class="inline-flex items-center text-xs font-medium text-slate-500 mt-2">
              Contratos vigentes
            </span>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
            <mat-icon class="!w-6 !h-6">people</mat-icon>
          </div>
        </div>
      </mat-card>

      <!-- KPI 3 -->
      <mat-card class="!p-6 !mb-0 border-l-4 !border-l-amber-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Medidores Activos</p>
            <h3 class="text-3xl font-extrabold text-slate-900 mt-1">{{ totalMeters() }}</h3>
            <span class="inline-flex items-center text-xs font-medium text-amber-600 mt-2">
              ⚡ Luz / 💧 Agua
            </span>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
            <mat-icon class="!w-6 !h-6">speed</mat-icon>
          </div>
        </div>
      </mat-card>

      <!-- KPI 4 -->
      <mat-card class="!p-6 !mb-0 border-l-4 !border-l-emerald-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Liquidado del Mes</p>
            <h3 class="text-3xl font-extrabold text-slate-900 mt-1">$ {{ totalSettled() }}</h3>
            <span class="inline-flex items-center text-xs font-medium text-emerald-600 mt-2">
              <mat-icon class="!w-4 !h-4 text-xs mr-0.5">check_circle</mat-icon> Al día
            </span>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
            <mat-icon class="!w-6 !h-6">payments</mat-icon>
          </div>
        </div>
      </mat-card>
    </div>

    <!-- Quick Access & Recent Operations -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Quick Actions Grid -->
      <div class="lg:col-span-1 space-y-4">
        <h4 class="text-base font-bold text-slate-800">Acciones Rápidas</h4>
        
        <a routerLink="/receipts" class="block p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all group">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <mat-icon>receipt_long</mat-icon>
            </div>
            <div>
              <p class="font-semibold text-slate-900 text-sm">Registrar Recibo Global</p>
              <p class="text-xs text-slate-500">Ingresar factura del proveedor</p>
            </div>
          </div>
        </a>

        <a routerLink="/readings" class="block p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all group">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <mat-icon>edit_note</mat-icon>
            </div>
            <div>
              <p class="font-semibold text-slate-900 text-sm">Capturar Lecturas</p>
              <p class="text-xs text-slate-500">Ingresar lectura de medidores</p>
            </div>
          </div>
        </a>

        <a routerLink="/properties" class="block p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all group">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <mat-icon>domain_add</mat-icon>
            </div>
            <div>
              <p class="font-semibold text-slate-900 text-sm">Gestionar Propiedades</p>
              <p class="text-xs text-slate-500">Ver inmuebles y departamentos</p>
            </div>
          </div>
        </a>
      </div>

      <!-- Recent Activity Table -->
      <div class="lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-base font-bold text-slate-800">Últimas Liquidaciones Generadas</h4>
          <a routerLink="/settlements" class="text-xs font-semibold text-indigo-600 hover:text-indigo-800">Ver todas →</a>
        </div>

        <mat-card class="!p-0 overflow-hidden">
          <table mat-table [dataSource]="recentSettlements()" class="w-full">
            <ng-container matColumnDef="tenant">
              <th mat-header-cell *matHeaderCellDef>Inquilino / Unidad</th>
              <td mat-cell *matCellDef="let item">
                <div>
                  <p class="font-medium text-slate-900">{{ item.tenant }}</p>
                  <p class="text-xs text-slate-500">{{ item.unit }}</p>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="service">
              <th mat-header-cell *matHeaderCellDef>Servicio</th>
              <td mat-cell *matCellDef="let item">
                <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                  {{ item.service }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef>Monto Pagar</th>
              <td mat-cell *matCellDef="let item">
                <span class="font-bold text-slate-900">$ {{ item.amount | number:'1.2-2' }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let item">
                <span [class]="item.status === 'PAID' ? 'status-badge status-badge-active' : 'status-badge status-badge-pending'">
                  {{ item.status === 'PAID' ? 'PAGADO' : 'PENDIENTE' }}
                </span>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card>
      </div>
    </div>
  `
})
export class DashboardComponent {
  totalProperties = signal(3);
  totalTenants = signal(8);
  totalMeters = signal(12);
  totalSettled = signal(1450.50);

  displayedColumns = ['tenant', 'service', 'amount', 'status'];

  recentSettlements = signal([
    { tenant: 'Juan Pérez', unit: 'Dep. 101 - Edificio Los Olivos', service: 'Electricidad ⚡', amount: 145.80, status: 'PAID' },
    { tenant: 'María García', unit: 'Dep. 102 - Edificio Los Olivos', service: 'Electricidad ⚡', amount: 182.30, status: 'PENDING' },
    { tenant: 'Carlos Mendoza', unit: 'Dep. 201 - Edificio Los Olivos', service: 'Agua Potable 💧', amount: 95.00, status: 'PAID' }
  ]);
}
