import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { OccupancyApiService, Occupancy } from '../../services/occupancy-api.service';
import { TenantApiService, Tenant } from '../../../tenants/services/tenant-api.service';
import { UnitApiService, Unit } from '../../../units/services/unit-api.service';

@Component({
  selector: 'app-occupancy-form',
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
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    PageHeaderComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <app-page-header
      [title]="isEdit() ? 'Editar Ocupación' : 'Registrar Nueva Ocupación'"
      subtitle="Complete la información del contrato de alquiler">
      <button mat-stroked-button (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
        Volver
      </button>
    </app-page-header>

    @if (loading()) {
      <app-loading-spinner message="Cargando datos de la ocupación..."></app-loading-spinner>
    } @else {
      <div class="grid grid-cols-1 gap-5">
        <!-- Form Card -->
        <div class="detail-card">
          <div class="detail-card-header">
            <mat-icon class="detail-card-icon">key</mat-icon>
            <h3 class="detail-card-title">Datos del Contrato</h3>
          </div>
          <div class="detail-card-body">
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Inquilino</mat-label>
                <mat-select formControlName="tenantId">
                  @for (tenant of tenants(); track tenant.id) {
                    <mat-option [value]="tenant.id">{{ tenant.name }}</mat-option>
                  }
                </mat-select>
                <mat-icon matSuffix>person</mat-icon>
                @if (form.get('tenantId')?.hasError('required') && form.get('tenantId')?.touched) {
                  <mat-error>El inquilino es requerido</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Unidad</mat-label>
                <mat-select formControlName="unitId">
                  @for (unit of units(); track unit.id) {
                    <mat-option [value]="unit.id">{{ unit.name }}</mat-option>
                  }
                </mat-select>
                <mat-icon matSuffix>home</mat-icon>
                @if (form.get('unitId')?.hasError('required') && form.get('unitId')?.touched) {
                  <mat-error>La unidad es requerida</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Fecha de Inicio</mat-label>
                <input matInput [matDatepicker]="startPicker" formControlName="startDate">
                <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
                <mat-datepicker #startPicker></mat-datepicker>
                @if (form.get('startDate')?.hasError('required') && form.get('startDate')?.touched) {
                  <mat-error>La fecha de inicio es requerida</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Fecha de Fin (Opcional)</mat-label>
                <input matInput [matDatepicker]="endPicker" formControlName="endDate">
                <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
                <mat-datepicker #endPicker></mat-datepicker>
              </mat-form-field>

              <!-- Preview Card -->
              <div class="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
                <div class="flex items-center gap-2 mb-2">
                  <mat-icon class="!w-5 !h-5 text-violet-600">visibility</mat-icon>
                  <span class="text-sm font-semibold text-violet-800">Vista Previa</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-purple-600 text-white flex items-center justify-center">
                    <mat-icon class="!w-5 !h-5">key</mat-icon>
                  </div>
                  <div>
                    <p class="font-semibold text-slate-900">Contrato de Alquiler</p>
                    <p class="text-xs text-slate-500">{{ form.get('startDate')?.value || 'Fecha de inicio' }}</p>
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
                  {{ isEdit() ? 'Guardar Cambios' : 'Registrar Ocupación' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `
})
export class OccupancyFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private occupancyApi = inject(OccupancyApiService);
  private tenantApi = inject(TenantApiService);
  private unitApi = inject(UnitApiService);
  private snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    tenantId: ['', Validators.required],
    unitId: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['']
  });

  isEdit = signal(false);
  loading = signal(false);
  saving = signal(false);
  tenants = signal<Tenant[]>([]);
  units = signal<Unit[]>([]);
  private occupancyId = '';

  ngOnInit(): void {
    this.loadTenants();
    this.loadUnits();
    this.occupancyId = this.route.snapshot.paramMap.get('id') || '';
    if (this.occupancyId) {
      this.isEdit.set(true);
      this.loading.set(true);
      this.occupancyApi.findById(this.occupancyId).subscribe({
        next: (occupancy) => {
          this.form.patchValue({
            tenantId: occupancy.tenantId,
            unitId: occupancy.unitId,
            startDate: occupancy.startDate,
            endDate: occupancy.endDate
          });
          this.loading.set(false);
        },
        error: () => {
          this.snackBar.open('Ocupación no encontrada', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/occupancies']);
        }
      });
    }
  }

  loadTenants(): void {
    this.tenantApi.findAll().subscribe({
      next: (data) => this.tenants.set(data || []),
      error: () => {}
    });
  }

  loadUnits(): void {
    this.unitApi.findAll().subscribe({
      next: (data) => this.units.set(data || []),
      error: () => {}
    });
  }

  goBack(): void {
    this.router.navigate(['/occupancies']);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);

    const occupancyData: Occupancy = this.form.value;

    const request = this.isEdit()
      ? this.occupancyApi.update(this.occupancyId, occupancyData)
      : this.occupancyApi.create(occupancyData);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit() ? 'Ocupación actualizada' : 'Ocupación registrada',
          'OK',
          { duration: 3000 }
        );
        this.router.navigate(['/occupancies']);
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open('Error al guardar la ocupación', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
