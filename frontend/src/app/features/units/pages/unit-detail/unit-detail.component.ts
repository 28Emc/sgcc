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
import { UnitApiService, Unit } from '../../services/unit-api.service';

@Component({
  selector: 'app-unit-detail',
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
      [title]="unit()?.name || 'Detalle de Unidad'"
      subtitle="Información completa de la unidad">
      <div class="flex gap-2">
        <button mat-stroked-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          Volver
        </button>
        <button mat-stroked-button color="primary" [routerLink]="[unit()?.id, 'edit']">
          <mat-icon>edit</mat-icon>
          Editar
        </button>
        <button mat-stroked-button color="warn" (click)="deleteUnit()">
          <mat-icon>delete</mat-icon>
          Eliminar
        </button>
      </div>
    </app-page-header>

    @if (loading()) {
      <app-loading-spinner message="Cargando información de la unidad..."></app-loading-spinner>
    } @else if (unit()) {
      <div class="grid grid-cols-1 gap-5">
        <!-- Unit Overview -->
        <div class="detail-card">
          <div class="detail-card-header">
            <mat-icon class="detail-card-icon">home</mat-icon>
            <h3 class="detail-card-title">Información General</h3>
          </div>
          <div class="detail-card-body">
            <div class="info-row">
              <span class="info-label">Nombre de la Unidad</span>
              <span class="info-value font-semibold">{{ unit()!.name }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Descripción</span>
              <span class="info-value">{{ unit()!.description || 'Sin descripción' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Propiedad</span>
              <span class="info-value">
                <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                  <mat-icon class="!w-3.5 !h-3.5 text-blue-500">apartment</mat-icon>
                  {{ unit()!.propertyName || 'Sin propiedad' }}
                </span>
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">Estado</span>
              <span class="info-value">
                <span [class]="unit()!.status === 'ACTIVE' || !unit()!.status ? 'status-badge status-badge-active' : 'status-badge status-badge-inactive'">
                  {{ unit()!.status === 'ACTIVE' || !unit()!.status ? 'ACTIVO' : 'INACTIVO' }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class UnitDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private unitApi = inject(UnitApiService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  unit = signal<Unit | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.unitApi.findById(id).subscribe({
        next: (data) => {
          this.unit.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.snackBar.open('Unidad no encontrada', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/units']);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/units']);
  }

  deleteUnit(): void {
    const unit = this.unit();
    if (!unit?.id) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Unidad',
        message: `¿Está seguro de eliminar la unidad "${unit.name}"? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        color: 'warn'
      } as ConfirmDialogData
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && unit.id) {
        this.unitApi.delete(unit.id).subscribe({
          next: () => {
            this.snackBar.open('Unidad eliminada', 'OK', { duration: 3000 });
            this.router.navigate(['/units']);
          },
          error: () => this.snackBar.open('Error al eliminar la unidad', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }
}
