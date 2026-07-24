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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { UnitApiService, Unit } from '../../services/unit-api.service';
import { PropertyApiService, Property } from '../../../properties/services/property-api.service';

@Component({
  selector: 'app-unit-form',
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
    MatSnackBarModule,
    PageHeaderComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <app-page-header
      [title]="isEdit() ? 'Editar Unidad' : 'Registrar Nueva Unidad'"
      subtitle="Complete la información de la unidad">
      <button mat-stroked-button (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
        Volver
      </button>
    </app-page-header>

    @if (loading()) {
      <app-loading-spinner message="Cargando datos de la unidad..."></app-loading-spinner>
    } @else {
      <div class="grid grid-cols-1 gap-5">
        <!-- Form Card -->
        <div class="detail-card">
          <div class="detail-card-header">
            <mat-icon class="detail-card-icon">home</mat-icon>
            <h3 class="detail-card-title">Datos de la Unidad</h3>
          </div>
          <div class="detail-card-body">
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Propiedad</mat-label>
                <mat-select formControlName="propertyId">
                  @for (prop of properties(); track prop.id) {
                    <mat-option [value]="prop.id">{{ prop.name }}</mat-option>
                  }
                </mat-select>
                <mat-icon matSuffix>apartment</mat-icon>
                @if (form.get('propertyId')?.hasError('required') && form.get('propertyId')?.touched) {
                  <mat-error>La propiedad es requerida</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Nombre de la Unidad</mat-label>
                <input matInput formControlName="name" placeholder="Ej: Departamento 101">
                <mat-icon matSuffix>home</mat-icon>
                @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
                  <mat-error>El nombre es requerido</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Descripción</mat-label>
                <textarea matInput formControlName="description" rows="3" placeholder="Descripción opcional de la unidad"></textarea>
                <mat-icon matSuffix>description</mat-icon>
              </mat-form-field>

              <!-- Preview Card -->
              <div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                <div class="flex items-center gap-2 mb-2">
                  <mat-icon class="!w-5 !h-5 text-blue-600">visibility</mat-icon>
                  <span class="text-sm font-semibold text-blue-800">Vista Previa</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-600 text-white flex items-center justify-center">
                    <mat-icon class="!w-5 !h-5">home</mat-icon>
                  </div>
                  <div>
                    <p class="font-semibold text-slate-900">{{ form.get('name')?.value || 'Nombre de la unidad' }}</p>
                    <p class="text-xs text-slate-500">{{ form.get('description')?.value || 'Sin descripción' }}</p>
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
                  {{ isEdit() ? 'Guardar Cambios' : 'Registrar Unidad' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `
})
export class UnitFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private unitApi = inject(UnitApiService);
  private propertyApi = inject(PropertyApiService);
  private snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    propertyId: ['', Validators.required],
    name: ['', Validators.required],
    description: ['']
  });

  isEdit = signal(false);
  loading = signal(false);
  saving = signal(false);
  properties = signal<Property[]>([]);
  private unitId = '';

  ngOnInit(): void {
    this.loadProperties();
    this.unitId = this.route.snapshot.paramMap.get('id') || '';
    if (this.unitId) {
      this.isEdit.set(true);
      this.loading.set(true);
      this.unitApi.findById(this.unitId).subscribe({
        next: (unit) => {
          this.form.patchValue({
            propertyId: unit.propertyId,
            name: unit.name,
            description: unit.description
          });
          this.loading.set(false);
        },
        error: () => {
          this.snackBar.open('Unidad no encontrada', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/units']);
        }
      });
    }
  }

  loadProperties(): void {
    this.propertyApi.findAll().subscribe({
      next: (data) => this.properties.set(data || []),
      error: () => {}
    });
  }

  goBack(): void {
    this.router.navigate(['/units']);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);

    const unitData: Unit = this.form.value;

    const request = this.isEdit()
      ? this.unitApi.update(this.unitId, unitData)
      : this.unitApi.create(unitData);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit() ? 'Unidad actualizada' : 'Unidad registrada',
          'OK',
          { duration: 3000 }
        );
        this.router.navigate(['/units']);
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open('Error al guardar la unidad', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
