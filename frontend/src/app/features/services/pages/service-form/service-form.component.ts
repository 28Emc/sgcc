import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ServiceApiService, Service } from '../../services/service-api.service';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    PageHeaderComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <app-page-header
      [title]="isEdit() ? 'Editar Servicio' : 'Registrar Nuevo Servicio'"
      subtitle="Complete la información del servicio">
      <button mat-stroked-button (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
        Volver
      </button>
    </app-page-header>

    @if (loading()) {
      <app-loading-spinner message="Cargando datos del servicio..."></app-loading-spinner>
    } @else {
      <div class="grid grid-cols-1 gap-5">
        <!-- Form Card -->
        <div class="detail-card">
          <div class="detail-card-header">
            <mat-icon class="detail-card-icon">build</mat-icon>
            <h3 class="detail-card-title">Datos del Servicio</h3>
          </div>
          <div class="detail-card-body">
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Nombre del Servicio</mat-label>
                <input matInput formControlName="name" placeholder="Ej: Agua, Luz, Internet">
                <mat-icon matSuffix>build</mat-icon>
                @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
                  <mat-error>El nombre es requerido</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Unidad de Medida</mat-label>
                <input matInput formControlName="measurementUnit" placeholder="Ej: m³, kWh, MB">
                <mat-icon matSuffix>straighten</mat-icon>
                @if (form.get('measurementUnit')?.hasError('required') && form.get('measurementUnit')?.touched) {
                  <mat-error>La unidad de medida es requerida</mat-error>
                }
              </mat-form-field>

              <!-- Preview Card -->
              <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                <div class="flex items-center gap-2 mb-2">
                  <mat-icon class="!w-5 !h-5 text-emerald-600">visibility</mat-icon>
                  <span class="text-sm font-semibold text-emerald-800">Vista Previa</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center">
                    <mat-icon class="!w-5 !h-5">build</mat-icon>
                  </div>
                  <div>
                    <p class="font-semibold text-slate-900">{{ form.get('name')?.value || 'Nombre del servicio' }}</p>
                    <p class="text-xs text-slate-500">{{ form.get('measurementUnit')?.value || 'Unidad de medida' }}</p>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button mat-stroked-button type="button" (click)="goBack()">
                  Cancelar
                </button>
                <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving()">
                  <mat-icon class="mr-1">{{ isEdit() ? 'save' : 'add' }}</mat-icon>
                  {{ isEdit() ? 'Guardar Cambios' : 'Registrar Servicio' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `
})
export class ServiceFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private serviceApi = inject(ServiceApiService);
  private snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    measurementUnit: ['', Validators.required]
  });

  isEdit = signal(false);
  loading = signal(false);
  saving = signal(false);
  private serviceId = '';

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('id') || '';
    if (this.serviceId) {
      this.isEdit.set(true);
      this.loading.set(true);
      this.serviceApi.findById(this.serviceId).subscribe({
        next: (service) => {
          this.form.patchValue({
            name: service.name,
            measurementUnit: service.measurementUnit
          });
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

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);

    const serviceData: Service = this.form.value;

    const request = this.isEdit()
      ? this.serviceApi.update(this.serviceId, serviceData)
      : this.serviceApi.create(serviceData);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit() ? 'Servicio actualizado' : 'Servicio registrado',
          'OK',
          { duration: 3000 }
        );
        this.router.navigate(['/services']);
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open('Error al guardar el servicio', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
