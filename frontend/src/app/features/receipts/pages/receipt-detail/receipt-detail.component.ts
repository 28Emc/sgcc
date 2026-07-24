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
import { ReceiptApiService, Receipt } from '../../services/receipt-api.service';
import { ServiceApiService } from '../../../services/services/service-api.service';
import { SettlementApiService, Settlement } from '../../../settlements/services/settlement-api.service';

@Component({
  selector: 'app-receipt-detail',
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
      <app-loading-spinner message="Cargando recibo..."></app-loading-spinner>
    } @else if (receipt()) {
      <!-- Gradient Hero Banner -->
      <div class="hero-banner mb-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-xl relative overflow-hidden fade-in">
        <div class="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <mat-icon class="!w-48 !h-48">receipt_long</mat-icon>
        </div>
        <div class="relative z-10 flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <mat-icon class="!w-7 !h-7">receipt</mat-icon>
          </div>
          <div>
            <h2 class="text-xl font-extrabold tracking-tight font-mono">{{ receipt()?.receiptNumber }}</h2>
            <p class="text-sm text-indigo-100 mt-0.5">{{ serviceName() }} &mdash; {{ receipt()?.period }}</p>
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
          <button mat-stroked-button color="primary" [routerLink]="['/receipts', receiptId, 'edit']" class="!rounded-xl !px-4 !py-2">
            <mat-icon class="mr-1">edit</mat-icon>
            Editar
          </button>
          <button mat-stroked-button (click)="deleteReceipt()" class="!rounded-xl !px-4 !py-2 btn-delete">
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
              <div class="section-icon w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <mat-icon>receipt</mat-icon>
              </div>
              <h3 class="section-title text-sm font-bold text-slate-900">Datos del Recibo</h3>
            </div>
            <div class="p-5">
              <div class="info-grid grid grid-cols-1 gap-4">
                <div>
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Estado</p>
                  <span class="badge badge-success">REGISTRADO</span>
                </div>
                <div>
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Servicio</p>
                  <p class="info-value text-sm font-semibold text-slate-900">{{ serviceName() }}</p>
                </div>
                <div>
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Periodo</p>
                  <p class="info-value text-sm text-slate-700 flex items-center gap-1.5">
                    <mat-icon class="!w-4 !h-4 text-slate-400">calendar_month</mat-icon>
                    {{ receipt()?.period }}
                  </p>
                </div>
                <div>
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Registro</p>
                  <p class="info-value text-sm text-slate-500">{{ receipt()?.createdAt }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-6">
          <!-- Financial Summary -->
          <div class="detail-card rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden fade-in">
            <div class="section-header flex items-center gap-3 p-5 border-b border-slate-100">
              <div class="section-icon w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <mat-icon>paid</mat-icon>
              </div>
              <div>
                <h3 class="section-title text-sm font-bold text-slate-900">Resumen Financiero</h3>
                <p class="text-xs text-slate-500">Montos y valores unitarios calculados</p>
              </div>
            </div>
            <div class="p-5">
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="text-center p-5 rounded-xl bg-slate-50 border border-slate-200">
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Monto Total</p>
                  <p class="text-3xl font-extrabold text-slate-900 font-mono">$ {{ receipt()?.totalAmount | number:'1.2-2' }}</p>
                </div>
                <div class="text-center p-5 rounded-xl bg-slate-50 border border-slate-200">
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Consumo Global</p>
                  <p class="text-3xl font-extrabold text-slate-900 font-mono">
                    {{ receipt()?.totalConsumption | number:'1.0-2' }}
                    <span class="text-sm font-normal text-slate-400 ml-1">unidades</span>
                  </p>
                </div>
              </div>

              <div class="p-5 rounded-xl bg-indigo-600 text-white flex items-center justify-between">
                <div class="flex items-center gap-2 font-medium text-sm">
                  <mat-icon>calculate</mat-icon>
                  <span>Valor Unitario Calculado:</span>
                </div>
                <div class="text-2xl font-extrabold font-mono">
                  $ {{ unitValue() | number:'1.4-4' }}
                  <span class="text-sm font-normal opacity-80 ml-1">/ unidad</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Related Settlements -->
          @if (settlements().length > 0) {
            <div class="detail-card rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden fade-in">
              <div class="section-header flex items-center gap-3 p-5 border-b border-slate-100">
                <div class="section-icon w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <mat-icon>payments</mat-icon>
                </div>
                <div>
                  <h3 class="section-title text-sm font-bold text-slate-900">Liquidaciones Asociadas</h3>
                  <p class="text-xs text-slate-500">{{ settlements().length }} liquidaciones generadas</p>
                </div>
              </div>
              <div class="p-5 space-y-3">
                @for (s of settlements(); track s.id) {
                  <a [routerLink]="['/settlements', s.id]" class="settlement-row flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-sm transition-all cursor-pointer">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                        {{ getInitials(s.tenantName) }}
                      </div>
                      <div>
                        <p class="font-semibold text-slate-900 text-sm">{{ s.tenantName }}</p>
                        <p class="text-xs text-slate-500">{{ s.consumption }} unidades</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-extrabold text-slate-900 font-mono">$ {{ (s.finalAmount || s.calculatedAmount) | number:'1.2-2' }}</p>
                      <span [class]="s.status === 'COMPLETED' ? 'badge badge-success' : 'badge badge-neutral'">
                        {{ s.status === 'COMPLETED' ? 'PAGADO' : 'PENDIENTE' }}
                      </span>
                    </div>
                  </a>
                }
              </div>
            </div>
          }
        </div>
      </div>
    } @else {
      <div class="text-center py-20 text-slate-400">
        <mat-icon class="!w-16 !h-16 mb-4">error_outline</mat-icon>
        <p class="text-lg font-semibold">No se encontró el recibo</p>
      </div>
    }
  `,
  styles: [`
    :host { display: block; padding: 24px; max-width: 1400px; margin: 0 auto; }
    .btn-delete { color: #ef4444 !important; border-color: #fecaca !important; }
    .btn-delete:hover { background: #fef2f2 !important; border-color: #ef4444 !important; }
    .badge { display: inline-flex; align-items: center; padding: 2px 10px; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.03em; }
    .badge-success { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
    .badge-neutral { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .fade-in { animation: fadeIn 0.35s ease; }
  `]
})
export class ReceiptDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private receiptApi = inject(ReceiptApiService);
  private serviceApi = inject(ServiceApiService);
  private settlementApi = inject(SettlementApiService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  receiptId = '';
  receipt = signal<Receipt | null>(null);
  serviceName = signal('');
  settlements = signal<Settlement[]>([]);
  loading = signal(true);
  unitValue = signal(0);

  ngOnInit(): void {
    this.receiptId = this.route.snapshot.paramMap.get('id') || '';
    if (this.receiptId) {
      this.loadReceiptDetail();
    } else {
      this.loading.set(false);
    }
  }

  loadReceiptDetail(): void {
    this.loading.set(true);
    this.receiptApi.findById(this.receiptId).subscribe({
      next: (data) => {
        this.receipt.set(data);
        if (data.totalConsumption > 0) this.unitValue.set(data.totalAmount / data.totalConsumption);
        if (data.serviceId) {
          this.serviceApi.findById(data.serviceId).subscribe({
            next: (svc) => this.serviceName.set(svc?.name || 'Servicio'),
            error: () => this.serviceName.set('Servicio')
          });
        }
        this.loadSettlements();
      },
      error: () => { this.receipt.set(null); this.loading.set(false); }
    });
  }

  loadSettlements(): void {
    this.settlementApi.findAll().subscribe({
      next: (all) => { this.settlements.set(all.filter((s: any) => s.receiptId === this.receiptId)); this.loading.set(false); },
      error: () => { this.settlements.set([]); this.loading.set(false); }
    });
  }

  getInitials(name: string): string {
    if (!name) return 'IN';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  }

  goBack(): void { this.router.navigate(['/receipts']); }

  deleteReceipt(): void {
    const r = this.receipt();
    if (!r?.id) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Eliminar Recibo', message: `¿Está seguro de eliminar el recibo "${r.receiptNumber}"? Esta acción no se puede deshacer.`, confirmLabel: 'Eliminar', color: 'warn' } as ConfirmDialogData
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.receiptApi.delete(r.id!).subscribe({
          next: () => { this.snackBar.open('Recibo eliminado', 'OK', { duration: 3000 }); this.router.navigate(['/receipts']); },
          error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }
}
