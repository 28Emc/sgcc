import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { OccupancyApiService, Occupancy } from '../../services/occupancy-api.service';

@Component({
  selector: 'app-occupancy-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    PageHeaderComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <app-page-header
      [title]="'Detalle de Ocupación'"
      subtitle="Información completa del contrato de alquiler">
      <div class="flex gap-2">
        <button mat-stroked-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          Volver
        </button>
        <button mat-stroked-button color="primary" [routerLink]="[occupancy()?.id, 'edit']">
          <mat-icon>edit</mat-icon>
          Editar
        </button>
        <button mat-stroked-button color="warn" (click)="deleteOccupancy()">
          <mat-icon>delete</mat-icon>
          Eliminar
        </button>
      </div>
    </app-page-header>

    @if (loading()) {
      <app-loading-spinner message="Cargando información de la ocupación..."></app-loading-spinner>
    } @else if (occupancy()) {
      <div class="grid grid-cols-1 gap-5">
        <!-- Occupancy Overview -->
        <div class="detail-card">
          <div class="detail-card-header">
            <mat-icon class="detail-card-icon">key</mat-icon>
            <h3 class="detail-card-title">Información del Contrato</h3>
          </div>
          <div class="detail-card-body">
            <div class="info-row">
              <span class="info-label">Inquilino</span>
              <span class="info-value">
                <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 border border-violet-100">
                  <mat-icon class="!w-3.5 !h-3.5 text-violet-500">person</mat-icon>
                  {{ occupancy()!.tenantName || 'Sin inquilino' }}
                </span>
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">Unidad</span>
              <span class="info-value">
                <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                  <mat-icon class="!w-3.5 !h-3.5 text-blue-500">home</mat-icon>
                  {{ occupancy()!.unitName || 'Sin unidad' }}
                </span>
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">Fecha de Inicio</span>
              <span class="info-value font-semibold">{{ occupancy()!.startDate }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Fecha de Fin</span>
              <span class="info-value">{{ occupancy()!.endDate || 'Contrato activo' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Estado</span>
              <span class="info-value">
                <span [class]="occupancy()!.status === 'ACTIVE' || !occupancy()!.status ? 'status-badge status-badge-active' : 'status-badge status-badge-inactive'">
                  {{ occupancy()!.status === 'ACTIVE' || !occupancy()!.status ? 'ACTIVA' : 'INACTIVA' }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class OccupancyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private occupancyApi = inject(OccupancyApiService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  occupancy = signal<Occupancy | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.occupancyApi.findById(id).subscribe({
        next: (data) => {
          this.occupancy.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.snackBar.open('Ocupación no encontrada', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/occupancies']);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/occupancies']);
  }

  deleteOccupancy(): void {
    const occ = this.occupancy();
    if (!occ?.id) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Ocupación',
        message: `¿Está seguro de eliminar esta ocupación? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        color: 'warn'
      } as ConfirmDialogData
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && occ.id) {
        this.occupancyApi.delete(occ.id).subscribe({
          next: () => {
            this.snackBar.open('Ocupación eliminada', 'OK', { duration: 3000 });
            this.router.navigate(['/occupancies']);
          },
          error: () => this.snackBar.open('Error al eliminar la ocupación', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }
}
