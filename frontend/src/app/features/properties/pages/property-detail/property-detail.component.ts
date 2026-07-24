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
import { PropertyApiService, Property } from '../../services/property-api.service';
import { UnitApiService, Unit } from '../../../units/services/unit-api.service';

@Component({
  selector: 'app-property-detail',
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
      <app-loading-spinner message="Cargando detalle de la propiedad..."></app-loading-spinner>
    } @else if (property()) {
      <!-- Gradient Hero Banner -->
      <div class="hero-banner mb-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-xl relative overflow-hidden fade-in">
        <div class="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <mat-icon class="!w-48 !h-48">apartment</mat-icon>
        </div>
        <div class="relative z-10 flex items-center gap-4">
          <div class="hero-icon w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <mat-icon class="!w-7 !h-7">apartment</mat-icon>
          </div>
          <div>
            <h2 class="text-xl font-extrabold tracking-tight">{{ property()?.name }}</h2>
            <p class="text-sm text-indigo-100 mt-0.5">{{ property()?.address }}</p>
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
          <button mat-stroked-button color="primary" [routerLink]="['/properties', propertyId, 'edit']" class="!rounded-xl !px-4 !py-2">
            <mat-icon class="mr-1">edit</mat-icon>
            Editar
          </button>
          <button mat-stroked-button (click)="deleteProperty()" class="!rounded-xl !px-4 !py-2 btn-delete">
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
                <mat-icon>info</mat-icon>
              </div>
              <h3 class="section-title text-sm font-bold text-slate-900">Información General</h3>
            </div>
            <div class="p-5">
              <div class="info-grid grid grid-cols-1 gap-4">
                <div>
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Estado</p>
                  <span [class]="property()?.status === 'ACTIVE' ? 'badge badge-success' : 'badge badge-danger'">
                    {{ property()?.status === 'ACTIVE' ? 'ACTIVO' : 'INACTIVO' }}
                  </span>
                </div>
                <div>
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Dirección</p>
                  <p class="info-value text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                    <mat-icon class="!w-4 !h-4 text-slate-400">location_on</mat-icon>
                    {{ property()?.address }}
                  </p>
                </div>
                <div>
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Descripción</p>
                  <p class="info-value text-sm text-slate-700">{{ property()?.description || 'Sin descripción' }}</p>
                </div>
                <div>
                  <p class="info-label text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total Unidades</p>
                  <p class="info-value text-sm font-bold text-slate-900">{{ units().length }} unidades</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Units List -->
        <div class="lg:col-span-2">
          <div class="detail-card rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden fade-in">
            <div class="section-header flex items-center justify-between p-5 border-b border-slate-100">
              <div class="flex items-center gap-3">
                <div class="section-icon w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <mat-icon>home</mat-icon>
                </div>
                <div>
                  <h3 class="section-title text-sm font-bold text-slate-900">Unidades Asociadas</h3>
                  <p class="text-xs text-slate-500">{{ units().length }} departamentos o locales</p>
                </div>
              </div>
            </div>
            <div class="p-5">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @for (unit of units(); track unit.id) {
                  <div class="unit-card p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:shadow-sm transition-all">
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-bold text-slate-900 text-sm">{{ unit.name }}</span>
                      <span [class]="unit.status === 'ACTIVE' ? 'badge badge-success' : 'badge badge-neutral'">
                        {{ unit.status === 'ACTIVE' ? 'ACTIVA' : 'INACTIVA' }}
                      </span>
                    </div>
                    @if (unit.description) {
                      <p class="text-xs text-slate-500">{{ unit.description }}</p>
                    }
                  </div>
                } @empty {
                  <div class="col-span-2 empty-slot text-center py-10 text-slate-400 text-sm">
                    No hay unidades registradas para esta propiedad.
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="text-center py-20 text-slate-400">
        <mat-icon class="!w-16 !h-16 mb-4">error_outline</mat-icon>
        <p class="text-lg font-semibold">No se encontró la propiedad</p>
      </div>
    }
  `,
  styles: [`
    :host { display: block; padding: 24px; max-width: 1400px; margin: 0 auto; }
    .hero-icon { width: 56px; height: 56px; }
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
export class PropertyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private propertyApi = inject(PropertyApiService);
  private unitApi = inject(UnitApiService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  propertyId = '';
  property = signal<Property | null>(null);
  units = signal<Unit[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.propertyId = this.route.snapshot.paramMap.get('id') || '';
    if (this.propertyId) {
      this.loadPropertyDetail();
    } else {
      this.loading.set(false);
    }
  }

  loadPropertyDetail(): void {
    this.loading.set(true);
    this.propertyApi.findById(this.propertyId).subscribe({
      next: (data) => {
        this.property.set(data);
        this.loadUnits();
      },
      error: () => { this.property.set(null); this.loading.set(false); }
    });
  }

  private loadUnits(): void {
    this.unitApi.findByPropertyId(this.propertyId).subscribe({
      next: (data) => { this.units.set(data || []); this.loading.set(false); },
      error: () => { this.units.set([]); this.loading.set(false); }
    });
  }

  goBack(): void { this.router.navigate(['/properties']); }

  deleteProperty(): void {
    const p = this.property();
    if (!p?.id) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Eliminar Propiedad', message: `¿Está seguro de eliminar "${p.name}"? Esta acción no se puede deshacer.`, confirmLabel: 'Eliminar', color: 'warn' } as ConfirmDialogData
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.propertyApi.delete(p.id!).subscribe({
          next: () => { this.snackBar.open('Propiedad eliminada', 'OK', { duration: 3000 }); this.router.navigate(['/properties']); },
          error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }
}
