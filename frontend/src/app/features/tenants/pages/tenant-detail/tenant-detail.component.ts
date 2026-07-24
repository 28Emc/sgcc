import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { TenantApiService, Tenant } from '../../services/tenant-api.service';
import { SettlementApiService, Settlement } from '../../../settlements/services/settlement-api.service';

@Component({
  selector: 'app-tenant-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    PageHeaderComponent,
    LoadingSpinnerComponent
  ],
  template: `
    @if (loading()) {
      <app-loading-spinner message="Cargando detalle del inquilino..."></app-loading-spinner>
    } @else if (tenant()) {
      <!-- Gradient Hero Banner -->
      <div class="hero-banner mb-8 p-6 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 text-white shadow-xl relative overflow-hidden fade-in">
        <div class="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <mat-icon class="!w-48 !h-48">person</mat-icon>
        </div>
        <div class="relative z-10 flex items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-500 text-white font-extrabold flex items-center justify-center text-lg shadow-lg">
            {{ getInitials(tenant()?.name) }}
          </div>
          <div>
            <h2 class="text-xl font-extrabold tracking-tight">{{ tenant()?.name }}</h2>
            <p class="text-sm text-purple-100 mt-0.5">{{ tenant()?.email || 'Sin correo registrado' }}</p>
          </div>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="action-bar flex items-center justify-between mb-8 pb-5 border-b border-slate-100">
        <button mat-button (click)="goBack()" class="!rounded-xl !px-4 !py-2">
          <mat-icon class="mr-1">arrow_back</mat-icon>
          Volver
        </button>
        <div class="flex items-center gap-3">
          <button mat-stroked-button color="primary" [routerLink]="['/tenants', tenantId, 'edit']" class="!rounded-xl !px-4 !py-2">
            <mat-icon class="mr-1">edit</mat-icon>
            Editar
          </button>
          <button mat-stroked-button (click)="deleteTenant()" class="!rounded-xl !px-4 !py-2 btn-delete">
            <mat-icon class="mr-1">delete</mat-icon>
            Eliminar
          </button>
        </div>
      </div>

      <div class="detail-grid grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Info Card -->
        <div class="lg:col-span-1">
          <div class="detail-card rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden fade-in">
            <div class="section-header flex items-center gap-3 p-5 border-b border-slate-100">
              <div class="section-icon w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <mat-icon>person</mat-icon>
              </div>
              <h3 class="section-title text-sm font-bold text-slate-900">Datos Personales</h3>
            </div>
            <div class="p-5">
              <div class="info-grid grid grid-cols-1 gap-4">
                <div>
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Estado</p>
                  <span [class]="tenant()?.status === 'ACTIVE' ? 'badge badge-success' : 'badge badge-danger'">
                    {{ tenant()?.status === 'ACTIVE' ? 'CONTRATO ACTIVO' : 'INACTIVO' }}
                  </span>
                </div>
                <div>
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Documento</p>
                  <p class="info-value text-sm font-mono font-semibold text-slate-900 flex items-center gap-1.5">
                    <mat-icon class="!w-4 !h-4 text-slate-400">badge</mat-icon>
                    {{ tenant()?.documentNumber || '—' }}
                  </p>
                </div>
                <div>
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email</p>
                  <p class="info-value text-sm text-slate-700 flex items-center gap-1.5">
                    <mat-icon class="!w-4 !h-4 text-slate-400">email</mat-icon>
                    {{ tenant()?.email || '—' }}
                  </p>
                </div>
                <div>
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Teléfono</p>
                  <p class="info-value text-sm text-slate-700 flex items-center gap-1.5">
                    <mat-icon class="!w-4 !h-4 text-slate-400">phone</mat-icon>
                    {{ tenant()?.phone || '—' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Settlements Card -->
        <div class="lg:col-span-2">
          <div class="detail-card rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden fade-in">
            <div class="section-header flex items-center gap-3 p-5 border-b border-slate-100">
              <div class="section-icon w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <mat-icon>receipt_long</mat-icon>
              </div>
              <div>
                <h3 class="section-title text-sm font-bold text-slate-900">Liquidaciones Recientes</h3>
                <p class="text-xs text-slate-500">{{ settlements().length }} registros encontrados</p>
              </div>
            </div>
            <div class="p-5 space-y-3">
              @for (item of settlements(); track item.id) {
                <a [routerLink]="['/settlements', item.id]" class="settlement-row flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-amber-300 hover:bg-amber-50/30 hover:shadow-sm transition-all cursor-pointer">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <mat-icon class="!w-5 !h-5">bolt</mat-icon>
                    </div>
                    <div>
                      <p class="font-bold text-slate-900 text-sm">{{ item.receiptNumber || 'N/A' }}</p>
                      <p class="text-xs text-slate-500">{{ item.period || '—' }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-extrabold text-slate-900 text-sm font-mono">S/ {{ (item.finalAmount || item.calculatedAmount || 0) | number:'1.2-2' }}</p>
                    <span [class]="item.status === 'COMPLETED' ? 'badge badge-success' : 'badge badge-neutral'">
                      {{ item.status === 'COMPLETED' ? 'PAGADO' : 'PENDIENTE' }}
                    </span>
                  </div>
                </a>
              } @empty {
                <div class="empty-slot text-center py-10 text-slate-400 text-sm">
                  No hay liquidaciones registradas para este inquilino.
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="text-center py-20 text-slate-400">
        <mat-icon class="!w-16 !h-16 mb-4">error_outline</mat-icon>
        <p class="text-lg font-semibold">No se encontró el inquilino</p>
      </div>
    }
  `,
  styles: [`
    :host { display: block; padding: 24px; max-width: 1400px; margin: 0 auto; }
    .btn-delete { color: #ef4444 !important; border-color: #fecaca !important; }
    .btn-delete:hover { background: #fef2f2 !important; border-color: #ef4444 !important; }
    .badge { display: inline-flex; align-items: center; padding: 2px 10px; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.03em; }
    .badge-success { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
    .badge-danger { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
    .badge-neutral { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }
    .empty-slot { border: 1px dashed var(--surface-border); border-radius: var(--radius-lg); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .fade-in { animation: fadeIn 0.35s ease; }
  `]
})
export class TenantDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tenantApi = inject(TenantApiService);
  private settlementApi = inject(SettlementApiService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  tenantId = '';
  tenant = signal<Tenant | null>(null);
  settlements = signal<Settlement[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.tenantId = this.route.snapshot.paramMap.get('id') || '';
    if (this.tenantId) {
      this.loadTenantDetail();
    } else {
      this.loading.set(false);
    }
  }

  loadTenantDetail(): void {
    this.loading.set(true);
    this.tenantApi.findById(this.tenantId).subscribe({
      next: (data) => { this.tenant.set(data); this.loadSettlements(); },
      error: () => { this.tenant.set(null); this.loading.set(false); }
    });
  }

  private loadSettlements(): void {
    this.settlementApi.findAll().subscribe({
      next: (all) => { this.settlements.set(all.filter((s: any) => s.tenantId === this.tenantId)); this.loading.set(false); },
      error: () => { this.settlements.set([]); this.loading.set(false); }
    });
  }

  getInitials(name?: string): string {
    if (!name) return 'IN';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  }

  goBack(): void { this.router.navigate(['/tenants']); }

  deleteTenant(): void {
    const t = this.tenant();
    if (!t?.id) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Eliminar Inquilino', message: `¿Está seguro de eliminar a "${t.name}"? Esta acción no se puede deshacer.`, confirmLabel: 'Eliminar', color: 'warn' } as ConfirmDialogData
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.tenantApi.delete(t.id!).subscribe({
          next: () => { this.snackBar.open('Inquilino eliminado', 'OK', { duration: 3000 }); this.router.navigate(['/tenants']); },
          error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }
}
