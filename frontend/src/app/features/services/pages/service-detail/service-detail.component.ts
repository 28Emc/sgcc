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
import { ServiceApiService, Service } from '../../services/service-api.service';

@Component({
  selector: 'app-service-detail',
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
      [title]="service()?.name || 'Detalle del Servicio'"
      subtitle="Información completa del servicio">
      <div class="flex gap-2">
        <button mat-stroked-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          Volver
        </button>
        <button mat-stroked-button color="primary" [routerLink]="[service()?.id, 'edit']">
          <mat-icon>edit</mat-icon>
          Editar
        </button>
        <button mat-stroked-button color="warn" (click)="deleteService()">
          <mat-icon>delete</mat-icon>
          Eliminar
        </button>
      </div>
    </app-page-header>

    @if (loading()) {
      <app-loading-spinner message="Cargando información del servicio..."></app-loading-spinner>
    } @else if (service()) {
      <div class="grid grid-cols-1 gap-5">
        <!-- Service Overview -->
        <div class="detail-card">
          <div class="detail-card-header">
            <mat-icon class="detail-card-icon">build</mat-icon>
            <h3 class="detail-card-title">Información General</h3>
          </div>
          <div class="detail-card-body">
            <div class="info-row">
              <span class="info-label">Nombre del Servicio</span>
              <span class="info-value font-semibold">{{ service()!.name }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Unidad de Medida</span>
              <span class="info-value">
                <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <mat-icon class="!w-3.5 !h-3.5 text-emerald-500">straighten</mat-icon>
                  {{ service()!.measurementUnit }}
                </span>
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">Estado</span>
              <span class="info-value">
                <span [class]="service()!.status === 'ACTIVE' || !service()!.status ? 'status-badge status-badge-active' : 'status-badge status-badge-inactive'">
                  {{ service()!.status === 'ACTIVE' || !service()!.status ? 'ACTIVO' : 'INACTIVO' }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ServiceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private serviceApi = inject(ServiceApiService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  service = signal<Service | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.serviceApi.findById(id).subscribe({
        next: (data) => {
          this.service.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.snackBar.open('Servicio no encontrado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/services']);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/services']);
  }

  deleteService(): void {
    const svc = this.service();
    if (!svc?.id) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Servicio',
        message: `¿Está seguro de eliminar el servicio "${svc.name}"? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        color: 'warn'
      } as ConfirmDialogData
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && svc.id) {
        this.serviceApi.delete(svc.id).subscribe({
          next: () => {
            this.snackBar.open('Servicio eliminado', 'OK', { duration: 3000 });
            this.router.navigate(['/services']);
          },
          error: () => this.snackBar.open('Error al eliminar el servicio', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }
}
