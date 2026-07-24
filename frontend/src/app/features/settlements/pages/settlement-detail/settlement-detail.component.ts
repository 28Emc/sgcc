import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { SettlementApiService, Settlement } from '../../services/settlement-api.service';

@Component({
  selector: 'app-settlement-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    PageHeaderComponent,
    LoadingSpinnerComponent
  ],
  template: `
    @if (loading()) {
      <app-loading-spinner message="Cargando liquidación..."></app-loading-spinner>
    } @else if (settlement()) {
      <!-- Gradient Hero Banner -->
      <div class="hero-banner mb-8 p-6 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white shadow-xl relative overflow-hidden fade-in">
        <div class="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <mat-icon class="!w-48 !h-48">payments</mat-icon>
        </div>
        <div class="relative z-10 flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <mat-icon class="!w-7 !h-7">payments</mat-icon>
          </div>
          <div>
            <h2 class="text-xl font-extrabold tracking-tight">{{ settlement()?.tenantName || 'Inquilino' }}</h2>
            <p class="text-sm text-amber-100 mt-0.5">Recibo {{ settlement()?.receiptNumber || 'N/A' }} &mdash; {{ settlement()?.period }}</p>
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
          <span [class]="settlement()?.status === 'COMPLETED' ? 'badge badge-success' : 'badge badge-neutral'">
            {{ settlement()?.status === 'COMPLETED' ? 'PAGADO' : 'PENDIENTE' }}
          </span>
        </div>
      </div>

      <div class="detail-grid grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Info Card -->
        <div class="lg:col-span-1">
          <div class="detail-card rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden fade-in">
            <div class="section-header flex items-center gap-3 p-5 border-b border-slate-100">
              <div class="section-icon w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <mat-icon>info</mat-icon>
              </div>
              <h3 class="section-title text-sm font-bold text-slate-900">Información General</h3>
            </div>
            <div class="p-5">
              <div class="info-grid grid grid-cols-1 gap-4">
                <div>
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Recibo</p>
                  <p class="info-value text-sm font-semibold text-slate-900">{{ settlement()?.receiptNumber || 'N/A' }}</p>
                </div>
                <div>
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Periodo</p>
                  <p class="info-value text-sm text-slate-700 flex items-center gap-1.5">
                    <mat-icon class="!w-4 !h-4 text-slate-400">calendar_month</mat-icon>
                    {{ settlement()?.period || 'N/A' }}
                  </p>
                </div>
                <div>
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">ID Liquidación</p>
                  <p class="info-value text-xs font-mono text-slate-500">{{ settlement()?.id }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Financial Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Calculation Breakdown -->
          <div class="detail-card rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden fade-in">
            <div class="section-header flex items-center gap-3 p-5 border-b border-slate-100">
              <div class="section-icon w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <mat-icon>calculate</mat-icon>
              </div>
              <div>
                <h3 class="section-title text-sm font-bold text-slate-900">Desglose del Cálculo</h3>
                <p class="text-xs text-slate-500">Consumo &times; Valor Unitario = Monto Calculado</p>
              </div>
            </div>
            <div class="p-5">
              <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="text-center p-5 rounded-xl bg-slate-50 border border-slate-200">
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Consumo</p>
                  <p class="text-2xl font-extrabold text-slate-900 font-mono">{{ settlement()?.consumption | number:'1.0-3' }}</p>
                  <p class="text-xs text-slate-500 mt-0.5">unidades</p>
                </div>
                <div class="text-center p-5 rounded-xl bg-slate-50 border border-slate-200">
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Valor Unitario</p>
                  <p class="text-2xl font-extrabold text-amber-600 font-mono">$ {{ settlement()?.unitValue | number:'1.4-4' }}</p>
                  <p class="text-xs text-slate-500 mt-0.5">/ unidad</p>
                </div>
                <div class="text-center p-5 rounded-xl bg-slate-50 border border-slate-200">
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Monto Calculado</p>
                  <p class="text-2xl font-extrabold text-slate-900 font-mono">$ {{ settlement()?.calculatedAmount | number:'1.2-2' }}</p>
                  <p class="text-xs text-slate-500 mt-0.5">subtotal</p>
                </div>
              </div>

              @if (settlement()?.adjustmentAmount && settlement()?.adjustmentAmount !== 0) {
                <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-4">
                  <div class="flex items-center gap-2 mb-2">
                    <mat-icon class="!w-4 !h-4 text-amber-600">tune</mat-icon>
                    <span class="text-sm font-bold text-amber-800">Ajuste Aplicado</span>
                  </div>
                  <p class="text-lg font-bold text-amber-700 font-mono">$ {{ settlement()?.adjustmentAmount | number:'1.2-2' }}</p>
                </div>
              }

              <div class="p-5 rounded-xl bg-amber-600 text-white flex items-center justify-between">
                <div class="flex items-center gap-2 font-medium text-sm">
                  <mat-icon>payments</mat-icon>
                  <span>Total a Pagar:</span>
                </div>
                <div class="text-3xl font-extrabold font-mono">
                  $ {{ (settlement()?.finalAmount || settlement()?.calculatedAmount) | number:'1.2-2' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Adjustment Section -->
          @if (settlement()?.status !== 'COMPLETED') {
            <div class="detail-card rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden fade-in">
              <div class="section-header flex items-center gap-3 p-5 border-b border-slate-100">
                <div class="section-icon w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <mat-icon>tune</mat-icon>
                </div>
                <div>
                  <h3 class="section-title text-sm font-bold text-slate-900">Aplicar Ajuste</h3>
                  <p class="text-xs text-slate-500">Ajustar el monto manualmente (positivo o negativo)</p>
                </div>
              </div>
              <div class="p-5">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Monto del Ajuste ($)</mat-label>
                    <input matInput type="number" [(ngModel)]="adjustmentAmount" placeholder="0.00" class="font-mono">
                    <span matPrefix class="mr-1 text-slate-500 font-bold">$</span>
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="w-full md:col-span-2">
                    <mat-label>Motivo del Ajuste</mat-label>
                    <input matInput [(ngModel)]="adjustmentReason" placeholder="ej. Ajuste por medición incorrecta">
                  </mat-form-field>
                </div>
                <button mat-raised-button color="primary" (click)="applyAdjustment()" [disabled]="!adjustmentAmount || !adjustmentReason || adjusting()" class="!rounded-xl">
                  @if (adjusting()) {
                    <mat-icon class="animate-spin mr-1">sync</mat-icon> Aplicando...
                  } @else {
                    <mat-icon class="mr-1">tune</mat-icon> Aplicar Ajuste
                  }
                </button>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-3 mt-4">
              <button mat-raised-button color="accent" (click)="completeSettlement()" [disabled]="completing()" class="!rounded-xl">
                @if (completing()) {
                  <mat-icon class="animate-spin mr-1">sync</mat-icon> Procesando...
                } @else {
                  <mat-icon class="mr-1">check_circle</mat-icon> Marcar como Completado
                }
              </button>
              <button mat-stroked-button color="warn" (click)="deleteSettlement()" class="!rounded-xl">
                <mat-icon class="mr-1">delete</mat-icon> Eliminar
              </button>
            </div>
          }
        </div>
      </div>
    } @else {
      <div class="text-center py-20 text-slate-400">
        <mat-icon class="!w-16 !h-16 mb-4">error_outline</mat-icon>
        <p class="text-lg font-semibold">No se encontró la liquidación</p>
      </div>
    }
  `,
  styles: [`
    :host { display: block; padding: 24px; max-width: 1400px; margin: 0 auto; }
    .badge { display: inline-flex; align-items: center; padding: 2px 10px; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.03em; }
    .badge-success { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
    .badge-neutral { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .fade-in { animation: fadeIn 0.35s ease; }
  `]
})
export class SettlementDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private settlementApi = inject(SettlementApiService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  settlement = signal<Settlement | null>(null);
  loading = signal(true);
  adjusting = signal(false);
  completing = signal(false);
  adjustmentAmount = 0;
  adjustmentReason = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSettlement(id);
    } else {
      this.loading.set(false);
    }
  }

  loadSettlement(id: string): void {
    this.loading.set(true);
    this.settlementApi.findById(id).subscribe({
      next: (data) => { this.settlement.set(data); this.loading.set(false); },
      error: () => { this.loading.set(false); this.snackBar.open('Error al cargar la liquidación', 'Cerrar', { duration: 3000 }); }
    });
  }

  applyAdjustment(): void {
    const s = this.settlement();
    if (!s?.id || !this.adjustmentAmount || !this.adjustmentReason) return;
    this.adjusting.set(true);
    this.settlementApi.applyAdjustment(s.id, this.adjustmentAmount, this.adjustmentReason).subscribe({
      next: (updated) => {
        this.settlement.set(updated);
        this.adjusting.set(false);
        this.adjustmentAmount = 0;
        this.adjustmentReason = '';
        this.snackBar.open('Ajuste aplicado exitosamente', 'OK', { duration: 3000 });
      },
      error: () => { this.adjusting.set(false); this.snackBar.open('Error al aplicar el ajuste', 'Cerrar', { duration: 3000 }); }
    });
  }

  completeSettlement(): void {
    const s = this.settlement();
    if (!s?.id) return;
    this.completing.set(true);
    this.settlementApi.complete(s.id).subscribe({
      next: (updated) => {
        this.settlement.set(updated);
        this.completing.set(false);
        this.snackBar.open('Liquidación completada exitosamente', 'OK', { duration: 3000 });
      },
      error: () => { this.completing.set(false); this.snackBar.open('Error al completar la liquidación', 'Cerrar', { duration: 3000 }); }
    });
  }

  deleteSettlement(): void {
    const s = this.settlement();
    if (!s?.id) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Eliminar Liquidación', message: '¿Está seguro de eliminar esta liquidación? Esta acción no se puede deshacer.', confirmLabel: 'Eliminar', color: 'warn' } as ConfirmDialogData
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.settlementApi.delete(s.id!).subscribe({
          next: () => { this.snackBar.open('Liquidación eliminada', 'OK', { duration: 3000 }); this.router.navigate(['/settlements']); },
          error: () => this.snackBar.open('Error al eliminar la liquidación', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }

  goBack(): void { this.router.navigate(['/settlements']); }
}
