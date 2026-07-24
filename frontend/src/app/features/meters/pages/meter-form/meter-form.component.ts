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
import { MeterApiService, Meter } from '../../services/meter-api.service';
import { ServiceApiService, Service } from '../../../services/services/service-api.service';
import { UnitApiService, Unit } from '../../../units/services/unit-api.service';

@Component({
  selector: 'app-meter-form',
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
      [title]="isEditMode() ? 'Editar Medidor' : 'Nuevo Medidor'"
      [subtitle]="isEditMode() ? 'Modificar la información y configuración del medidor' : 'Registrar un nuevo medidor de servicio público a una unidad'">
      <button mat-button routerLink="/meters" class="mr-2">
        <mat-icon>arrow_back</mat-icon> Volver
      </button>
    </app-page-header>

    <!-- Gradient Hero Banner -->
    <div class="mb-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-xl relative overflow-hidden fade-in">
      <div class="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
        <mat-icon class="!w-48 !h-48">speed</mat-icon>
      </div>
      <div class="relative z-10 flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
          <mat-icon class="!w-7 !h-7">{{ isEditMode() ? 'edit' : 'speed' }}</mat-icon>
        </div>
        <div>
          <h2 class="text-xl font-extrabold tracking-tight">{{ isEditMode() ? 'Edición de Medidor' : 'Registro de Nuevo Medidor' }}</h2>
          <p class="text-sm text-emerald-100 mt-0.5">Configure el medidor y asócielo a la unidad correspondiente</p>
        </div>
      </div>
    </div>

    <mat-card class="max-w-2xl mx-auto border border-slate-200/80 shadow-md slide-up">
      <div class="p-8">
        <!-- Step Indicator -->
        <div class="flex items-center gap-3 mb-8 pb-5 border-b border-slate-100">
          <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-md">1</div>
          <div>
            <h3 class="text-base font-bold text-slate-900 leading-tight">Datos del Medidor</h3>
            <p class="text-xs text-slate-500">Información técnica y ubicación del medidor</p>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5 stagger-children">
          <!-- Serial Number -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Número de Serie / Código</mat-label>
            <input matInput formControlName="serialNumber" placeholder="ej. MED-ELEC-101">
            <mat-icon matSuffix class="text-slate-400">tag</mat-icon>
            @if (form.get('serialNumber')?.hasError('required')) {
              <mat-error>El número de serie es obligatorio</mat-error>
            }
          </mat-form-field>

          <!-- Service Type -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Tipo de Servicio</mat-label>
            <mat-select formControlName="serviceId">
              @for (svc of services(); track svc.id) {
                <mat-option [value]="svc.id">
                  <div class="flex items-center gap-2">
                    <mat-icon class="!w-4 !h-4" [class]="getServiceIconClass(svc.name)">{{ getServiceIcon(svc.name) }}</mat-icon>
                    {{ svc.name }} ({{ svc.measurementUnit }})
                  </div>
                </mat-option>
              }
            </mat-select>
          </mat-form-field>

          <!-- Unit Assignment -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Unidad Asignada</mat-label>
            <mat-select formControlName="unitId">
              @for (unit of units(); track unit.id) {
                <mat-option [value]="unit.id">
                  {{ unit.name }}
                </mat-option>
              }
            </mat-select>
            <mat-icon matSuffix class="text-slate-400">door_front</mat-icon>
            @if (form.get('unitId')?.hasError('required')) {
              <mat-error>Debe seleccionar una unidad</mat-error>
            }
          </mat-form-field>

          <!-- Live Preview Card -->
          @if (form.get('serialNumber')?.value) {
            <div class="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-emerald-50/30 border border-slate-200/80 fade-in">
              <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <mat-icon class="!w-4 !h-4">visibility</mat-icon>
                Vista Previa
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shadow-sm">
                  <mat-icon>speed</mat-icon>
                </div>
                <div>
                  <p class="font-mono font-bold text-slate-900 text-sm">{{ form.get('serialNumber')?.value }}</p>
                  <p class="text-xs text-slate-500">{{ getServiceLabel(form.get('serviceId')?.value) }}</p>
                </div>
                <span class="status-badge status-badge-active ml-auto">OPERATIVO</span>
              </div>
            </div>
          }

          <!-- Form Actions -->
          <div class="flex items-center justify-between pt-5 border-t border-slate-100">
            <button mat-stroked-button type="button" routerLink="/meters" class="!rounded-xl">
              <mat-icon>arrow_back</mat-icon>
              Cancelar
            </button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving()" class="btn-primary !rounded-xl !px-6">
              @if (saving()) {
                <ng-container><mat-icon class="animate-spin">sync</mat-icon> Guardando...</ng-container>
              } @else {
                <ng-container><mat-icon>save</mat-icon> {{ isEditMode() ? 'Actualizar Medidor' : 'Guardar Medidor' }}</ng-container>
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
    .step-number { width: 32px; height: 32px; border-radius: 50%; background: #059669; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; box-shadow: 0 2px 6px rgba(5, 150, 105, 0.3); flex-shrink: 0; }
    .step-text h3 { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0; line-height: 1.3; }
    .step-text p { font-size: 0.75rem; color: var(--text-muted); margin: 2px 0 0 0; }

    form { display: flex; flex-direction: column; gap: 20px; }

    mat-form-field { width: 100%; margin-bottom: 0 !important; }

    .preview-card { padding: 16px; border-radius: var(--radius-lg); background: linear-gradient(135deg, #f8fafc, rgba(209, 250, 229, 0.3)); border: 1px solid var(--surface-border-light); animation: fadeIn 0.3s ease; }
    .preview-label { display: flex; align-items: center; gap: 6px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 8px; }
    .preview-row { display: flex; align-items: center; gap: 12px; }
    .preview-icon { width: 40px; height: 40px; border-radius: var(--radius-md); background: #d1fae5; color: #059669; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .preview-name { font-family: 'Inter', monospace; font-weight: 700; font-size: 0.85rem; color: var(--text-primary); }
    .preview-sub { font-size: 0.75rem; color: var(--text-muted); }

    .form-actions { display: flex; align-items: center; justify-content: space-between; padding-top: 20px; border-top: 1px solid var(--surface-border-light); margin-top: 4px; }

    .btn-cancel { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border: 1px solid var(--surface-border); border-radius: var(--radius-lg); background: #fff; color: var(--text-secondary); font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.15s ease; }
    .btn-cancel:hover { background: var(--surface-bg); border-color: var(--text-muted); }

    .btn-submit { display: inline-flex; align-items: center; gap: 8px; padding: 10px 24px; background: linear-gradient(135deg, #059669, #047857); color: #fff; border: none; border-radius: var(--radius-lg); font-size: 0.85rem; font-weight: 600; cursor: pointer; box-shadow: 0 2px 8px rgba(5, 150, 105, 0.3); transition: all 0.15s ease; }
    .btn-submit:hover:not(:disabled) { box-shadow: 0 4px 16px rgba(5, 150, 105, 0.4); transform: translateY(-1px); }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class MeterFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private meterApi = inject(MeterApiService);
  private serviceApi = inject(ServiceApiService);
  private unitApi = inject(UnitApiService);
  private snackBar = inject(MatSnackBar);

  form: FormGroup;
  meterId: string | null = null;
  isEditMode = signal(false);
  saving = signal(false);
  services = signal<Service[]>([]);
  units = signal<Unit[]>([]);

  constructor() {
    this.form = this.fb.group({
      serialNumber: ['', Validators.required],
      serviceId: ['', Validators.required],
      unitId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadServices();
    this.loadUnits();
    this.meterId = this.route.snapshot.paramMap.get('id');
    if (this.meterId && this.meterId !== 'new') {
      this.isEditMode.set(true);
      this.loadMeter(this.meterId);
    }
  }

  private loadServices(): void {
    this.serviceApi.findAll().subscribe({
      next: (data) => this.services.set(data || []),
      error: () => this.services.set([])
    });
  }

  private loadUnits(): void {
    this.unitApi.findAll().subscribe({
      next: (data) => this.units.set(data || []),
      error: () => this.units.set([])
    });
  }

  private loadMeter(id: string): void {
    this.meterApi.findById(id).subscribe({
      next: (data) => {
        if (data) {
          this.form.patchValue({
            serialNumber: data.serialNumber,
            serviceId: data.serviceId,
            unitId: data.unitId
          });
        }
      },
      error: () => {
        this.snackBar.open('Error al cargar el medidor', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/meters']);
      }
    });
  }

  getServiceLabel(serviceId?: string): string {
    const svc = this.services().find(s => s.id === serviceId);
    return svc ? `${svc.name} (${svc.measurementUnit})` : 'Servicio Público';
  }

  getServiceIcon(name: string): string {
    const n = (name || '').toLowerCase();
    if (n.includes('electricidad') || n.includes('electr')) return 'bolt';
    if (n.includes('agua')) return 'water_drop';
    if (n.includes('gas')) return 'local_fire_department';
    return 'speed';
  }

  getServiceIconClass(name: string): string {
    const n = (name || '').toLowerCase();
    if (n.includes('electricidad') || n.includes('electr')) return 'text-amber-500';
    if (n.includes('agua')) return 'text-blue-500';
    if (n.includes('gas')) return 'text-orange-500';
    return 'text-slate-500';
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const payload: Meter = this.form.getRawValue();

    const request$ = this.isEditMode() && this.meterId
      ? this.meterApi.update(this.meterId, payload)
      : this.meterApi.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.snackBar.open(
          this.isEditMode() ? 'Medidor actualizado exitosamente' : 'Medidor creado exitosamente',
          'OK',
          { duration: 3000 }
        );
        this.router.navigate(['/meters']);
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open('Error al guardar el medidor. Intente de nuevo.', 'Cerrar', { duration: 4000 });
      }
    });
  }
}
