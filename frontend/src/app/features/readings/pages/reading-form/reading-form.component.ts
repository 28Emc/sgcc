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
import { ReadingApiService, Reading } from '../../services/reading-api.service';
import { MeterApiService, Meter } from '../../../meters/services/meter-api.service';

@Component({
  selector: 'app-reading-form',
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
      [title]="isEditMode() ? 'Editar Lectura' : 'Nueva Lectura'"
      [subtitle]="isEditMode() ? 'Modificar los valores de la lectura registrada' : 'Registrar la toma de lectura física del medidor'">
      <button mat-button routerLink="/readings" class="mr-2">
        <mat-icon>arrow_back</mat-icon> Volver
      </button>
    </app-page-header>

    <!-- Gradient Hero Banner -->
    <div class="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-xl relative overflow-hidden fade-in">
      <div class="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
        <mat-icon class="!w-48 !h-48">edit_note</mat-icon>
      </div>
      <div class="relative z-10 flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
          <mat-icon class="!w-7 !h-7">{{ isEditMode() ? 'edit' : 'edit_note' }}</mat-icon>
        </div>
        <div>
          <h2 class="text-xl font-extrabold tracking-tight">{{ isEditMode() ? 'Edición de Lectura' : 'Toma de Nueva Lectura' }}</h2>
          <p class="text-sm text-blue-100 mt-0.5">Seleccione el medidor e ingrese el valor actual tomado físicamente</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Form -->
      <mat-card class="lg:col-span-2 border border-slate-200/80 shadow-md slide-up">
        <div class="p-8">
          <!-- Step Indicator -->
          <div class="flex items-center gap-3 mb-8 pb-5 border-b border-slate-100">
            <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-md">1</div>
            <div>
              <h3 class="text-base font-bold text-slate-900 leading-tight">Datos de la Lectura</h3>
              <p class="text-xs text-slate-500">Seleccione medidor e ingrese los valores tomados</p>
            </div>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5 stagger-children">
            <!-- Meter Selection -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Medidor Asociado</mat-label>
              <mat-select formControlName="meterId" (selectionChange)="onMeterSelected($event.value)">
                @for (meter of meters(); track meter.id) {
                  <mat-option [value]="meter.id">
                    <div class="flex items-center gap-2">
                      <mat-icon class="!w-4 !h-4 text-amber-500">{{ getServiceIcon(meter.serviceName || '') }}</mat-icon>
                      {{ meter.serialNumber }}
                    </div>
                  </mat-option>
                }
              </mat-select>
              <mat-icon matSuffix class="text-slate-400">speed</mat-icon>
              @if (form.get('meterId')?.hasError('required')) {
                <mat-error>Debe seleccionar un medidor</mat-error>
              }
            </mat-form-field>

            <!-- Reading Date -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Fecha de Toma de Lectura</mat-label>
              <input matInput type="date" formControlName="readingDate">
              <mat-icon matSuffix class="text-slate-400">calendar_today</mat-icon>
              @if (form.get('readingDate')?.hasError('required')) {
                <mat-error>La fecha es obligatoria</mat-error>
              }
            </mat-form-field>

            <!-- Reading Values -->
            <div class="grid grid-cols-2 gap-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Lectura Anterior</mat-label>
                <input matInput type="number" formControlName="previousValue" readonly class="!bg-slate-100 !text-slate-600 font-mono font-bold !cursor-not-allowed">
                <mat-icon matSuffix class="text-slate-400">history</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Lectura Actual Tomada</mat-label>
                <input matInput type="number" formControlName="readingValue" (input)="calculateConsumption()" placeholder="0.00" class="font-mono">
                <mat-icon matSuffix class="text-slate-400">speed</mat-icon>
                @if (form.get('readingValue')?.hasError('required')) {
                  <mat-error>Requerido</mat-error>
                }
              </mat-form-field>
            </div>

            <!-- Form Actions -->
            <div class="flex items-center justify-between pt-5 border-t border-slate-100">
              <button mat-stroked-button type="button" routerLink="/readings" class="!rounded-xl">
                <mat-icon>arrow_back</mat-icon>
                Cancelar
              </button>
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || calculatedConsumption() < 0 || saving()" class="btn-primary !rounded-xl !px-6">
                @if (saving()) {
                  <ng-container><mat-icon class="animate-spin">sync</mat-icon> Guardando...</ng-container>
                } @else {
                  <ng-container><mat-icon>save</mat-icon> {{ isEditMode() ? 'Actualizar Lectura' : 'Guardar Lectura' }}</ng-container>
                }
              </button>
            </div>
          </form>
        </div>
      </mat-card>

      <!-- Computed Result Sidebar -->
      <div class="space-y-6 slide-up" style="animation-delay: 100ms">
        <!-- Consumption Card -->
        <mat-card class="!p-6 border border-slate-200/80">
          <div class="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
            <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <mat-icon>calculate</mat-icon>
            </div>
            <h3 class="text-sm font-bold text-slate-900">Consumo Neto</h3>
          </div>

          <div class="text-center py-4">
            <p class="text-4xl font-black text-blue-700 font-mono leading-none">
              {{ calculatedConsumption() | number:'1.0-2' }}
            </p>
            <p class="text-xs text-slate-500 mt-2 font-medium">unidades consumidas</p>
          </div>

          @if (calculatedConsumption() < 0) {
            <div class="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700 fade-in">
              <mat-icon class="!w-4 !h-4 text-red-500">warning</mat-icon>
              La lectura actual es menor a la anterior. Verifique el valor.
            </div>
          }

          @if (calculatedConsumption() >= 0 && form.get('readingValue')?.value) {
            <div class="space-y-2 text-xs mt-4 pt-3 border-t border-slate-100">
              <div class="flex justify-between text-slate-500">
                <span>Lectura anterior:</span>
                <span class="font-mono font-semibold text-slate-700">{{ form.get('previousValue')?.value | number:'1.0-2' }}</span>
              </div>
              <div class="flex justify-between text-slate-500">
                <span>Lectura actual:</span>
                <span class="font-mono font-semibold text-slate-700">{{ form.get('readingValue')?.value | number:'1.0-2' }}</span>
              </div>
            </div>
          }
        </mat-card>

        <!-- Tip Card -->
        <div class="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
          <div class="flex items-start gap-2">
            <mat-icon class="!w-5 !h-5 text-blue-500 mt-0.5">lightbulb</mat-icon>
            <div>
              <p class="text-xs font-bold text-blue-800 mb-1">Consejo</p>
              <p class="text-xs text-blue-600 leading-relaxed">Verifique que la lectura actual sea mayor a la anterior. El consumo neto se usará para calcular el monto del cobro.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; padding: 24px; max-width: 1400px; margin: 0 auto; }

    .form-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 28px; }
    @media (max-width: 1024px) { .form-grid { grid-template-columns: 1fr; } }

    mat-card { background: var(--surface-card) !important; border: 1px solid var(--surface-border-light) !important; border-radius: var(--radius-lg) !important; }
    .main-card > div { padding: 28px !important; }
    .sidebar-card { padding: 24px !important; }

    .step-indicator { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid var(--surface-border-light); }
    .step-number { width: 32px; height: 32px; border-radius: 50%; background: #2563eb; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3); flex-shrink: 0; }
    .step-text h3 { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0; line-height: 1.3; }
    .step-text p { font-size: 0.75rem; color: var(--text-muted); margin: 2px 0 0 0; }

    form { display: flex; flex-direction: column; gap: 20px; }

    .reading-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 640px) { .reading-grid { grid-template-columns: 1fr; } }

    mat-form-field { width: 100%; margin-bottom: 0 !important; }

    .consumption-card { border: 1px solid var(--surface-border-light); border-radius: var(--radius-lg); background: var(--surface-card); padding: 24px !important; }
    .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--surface-border-light); }
    .card-icon { width: 36px; height: 36px; border-radius: var(--radius-md); background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .card-title { font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin: 0; }

    .consumption-value { text-align: center; padding: 16px 0; }
    .consumption-number { font-size: 2.5rem; font-weight: 900; color: #2563eb; font-family: 'Inter', monospace; line-height: 1; }
    .consumption-label { font-size: 0.75rem; color: var(--text-muted); margin-top: 8px; font-weight: 500; }

    .warning-box { padding: 12px; border-radius: var(--radius-lg); background: #fef2f2; border: 1px solid #fecaca; display: flex; align-items: center; gap: 8px; font-size: 0.78rem; color: #b91c1c; animation: fadeIn 0.3s ease; }

    .reading-summary { margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--surface-border-light); display: flex; flex-direction: column; gap: 8px; }
    .summary-row { display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted); }
    .summary-value { font-family: 'Inter', monospace; font-weight: 600; color: var(--text-primary); }

    .tip-box { padding: 16px; border-radius: var(--radius-lg); background: linear-gradient(135deg, #eff6ff, #ecfeff); border: 1px solid #bfdbfe; }
    .tip-header { display: flex; align-items: flex-start; gap: 8px; }
    .tip-title { font-size: 0.75rem; font-weight: 700; color: #1e40af; margin-bottom: 4px; }
    .tip-text { font-size: 0.75rem; color: #2563eb; line-height: 1.5; }

    .form-actions { display: flex; align-items: center; justify-content: space-between; padding-top: 20px; border-top: 1px solid var(--surface-border-light); margin-top: 4px; }

    .btn-cancel { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border: 1px solid var(--surface-border); border-radius: var(--radius-lg); background: #fff; color: var(--text-secondary); font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.15s ease; }
    .btn-cancel:hover { background: var(--surface-bg); border-color: var(--text-muted); }

    .btn-submit { display: inline-flex; align-items: center; gap: 8px; padding: 10px 24px; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; border: none; border-radius: var(--radius-lg); font-size: 0.85rem; font-weight: 600; cursor: pointer; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3); transition: all 0.15s ease; }
    .btn-submit:hover:not(:disabled) { box-shadow: 0 4px 16px rgba(37, 99, 235, 0.4); transform: translateY(-1px); }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ReadingFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private readingApi = inject(ReadingApiService);
  private meterApi = inject(MeterApiService);
  private snackBar = inject(MatSnackBar);

  form: FormGroup;
  readingId: string | null = null;
  isEditMode = signal(false);
  saving = signal(false);
  calculatedConsumption = signal(0);
  meters = signal<Meter[]>([]);

  constructor() {
    this.form = this.fb.group({
      meterId: ['', Validators.required],
      readingDate: [new Date().toISOString().split('T')[0], Validators.required],
      previousValue: [0, Validators.required],
      readingValue: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMeters();
    this.readingId = this.route.snapshot.paramMap.get('id');
    if (this.readingId && this.readingId !== 'new') {
      this.isEditMode.set(true);
      this.loadReading(this.readingId);
    }
    this.calculateConsumption();
  }

  private loadMeters(): void {
    this.meterApi.findAll().subscribe({
      next: (data) => this.meters.set(data || []),
      error: () => this.meters.set([])
    });
  }

  private loadReading(id: string): void {
    this.readingApi.findById(id).subscribe({
      next: (data) => {
        if (data) {
          this.form.patchValue({
            meterId: data.meterId,
            readingDate: data.readingDate,
            readingValue: data.readingValue
          });
          const meter = this.meters().find(m => m.id === data.meterId);
          const prev = meter?.lastReadingValue || 0;
          this.form.patchValue({ previousValue: prev });
          this.calculateConsumption();
        }
      },
      error: () => {
        this.snackBar.open('Error al cargar la lectura', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/readings']);
      }
    });
  }

  onMeterSelected(meterId: string): void {
    const meter = this.meters().find(m => m.id === meterId);
    const prev = meter?.lastReadingValue || 0;
    this.form.patchValue({ previousValue: prev });
    this.calculateConsumption();
  }

  calculateConsumption(): void {
    const prev = this.form.get('previousValue')?.value || 0;
    const curr = this.form.get('readingValue')?.value || 0;
    this.calculatedConsumption.set(curr - prev);
  }

  getServiceIcon(name: string): string {
    const n = (name || '').toLowerCase();
    if (n.includes('electricidad') || n.includes('electr')) return 'bolt';
    if (n.includes('agua')) return 'water_drop';
    if (n.includes('gas')) return 'local_fire_department';
    return 'speed';
  }

  onSubmit(): void {
    if (this.form.invalid || this.calculatedConsumption() < 0) return;

    this.saving.set(true);
    const payload: Reading = {
      meterId: this.form.value.meterId,
      readingDate: this.form.value.readingDate,
      readingValue: this.form.value.readingValue
    };

    const request$ = this.isEditMode() && this.readingId
      ? this.readingApi.update(this.readingId, payload)
      : this.readingApi.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.snackBar.open(
          this.isEditMode() ? 'Lectura actualizada exitosamente' : 'Lectura registrada exitosamente',
          'OK',
          { duration: 3000 }
        );
        this.router.navigate(['/readings']);
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open('Error al guardar la lectura. Intente de nuevo.', 'Cerrar', { duration: 4000 });
      }
    });
  }
}
