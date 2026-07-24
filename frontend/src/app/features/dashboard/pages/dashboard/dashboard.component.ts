import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { PropertyApiService } from '../../../properties/services/property-api.service';
import { TenantApiService } from '../../../tenants/services/tenant-api.service';
import { MeterApiService } from '../../../meters/services/meter-api.service';
import { SettlementApiService, Settlement } from '../../../settlements/services/settlement-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe, RouterModule, MatIconModule, MatButtonModule, MatTableModule, PageHeaderComponent],
  template: `
    <app-page-header
      title="Dashboard General"
      subtitle="Resumen operativo: propiedades, consumos y estado de cobros">
      <button mat-raised-button color="primary" routerLink="/settlements">
        <mat-icon>calculate</mat-icon>
        Generar Liquidación
      </button>
    </app-page-header>

    <!-- KPI Row -->
    <div class="kpi-grid">
      @for (card of kpiCards(); track card.label) {
        <div class="kpi-card" [style.border-left-color]="card.accent">
          <div class="kpi-body">
            <p class="kpi-label">{{ card.label }}</p>
            <p class="kpi-value">{{ card.value }}</p>
          </div>
          <p class="kpi-sub">{{ card.sub }}</p>
        </div>
      }
    </div>

    <!-- Bottom: Operational Summary + Recent Settlements Table -->
    <div class="dashboard-grid">
      <!-- Operational Summary -->
      <div class="panel operational-panel">
        <div class="panel-header">
          <h2 class="panel-title">Resumen Operativo</h2>
        </div>
        <div class="operational-list">
          <div class="operational-row">
            <div class="op-icon op-icon-info">
              <mat-icon>receipt_long</mat-icon>
            </div>
            <div class="op-body">
              <span class="op-label">Liquidaciones pendientes</span>
              <span class="op-value">{{ pendingSettlements() }}</span>
            </div>
          </div>
          <div class="operational-row">
            <div class="op-icon op-icon-warning">
              <mat-icon>edit_note</mat-icon>
            </div>
            <div class="op-body">
              <span class="op-label">Medidores activos</span>
              <span class="op-value">{{ meterCount() }}</span>
            </div>
          </div>
          <div class="operational-row">
            <div class="op-icon op-icon-success">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="op-body">
              <span class="op-label">Liquidaciones pagadas</span>
              <span class="op-value">{{ completedSettlements() }}</span>
            </div>
          </div>
          <div class="operational-row">
            <div class="op-icon op-icon-neutral">
              <mat-icon>apartment</mat-icon>
            </div>
            <div class="op-body">
              <span class="op-label">Propiedades registradas</span>
              <span class="op-value">{{ propertyCount() }}</span>
            </div>
          </div>
        </div>

        <div class="operational-links">
          <a routerLink="/readings" class="op-link">
            <mat-icon>edit_note</mat-icon>
            Capturar Lecturas
          </a>
          <a routerLink="/settlements" class="op-link">
            <mat-icon>payments</mat-icon>
            Ver Liquidaciones
          </a>
          <a routerLink="/tenants" class="op-link">
            <mat-icon>people_alt</mat-icon>
            Gestionar Inquilinos
          </a>
        </div>
      </div>

      <!-- Recent Settlements Table -->
      <div class="panel recent-panel">
        <div class="panel-header">
          <h2 class="panel-title">Últimas Liquidaciones</h2>
          <a routerLink="/settlements" class="panel-link">Ver todas</a>
        </div>

        @if (loading()) {
          <div class="panel-loading">
            <mat-icon class="spinning">hourglass_empty</mat-icon>
          </div>
        } @else if (recentSettlements().length === 0) {
          <div class="panel-empty">
            <mat-icon>receipt_long</mat-icon>
            <p>No hay liquidaciones registradas</p>
          </div>
        } @else {
          <div class="settlement-table-wrap">
            <table mat-table [dataSource]="recentSettlements()" class="settlement-table">
              <ng-container matColumnDef="tenant">
                <th mat-header-cell *matHeaderCellDef>Inquilino</th>
                <td mat-cell *matCellDef="let s">
                  <div class="tenant-cell">
                    <span class="tenant-avatar">{{ getInitials(s.tenantName) }}</span>
                    <span class="tenant-name">{{ s.tenantName || '—' }}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="receipt">
                <th mat-header-cell *matHeaderCellDef>Recibo</th>
                <td mat-cell *matCellDef="let s">{{ s.receiptNumber || '—' }}</td>
              </ng-container>

              <ng-container matColumnDef="consumption">
                <th mat-header-cell *matHeaderCellDef>Consumo</th>
                <td mat-cell *matCellDef="let s">{{ s.consumption | number:'1.2-2' }}</td>
              </ng-container>

              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef class="text-right">Monto</th>
                <td mat-cell *matCellDef="let s" class="text-right font-semibold">
                  S/ {{ (s.finalAmount || s.calculatedAmount || 0) | number:'1.2-2' }}
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let s">
                  <span [class]="badgeClass(s.status)">{{ statusLabel(s.status) }}</span>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    /* ── KPI Grid ── */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    @media (max-width: 1100px) {
      .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    }

    .kpi-card {
      background: var(--surface-card);
      border-radius: var(--radius-md);
      border: 1px solid var(--surface-border-light);
      border-left: 3px solid var(--color-primary-500);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      box-shadow: var(--shadow-xs);
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
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
      line-height: 1.15;
      letter-spacing: -0.02em;
    }

    .kpi-sub {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin: 0;
      margin-top: auto;
    }

    /* ── Dashboard Grid ── */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 20px;
    }

    @media (max-width: 900px) {
      .dashboard-grid { grid-template-columns: 1fr; }
    }

    /* ── Panels shared ── */
    .panel {
      background: var(--surface-card);
      border-radius: var(--radius-md);
      border: 1px solid var(--surface-border-light);
      box-shadow: var(--shadow-xs);
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px 0;
    }

    .panel-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .panel-link {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--color-primary-600);
      text-decoration: none;
    }

    .panel-link:hover { text-decoration: underline; }

    .panel-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px;
      color: var(--text-muted);
    }

    .panel-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 48px 16px;
      color: var(--text-muted);
      text-align: center;
    }

    .panel-empty mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      opacity: 0.5;
    }

    .panel-empty p {
      font-size: 0.85rem;
      margin: 0;
    }

    /* ── Operational Panel ── */
    .operational-panel {
      padding-bottom: 16px;
    }

    .operational-list {
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .operational-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid var(--surface-border-light);
    }

    .operational-row:last-child { border-bottom: none; }

    .op-icon {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .op-icon mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .op-icon-info    { background: #eff6ff; color: #2563eb; }
    .op-icon-warning { background: #fffbeb; color: #d97706; }
    .op-icon-success { background: #f0fdf4; color: #15803d; }
    .op-icon-neutral { background: #f1f5f9; color: #475569; }

    .op-body {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .op-label {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .op-value {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .operational-links {
      padding: 0 20px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      border-top: 1px solid var(--surface-border-light);
      padding-top: 12px;
      margin: 0 12px;
    }

    .op-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 8px;
      text-decoration: none;
      font-size: 0.825rem;
      font-weight: 600;
      color: var(--color-primary-600);
      transition: background 0.12s ease;
    }

    .op-link:hover {
      background: var(--color-primary-50);
    }

    .op-link mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* ── Settlements Table Panel ── */
    .recent-panel {
      padding-bottom: 8px;
    }

    .settlement-table-wrap {
      padding: 12px 0 0;
      overflow-x: auto;
    }

    .settlement-table {
      width: 100%;
    }

    .tenant-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .tenant-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: var(--color-primary-50);
      color: var(--color-primary-600);
      font-weight: 700;
      font-size: 0.7rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      letter-spacing: 0.02em;
    }

    .tenant-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .text-right { text-align: right; }
    .font-semibold { font-weight: 600; }

    .spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private propertyApi = inject(PropertyApiService);
  private tenantApi = inject(TenantApiService);
  private meterApi = inject(MeterApiService);
  private settlementApi = inject(SettlementApiService);

  displayedColumns = ['tenant', 'receipt', 'consumption', 'amount', 'status'];

  loading = signal(true);
  propertyCount = signal(0);
  tenantCount = signal(0);
  meterCount = signal(0);
  settlementTotal = signal(0);
  recentSettlements = signal<Settlement[]>([]);

  pendingSettlements = computed(() =>
    this.recentSettlements().filter(s => s.status === 'PENDING').length
  );

  completedSettlements = computed(() =>
    this.recentSettlements().filter(s => s.status === 'COMPLETED').length
  );

  kpiCards = computed(() => [
    {
      label: 'Propiedades',
      value: this.propertyCount(),
      sub: `${this.propertyCount()} inmuebles registrados`,
      accent: '#4f46e5',
    },
    {
      label: 'Inquilinos',
      value: this.tenantCount(),
      sub: `${this.tenantCount()} contratos activos`,
      accent: '#7c3aed',
    },
    {
      label: 'Medidores',
      value: this.meterCount(),
      sub: `${this.meterCount()} contadores instalados`,
      accent: '#d97706',
    },
    {
      label: 'Liquidado del mes',
      value: `S/ ${this.settlementTotal().toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
      sub: `${this.recentSettlements().length} liquidaciones registradas`,
      accent: '#15803d',
    },
  ]);

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
          this.recentSettlements.set(data.slice(0, 8));
        }
        checkDone();
      },
      error: () => { checkDone(); }
    });
  }

  getInitials(name?: string): string {
    if (!name) return 'IN';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
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
