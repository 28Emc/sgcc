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
import { ReadingApiService, Reading } from '../../services/reading-api.service';
import { MeterApiService, Meter } from '../../../meters/services/meter-api.service';

@Component({
  selector: 'app-reading-detail',
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
      <app-loading-spinner message="Cargando detalle de la lectura..."></app-loading-spinner>
    } @else if (reading()) {
      <!-- Gradient Hero Banner -->
      <div class="hero-banner mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-xl relative overflow-hidden fade-in">
        <div class="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <mat-icon class="!w-48 !h-48">edit_note</mat-icon>
        </div>
        <div class="relative z-10 flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <mat-icon class="!w-7 !h-7">speed</mat-icon>
          </div>
          <div>
            <h2 class="text-xl font-extrabold tracking-tight">Lectura de Medidor</h2>
            <p class="text-sm text-blue-100 mt-0.5">Medidor {{ meter()?.serialNumber || '—' }} &mdash; {{ reading()?.readingDate }}</p>
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
          <button mat-stroked-button color="primary" [routerLink]="['/readings', readingId, 'edit']" class="!rounded-xl !px-4 !py-2">
            <mat-icon class="mr-1">edit</mat-icon>
            Editar
          </button>
          <button mat-stroked-button (click)="deleteReading()" class="!rounded-xl !px-4 !py-2 btn-delete">
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
              <div class="section-icon w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <mat-icon>edit_note</mat-icon>
              </div>
              <h3 class="section-title text-sm font-bold text-slate-900">Datos de la Lectura</h3>
            </div>
            <div class="p-5">
              <div class="info-grid grid grid-cols-1 gap-4">
                <div>
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Estado</p>
                  <span class="badge badge-success">REGISTRADA</span>
                </div>
                <div>
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Medidor</p>
                  <p class="info-value text-sm font-mono font-semibold text-slate-900 flex items-center gap-1.5">
                    <mat-icon class="!w-4 !h-4 text-slate-400">speed</mat-icon>
                    {{ meter()?.serialNumber || '—' }}
                  </p>
                </div>
                <div>
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Fecha de Toma</p>
                  <p class="info-value text-sm text-slate-700">{{ reading()?.readingDate }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reading Comparison -->
        <div class="lg:col-span-2">
          <div class="detail-card rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden fade-in">
            <div class="section-header flex items-center gap-3 p-5 border-b border-slate-100">
              <div class="section-icon w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <mat-icon>compare_arrows</mat-icon>
              </div>
              <div>
                <h3 class="section-title text-sm font-bold text-slate-900">Comparación de Lecturas</h3>
                <p class="text-xs text-slate-500">Valores anterior vs. actual del medidor</p>
              </div>
            </div>
            <div class="p-5">
              <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="text-center p-5 rounded-xl bg-slate-50 border border-slate-200">
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Lectura Anterior</p>
                  <p class="text-2xl font-extrabold text-slate-500 font-mono">
                    {{ previousValue() != null ? (previousValue()! | number:'1.0-2') : '—' }}
                  </p>
                </div>
                <div class="flex items-center justify-center">
                  <mat-icon class="!w-10 !h-10 text-blue-400">arrow_forward</mat-icon>
                </div>
                <div class="text-center p-5 rounded-xl bg-blue-50 border border-blue-200">
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-blue-500 mb-2">Lectura Actual</p>
                  <p class="text-2xl font-extrabold text-blue-700 font-mono">
                    {{ reading()?.readingValue != null ? (reading()!.readingValue | number:'1.0-2') : '—' }}
                  </p>
                </div>
              </div>

              <div class="p-5 rounded-xl bg-blue-600 text-white flex items-center justify-between">
                <div class="flex items-center gap-2 font-medium text-sm">
                  <mat-icon>bolt</mat-icon>
                  <span>Consumo Neto Generado:</span>
                </div>
                <div class="text-2xl font-extrabold font-mono">
                  +{{ netConsumption() | number:'1.0-2' }}
                  <span class="text-sm font-normal opacity-80 ml-1">{{ meterServiceUnit() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="text-center py-20 text-slate-400">
        <mat-icon class="!w-16 !h-16 mb-4">error_outline</mat-icon>
        <p class="text-lg font-semibold">No se encontró la lectura</p>
      </div>
    }
  `,
  styles: [`
    :host { display: block; padding: 24px; max-width: 1400px; margin: 0 auto; }
    .btn-delete { color: #ef4444 !important; border-color: #fecaca !important; }
    .btn-delete:hover { background: #fef2f2 !important; border-color: #ef4444 !important; }
    .badge { display: inline-flex; align-items: center; padding: 2px 10px; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.03em; }
    .badge-success { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .fade-in { animation: fadeIn 0.35s ease; }
  `]
})
export class ReadingDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private readingApi = inject(ReadingApiService);
  private meterApi = inject(MeterApiService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  readingId = '';
  reading = signal<Reading | null>(null);
  meter = signal<Meter | null>(null);
  previousValue = signal<number | null>(null);
  meterServiceUnit = signal('');
  loading = signal(true);

  ngOnInit(): void {
    this.readingId = this.route.snapshot.paramMap.get('id') || '';
    if (this.readingId) {
      this.loadReadingDetail();
    } else {
      this.loading.set(false);
    }
  }

  loadReadingDetail(): void {
    this.loading.set(true);
    this.readingApi.findById(this.readingId).subscribe({
      next: (data) => {
        this.reading.set(data);
        if (data.meterId) {
          this.meterApi.findById(data.meterId).subscribe({
            next: (m) => { this.meter.set(m); this.meterServiceUnit.set((m as any)?.measurementUnit || ''); },
            error: () => this.meter.set(null)
          });
        }
        this.loadPreviousReading(data.meterId, data.readingDate);
      },
      error: () => { this.reading.set(null); this.loading.set(false); }
    });
  }

  private loadPreviousReading(meterId: string, currentDate: string): void {
    this.readingApi.findAll().subscribe({
      next: (allReadings) => {
        const previous = allReadings
          .filter((r: any) => r.meterId === meterId && r.readingDate < currentDate)
          .sort((a: any, b: any) => (b.readingDate || '').localeCompare(a.readingDate || ''));
        this.previousValue.set(previous.length > 0 ? previous[0].readingValue : 0);
        this.loading.set(false);
      },
      error: () => { this.previousValue.set(0); this.loading.set(false); }
    });
  }

  netConsumption(): number {
    return (this.reading()?.readingValue || 0) - (this.previousValue() || 0);
  }

  goBack(): void { this.router.navigate(['/readings']); }

  deleteReading(): void {
    const r = this.reading();
    if (!r?.id) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Eliminar Lectura', message: `¿Está seguro de eliminar esta lectura? Esta acción no se puede deshacer.`, confirmLabel: 'Eliminar', color: 'warn' } as ConfirmDialogData
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.readingApi.delete(r.id!).subscribe({
          next: () => { this.snackBar.open('Lectura eliminada', 'OK', { duration: 3000 }); this.router.navigate(['/readings']); },
          error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }
}
