import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { PropertyApiService, Property } from '../../services/property-api.service';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    PageHeaderComponent
  ],
  template: `
    <app-page-header
      [title]="isEditMode() ? 'Editar Propiedad' : 'Nueva Propiedad'"
      [subtitle]="isEditMode() ? 'Modifique la información y configuración del inmueble' : 'Registrar un nuevo inmueble o condominio multifamiliar'">
      <button mat-button routerLink="/properties" class="mr-2">
        <mat-icon>arrow_back</mat-icon> Volver
      </button>
    </app-page-header>

    <!-- Gradient Hero Banner -->
    <div class="mb-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-xl relative overflow-hidden fade-in">
      <div class="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
        <mat-icon class="!w-48 !h-48">apartment</mat-icon>
      </div>
      <div class="relative z-10 flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
          <mat-icon class="!w-7 !h-7">{{ isEditMode() ? 'edit' : 'add_business' }}</mat-icon>
        </div>
        <div>
          <h2 class="text-xl font-extrabold tracking-tight">{{ isEditMode() ? 'Edición de Inmueble' : 'Registro de Nuevo Inmueble' }}</h2>
          <p class="text-sm text-indigo-100 mt-0.5">Complete los datos básicos para configurar la propiedad en el sistema</p>
        </div>
      </div>
    </div>

    <mat-card class="max-w-2xl mx-auto border border-slate-200/80 shadow-md slide-up">
      <div class="p-8">
        <!-- Step Indicator -->
        <div class="flex items-center gap-3 mb-8 pb-5 border-b border-slate-100">
          <div class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-md">1</div>
          <div>
            <h3 class="text-base font-bold text-slate-900 leading-tight">Datos de la Propiedad</h3>
            <p class="text-xs text-slate-500">Información básica del inmueble a administrar</p>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5 stagger-children">
          <!-- Property Name -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Nombre de la Propiedad / Edificio</mat-label>
            <input matInput formControlName="name" placeholder="ej. Edificio Los Olivos">
            <mat-icon matSuffix class="text-slate-400">apartment</mat-icon>
            @if (form.get('name')?.hasError('required')) {
              <mat-error>El nombre del inmueble es obligatorio</mat-error>
            }
          </mat-form-field>

          <!-- Address -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Dirección Física</mat-label>
            <textarea matInput formControlName="address" rows="2" placeholder="ej. Av. Las Palmeras 456, Depto 101-302"></textarea>
            <mat-icon matSuffix class="text-slate-400">location_on</mat-icon>
            @if (form.get('address')?.hasError('required')) {
              <mat-error>La dirección es obligatoria</mat-error>
            }
          </mat-form-field>

          <!-- Description -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Descripción / Detalles adicionales</mat-label>
            <textarea matInput formControlName="description" rows="3" placeholder="Detalles de la propiedad, pisos, servicios compartidos..."></textarea>
            <mat-icon matSuffix class="text-slate-400">notes</mat-icon>
          </mat-form-field>

          <!-- Live Preview Card -->
          @if (form.get('name')?.value) {
            <div class="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50/30 border border-slate-200/80 fade-in">
              <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <mat-icon class="!w-4 !h-4">visibility</mat-icon>
                Vista Previa
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shadow-sm">
                  <mat-icon>apartment</mat-icon>
                </div>
                <div>
                  <p class="font-bold text-slate-900 text-sm">{{ form.get('name')?.value }}</p>
                  <p class="text-xs text-slate-500">{{ form.get('address')?.value || 'Sin dirección' }}</p>
                </div>
                <span class="status-badge status-badge-active ml-auto">ACTIVO</span>
              </div>
            </div>
          }

          <!-- Form Actions -->
          <div class="flex items-center justify-between pt-5 border-t border-slate-100">
            <button mat-stroked-button type="button" routerLink="/properties" class="!rounded-xl">
              <mat-icon>arrow_back</mat-icon>
              Cancelar
            </button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving()" class="btn-primary !rounded-xl !px-6">
              @if (saving()) {
                <ng-container><mat-icon class="animate-spin">sync</mat-icon> Guardando...</ng-container>
              } @else {
                <ng-container><mat-icon>save</mat-icon> {{ isEditMode() ? 'Actualizar Propiedad' : 'Guardar Propiedad' }}</ng-container>
              }
            </button>
          </div>
        </form>
      </div>
    </mat-card>
  `,
  styles: [`
    :host { display: block; padding: 24px; max-width: 1400px; margin: 0 auto; }

    mat-card { background: var(--surface-card) !important; border: 1px solid var(--surface-border-light) !important; border-radius: var(--radius-lg) !important; }
    mat-card > div { padding: 28px !important; }

    .step-indicator { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid var(--surface-border-light); }
    .step-number { width: 32px; height: 32px; border-radius: 50%; background: var(--color-primary-600); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3); flex-shrink: 0; }
    .step-text h3 { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0; line-height: 1.3; }
    .step-text p { font-size: 0.75rem; color: var(--text-muted); margin: 2px 0 0 0; }

    form { display: flex; flex-direction: column; gap: 20px; }

    mat-form-field { width: 100%; margin-bottom: 0 !important; }

    .preview-card { padding: 16px; border-radius: var(--radius-lg); background: linear-gradient(135deg, #f8fafc, rgba(238, 242, 255, 0.4)); border: 1px solid var(--surface-border-light); animation: fadeIn 0.3s ease; }
    .preview-label { display: flex; align-items: center; gap: 6px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 8px; }
    .preview-row { display: flex; align-items: center; gap: 12px; }
    .preview-icon { width: 40px; height: 40px; border-radius: var(--radius-md); background: #e0e7ff; color: var(--color-primary-600); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .preview-name { font-weight: 700; font-size: 0.85rem; color: var(--text-primary); }
    .preview-sub { font-size: 0.75rem; color: var(--text-muted); }

    .form-actions { display: flex; align-items: center; justify-content: space-between; padding-top: 20px; border-top: 1px solid var(--surface-border-light); margin-top: 4px; }

    .btn-cancel { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border: 1px solid var(--surface-border); border-radius: var(--radius-lg); background: #fff; color: var(--text-secondary); font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.15s ease; }
    .btn-cancel:hover { background: var(--surface-bg); border-color: var(--text-muted); }

    .btn-submit { display: inline-flex; align-items: center; gap: 8px; padding: 10px 24px; background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700)); color: #fff; border: none; border-radius: var(--radius-lg); font-size: 0.85rem; font-weight: 600; cursor: pointer; box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3); transition: all 0.15s ease; }
    .btn-submit:hover:not(:disabled) { box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4); transform: translateY(-1px); }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class PropertyFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private propertyApi = inject(PropertyApiService);
  private snackBar = inject(MatSnackBar);

  form: FormGroup;
  propertyId: string | null = null;
  isEditMode = signal(false);
  saving = signal(false);

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.propertyId = this.route.snapshot.paramMap.get('id');
    if (this.propertyId && this.propertyId !== 'new') {
      this.isEditMode.set(true);
      this.loadProperty(this.propertyId);
    }
  }

  private loadProperty(id: string): void {
    this.propertyApi.findById(id).subscribe({
      next: (data) => {
        if (data) {
          this.form.patchValue({
            name: data.name,
            address: data.address,
            description: data.description || ''
          });
        }
      },
      error: () => {
        this.snackBar.open('Error al cargar la propiedad', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/properties']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const payload: Property = this.form.getRawValue();

    const request$ = this.isEditMode() && this.propertyId
      ? this.propertyApi.update(this.propertyId, payload)
      : this.propertyApi.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.snackBar.open(
          this.isEditMode() ? 'Propiedad actualizada exitosamente' : 'Propiedad creada exitosamente',
          'OK',
          { duration: 3000 }
        );
        this.router.navigate(['/properties']);
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open('Error al guardar la propiedad. Intente de nuevo.', 'Cerrar', { duration: 4000 });
      }
    });
  }
}
