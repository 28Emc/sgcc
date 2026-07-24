import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { PropertyApiService } from '../../../properties/services/property-api.service';
import { TenantApiService } from '../../../tenants/services/tenant-api.service';
import { MeterApiService } from '../../../meters/services/meter-api.service';
import { SettlementApiService, Settlement } from '../../../settlements/services/settlement-api.service';

interface KpiCard {
  label: string;
  value: string | number;
  sub: string;
  icon: string;
  color: string;
  bg: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe, RouterModule, MatIconModule, MatButtonModule, PageHeaderComponent],
  template: `
    <app-page-header
      title="Dashboard General"
      subtitle="Resumen de propiedades, consumos y estado de cobros del mes">
      <button class="btn-primary" routerLink="/settlements">
        <mat-icon>calculate</mat-icon>
        Generar Liquidación
      </button>
    </app-page-header>

    <!-- KPI Cards -->
    <div class="kpi-grid stagger-children">
      @for (card of kpiCards(); track card.label) {
        <div class="kpi-card fade-in">
          <div class="kpi-body">
            <p class="kpi-label">{{ card.label }}</p>
            <p class="kpi-value">{{ card.value }}</p>
            <p class="kpi-sub">{{ card.sub }}</p>
          </div>
          <div class="kpi-icon-wrap" [style.background]="card.bg" [style.color]="card.color">
            <mat-icon>{{ card.icon }}</mat-icon>
          </div>
        </div>
      }
    </div>

    <!-- Bottom Grid -->
    <div class="dashboard-grid">
      <!-- Quick Actions -->
      <div class="quick-actions-panel">
        <h2 class="panel-title">Acciones rápidas</h2>
        <div class="quick-actions-list">
          @for (action of quickActions; track action.label) {
            <a [routerLink]="action.route" class="quick-action-item">
              <div class="action-icon-wrap" [style.background]="action.bg" [style.color]="action.color">
                <mat-icon>{{ action.icon }}</mat-icon>
              </div>
              <div class="action-text">
                <span class="action-label">{{ action.label }}</span>
                <span class="action-desc">{{ action.desc }}</span>
              </div>
              <mat-icon class="action-chevron">chevron_right</mat-icon>
            </a>
          }
        </div>
      </div>

      <!-- Recent Settlements -->
      <div class="recent-panel">
        <div class="panel-header">
          <h2 class="panel-title">Últimas liquidaciones</h2>
          <a routerLink="/settlements" class="panel-link">Ver todas →</a>
        </div>

        @if (recentSettlements().length === 0) {
          <div class="text-center py-8 text-slate-400">
            <mat-icon class="!w-10 !h-10 mb-2">receipt_long</mat-icon>
            <p class="text-sm font-medium">No hay liquidaciones registradas</p>
          </div>
        } @else {
          <div class="settlements-list">
            @for (item of recentSettlements(); track item.id) {
              <div class="settlement-row">
                <div class="settlement-avatar">
                  {{ (item.tenantName || 'IN').substring(0, 2).toUpperCase() }}
                </div>
                <div class="settlement-info">
                  <span class="settlement-name">{{ item.tenantName || 'Inquilino' }}</span>
                  <span class="settlement-unit">Recibo {{ item.receiptNumber || '—' }}</span>
                </div>
                <div class="settlement-right">
                  <span class="settlement-amount">S/ {{ (item.finalAmount || item.calculatedAmount || 0) | number:'1.2-2' }}</span>
                  <span [class]="badgeClass(item.status)">{{ statusLabel(item.status) }}</span>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    /* KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 28px;
    }

    .kpi-card {
      background: var(--surface-card);
      border-radius: var(--radius-lg);
      border: 1px solid var(--surface-border-light);
      padding: 20px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      box-shadow: var(--shadow-sm);
      transition: box-shadow 0.2s ease, transform 0.2s ease;
    }

    .kpi-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .kpi-body {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .kpi-label {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: var(--text-muted);
      margin: 0;
    }

    .kpi-value {
      font-size: 2rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }

    .kpi-sub {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin: 0;
    }

    .kpi-icon-wrap {
      width: 46px;
      height: 46px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .kpi-icon-wrap mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    /* Dashboard bottom grid */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 20px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    /* Panels shared */
    .panel-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 14px;
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }

    .panel-link {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--color-primary-600);
      text-decoration: none;
      transition: color 0.15s;
    }

    .panel-link:hover { color: var(--color-primary-700); }

    /* Quick actions */
    .quick-actions-panel {
      background: var(--surface-card);
      border-radius: var(--radius-lg);
      border: 1px solid var(--surface-border-light);
      padding: 20px;
      box-shadow: var(--shadow-sm);
    }

    .quick-actions-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .quick-action-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: var(--radius-md);
      text-decoration: none;
      transition: background 0.15s ease;
      cursor: pointer;
    }

    .quick-action-item:hover {
      background: var(--surface-bg);
    }

    .action-icon-wrap {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .action-icon-wrap mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .action-text {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .action-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .action-desc {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .action-chevron {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--text-muted);
    }

    /* Recent settlements */
    .recent-panel {
      background: var(--surface-card);
      border-radius: var(--radius-lg);
      border: 1px solid var(--surface-border-light);
      padding: 20px;
      box-shadow: var(--shadow-sm);
    }

    .settlements-list {
      display: flex;
      flex-direction: column;
    }

    .settlement-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid var(--surface-border-light);
    }

    .settlement-row:last-child {
      border-bottom: none;
    }

    .settlement-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-primary-100), var(--color-primary-200));
      color: var(--color-primary-700);
      font-weight: 700;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .settlement-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 0;
    }

    .settlement-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .settlement-unit {
      font-size: 0.75rem;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .settlement-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
      flex-shrink: 0;
    }

    .settlement-amount {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    /* Primary Button */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700));
      color: white;
      border: none;
      border-radius: var(--radius-lg);
      font-size: 0.875rem;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      text-decoration: none;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
    }

    .btn-primary mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private propertyApi = inject(PropertyApiService);
  private tenantApi = inject(TenantApiService);
  private meterApi = inject(MeterApiService);
  private settlementApi = inject(SettlementApiService);

  loading = signal(true);
  propertyCount = signal(0);
  tenantCount = signal(0);
  meterCount = signal(0);
  settlementTotal = signal(0);

  kpiCards = computed<KpiCard[]>(() => [
    { label: 'Propiedades', value: this.propertyCount(), sub: 'Inmuebles registrados', icon: 'apartment', color: '#4f46e5', bg: '#eef2ff' },
    { label: 'Inquilinos activos', value: this.tenantCount(), sub: 'Contratos vigentes', icon: 'people_alt', color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Medidores activos', value: this.meterCount(), sub: 'Contadores instalados', icon: 'speed', color: '#b45309', bg: '#fffbeb' },
    { label: 'Liquidado del mes', value: `S/ ${this.settlementTotal().toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, sub: 'Monto total', icon: 'payments', color: '#15803d', bg: '#f0fdf4' },
  ]);

  quickActions = [
    { label: 'Registrar Recibo', desc: 'Ingresar factura del proveedor', icon: 'receipt_long', route: '/receipts', color: '#4f46e5', bg: '#eef2ff' },
    { label: 'Capturar Lecturas', desc: 'Ingresar lectura de medidores', icon: 'edit_note', route: '/readings', color: '#0369a1', bg: '#f0f9ff' },
    { label: 'Ver Liquidaciones', desc: 'Revisar cobros del período', icon: 'payments', route: '/settlements', color: '#15803d', bg: '#f0fdf4' },
    { label: 'Gestionar Inquilinos', desc: 'Administrar contratos y datos', icon: 'people_alt', route: '/tenants', color: '#7c3aed', bg: '#f5f3ff' },
  ];

  recentSettlements = signal<Settlement[]>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading.set(true);
    let completed = 0;
    const total = 4;

    const checkDone = () => {
      completed++;
      if (completed >= total) this.loading.set(false);
    };

    this.propertyApi.findAll().subscribe({
      next: (data: any[]) => { this.propertyCount.set(data?.length || 0); checkDone(); },
      error: () => { checkDone(); }
    });

    this.tenantApi.findAll().subscribe({
      next: (data: any[]) => { this.tenantCount.set(data?.length || 0); checkDone(); },
      error: () => { checkDone(); }
    });

    this.meterApi.findAll().subscribe({
      next: (data: any[]) => { this.meterCount.set(data?.length || 0); checkDone(); },
      error: () => { checkDone(); }
    });

    this.settlementApi.findAll().subscribe({
      next: (data: any[]) => {
        if (data && data.length > 0) {
          const total = data.reduce((sum: number, s: any) => sum + (s.finalAmount || s.calculatedAmount || 0), 0);
          this.settlementTotal.set(total);
          this.recentSettlements.set(data.slice(0, 5));
        }
        checkDone();
      },
      error: () => { checkDone(); }
    });
  }

  badgeClass(status: string): string {
    const map: Record<string, string> = {
      COMPLETED: 'badge badge-success',
      PAID: 'badge badge-success',
      PENDING: 'badge badge-warning',
      ACTIVE: 'badge badge-warning',
      OVERDUE: 'badge badge-danger',
    };
    return map[status] ?? 'badge badge-neutral';
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      COMPLETED: 'PAGADO',
      PAID: 'PAGADO',
      PENDING: 'PENDIENTE',
      ACTIVE: 'PENDIENTE',
      OVERDUE: 'VENCIDO',
    };
    return map[status] ?? status;
  }
}
