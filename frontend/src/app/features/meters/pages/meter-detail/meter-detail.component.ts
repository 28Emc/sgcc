import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { MeterApiService, Meter } from '../../services/meter-api.service';
import { ServiceApiService, Service } from '../../../services/services/service-api.service';
import { UnitApiService, Unit } from '../../../units/services/unit-api.service';
import { ReadingApiService, Reading } from '../../../readings/services/reading-api.service';

@Component({
  selector: 'app-meter-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    LoadingSpinnerComponent
  ],
  template: `
    @if (loading()) {
      <app-loading-spinner message="Cargando detalle del medidor..."></app-loading-spinner>
    } @else if (meter()) {
      <!-- Gradient Hero Banner -->
      <div class="hero-banner mb-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-xl relative overflow-hidden fade-in">
        <div class="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <mat-icon class="!w-48 !h-48">speed</mat-icon>
        </div>
        <div class="relative z-10 flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <mat-icon class="!w-7 !h-7">{{ getServiceIcon(service()?.name) }}</mat-icon>
          </div>
          <div>
            <h2 class="text-xl font-extrabold tracking-tight font-mono">{{ meter()?.serialNumber }}</h2>
            <p class="text-sm text-emerald-100 mt-0.5">{{ service()?.name || 'Servicio' }} &mdash; {{ unit()?.name || 'Sin unidad' }}</p>
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
          <button mat-stroked-button color="primary" [routerLink]="['/meters', meterId, 'edit']" class="!rounded-xl !px-4 !py-2">
            <mat-icon class="mr-1">edit</mat-icon>
            <span class="button-text">Editar</span>
          </button>
          <button mat-stroked-button (click)="deleteMeter()" class="!rounded-xl !px-4 !py-2 btn-delete">
            <mat-icon class="mr-1">delete</mat-icon>
            <span class="button-text">Eliminar</span>
          </button>
        </div>
      </div>

      <div class="detail-grid grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Info Card -->
        <div class="lg:col-span-1">
          <div class="detail-card rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden fade-in">
            <div class="section-header flex items-center gap-3 p-5 border-b border-slate-100">
              <div class="section-icon w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <mat-icon>speed</mat-icon>
              </div>
              <h3 class="section-title text-sm font-bold text-slate-900">Datos del Medidor</h3>
            </div>
            <div class="p-5">
              <div class="info-grid grid grid-cols-1 gap-4">
                <div>
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Estado</p>
                  <span [class]="meter()?.status === 'ACTIVE' ? 'badge badge-success' : 'badge badge-danger'">
                    {{ meter()?.status === 'ACTIVE' ? 'OPERATIVO' : 'INACTIVO' }}
                  </span>
                </div>
                <div>
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Servicio</p>
                  <p class="info-value text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                    <mat-icon class="!w-4 !h-4" [style.color]="getServiceColor(service()?.name)">{{ getServiceIcon(service()?.name) }}</mat-icon>
                    {{ service()?.name || '—' }}
                  </p>
                </div>
                <div>
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Unidad Asignada</p>
                  <p class="info-value text-sm text-slate-700 flex items-center gap-1.5">
                    <mat-icon class="!w-4 !h-4 text-slate-400">door_front</mat-icon>
                    {{ unit()?.name || 'Sin asignar' }}
                  </p>
                </div>
                <div>
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Última Lectura</p>
                  @if (lastReading()) {
                    <p class="info-value text-lg font-extrabold text-slate-900 font-mono">
                      {{ lastReading()!.readingValue | number:'1.0-2' }}
                      <span class="text-xs text-slate-400 font-normal ml-1">{{ service()?.measurementUnit || '' }}</span>
                    </p>
                  } @else {
                    <p class="info-value text-sm text-slate-400">Sin lecturas</p>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reading History Card -->
        <div class="lg:col-span-2">
          <div class="detail-card rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden fade-in">
            <div class="section-header flex items-center justify-between p-5 border-b border-slate-100">
              <div class="flex items-center gap-3">
                <div class="section-icon w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <mat-icon>history</mat-icon>
                </div>
                <div>
                  <h3 class="section-title text-sm font-bold text-slate-900">Historial de Lecturas</h3>
                  <p class="text-xs text-slate-500">{{ readings().length }} lecturas registradas</p>
                </div>
              </div>
              <button mat-stroked-button color="primary" routerLink="/readings/new" class="!rounded-xl !text-xs">
                <mat-icon class="!w-4 !h-4 mr-1">add</mat-icon>
                <span class="button-text">Nueva Lectura</span>
              </button>
            </div>
            <div class="p-5 space-y-3">
              @for (reading of readings(); track reading.id) {
                <a [routerLink]="['/readings', reading.id]" class="reading-row flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-emerald-300 hover:bg-emerald-50/30 hover:shadow-sm transition-all cursor-pointer">
                  <div class="flex items-center gap-4">
                    <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <mat-icon class="!w-5 !h-5">speed</mat-icon>
                    </div>
                    <div>
                      <p class="text-xs text-slate-500 font-medium">{{ reading.readingDate }}</p>
                      <p class="font-mono text-sm font-bold text-slate-900">{{ reading.readingValue | number:'1.0-2' }}</p>
                    </div>
                  </div>
                  <mat-icon class="text-slate-300">chevron_right</mat-icon>
                </a>
              } @empty {
                <div class="empty-slot text-center py-10 text-slate-400 text-sm">
                  No hay lecturas registradas para este medidor.
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="text-center py-20 text-slate-400">
        <mat-icon class="!w-16 !h-16 mb-4">error_outline</mat-icon>
        <p class="text-lg font-semibold">No se encontró el medidor</p>
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
    .empty-slot { border: 1px dashed var(--surface-border); border-radius: var(--radius-lg); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .fade-in { animation: fadeIn 0.35s ease; }
  `]
})
export class MeterDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private meterApi = inject(MeterApiService);
  private serviceApi = inject(ServiceApiService);
  private unitApi = inject(UnitApiService);
  private readingApi = inject(ReadingApiService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  meterId = '';
  meter = signal<Meter | null>(null);
  service = signal<Service | null>(null);
  unit = signal<Unit | null>(null);
  readings = signal<Reading[]>([]);
  lastReading = signal<any | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.meterId = this.route.snapshot.paramMap.get('id') || '';
    if (this.meterId) {
      this.loadMeterDetail();
    } else {
      this.loading.set(false);
    }
  }

  loadMeterDetail(): void {
    this.loading.set(true);
    this.meterApi.findById(this.meterId).subscribe({
      next: (data) => {
        this.meter.set(data);
        if (data.serviceId) {
          this.serviceApi.findById(data.serviceId).subscribe({
            next: (svc) => this.service.set(svc),
            error: () => this.service.set(null)
          });
        }
        if (data.unitId) {
          this.unitApi.findById(data.unitId).subscribe({
            next: (u) => this.unit.set(u),
            error: () => this.unit.set(null)
          });
        }
        this.loadReadings();
      },
      error: () => { this.meter.set(null); this.loading.set(false); }
    });
  }

  private loadReadings(): void {
    this.readingApi.findAll().subscribe({
      next: (allReadings) => {
        const meterReadings = allReadings
          .filter((r: any) => r.meterId === this.meterId)
          .sort((a: any, b: any) => (b.readingDate || '').localeCompare(a.readingDate || ''));
        this.readings.set(meterReadings);
        if (meterReadings.length > 0) this.lastReading.set(meterReadings[0]);
        this.loading.set(false);
      },
      error: () => { this.readings.set([]); this.loading.set(false); }
    });
  }

  getServiceIcon(name?: string): string {
    const n = (name || '').toLowerCase();
    if (n.includes('electricidad') || n.includes('electr')) return 'bolt';
    if (n.includes('agua')) return 'water_drop';
    if (n.includes('gas')) return 'local_fire_department';
    return 'speed';
  }

  getServiceColor(name?: string): string {
    const n = (name || '').toLowerCase();
    if (n.includes('electricidad') || n.includes('electr')) return '#d97706';
    if (n.includes('agua')) return '#2563eb';
    if (n.includes('gas')) return '#ea580c';
    return '#059669';
  }

  goBack(): void { this.router.navigate(['/meters']); }

  deleteMeter(): void {
    const m = this.meter();
    if (!m?.id) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Eliminar Medidor', message: `¿Está seguro de eliminar el medidor "${m.serialNumber}"? Esta acción no se puede deshacer.`, confirmLabel: 'Eliminar', color: 'warn' } as ConfirmDialogData
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.meterApi.delete(m.id!).subscribe({
          next: () => { this.snackBar.open('Medidor eliminado', 'OK', { duration: 3000 }); this.router.navigate(['/meters']); },
          error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }
}
