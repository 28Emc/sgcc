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
import { ReceiptApiService, Receipt } from '../../services/receipt-api.service';
import { ServiceApiService, Service } from '../../../services/services/service-api.service';

@Component({
  selector: 'app-receipt-form',
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
      [title]="isEditMode() ? 'Editar Recibo' : 'Nuevo Recibo'"
      [subtitle]="isEditMode() ? 'Modificar los datos del recibo del proveedor' : 'Registrar el recibo emitido por la empresa proveedora del servicio'">
      <button mat-button routerLink="/receipts" class="mr-2">
        <mat-icon>arrow_back</mat-icon> Volver
      </button>
    </app-page-header>

    <!-- Gradient Hero Banner -->
    <div class="mb-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-xl relative overflow-hidden fade-in">
      <div class="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
        <mat-icon class="!w-48 !h-48">receipt_long</mat-icon>
      </div>
      <div class="relative z-10 flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
          <mat-icon class="!w-7 !h-7">{{ isEditMode() ? 'edit' : 'receipt' }}</mat-icon>
        </div>
        <div>
          <h2 class="text-xl font-extrabold tracking-tight">{{ isEditMode() ? 'Edición de Recibo' : 'Registro de Recibo de Proveedor' }}</h2>
          <p class="text-sm text-indigo-100 mt-0.5">Ingrese los datos de la factura global para calcular el valor unitario</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Form -->
      <mat-card class="lg:col-span-2 border border-slate-200/80 shadow-md slide-up">
        <div class="p-8">
          <!-- Step Indicator -->
          <div class="flex items-center gap-3 mb-8 pb-5 border-b border-slate-100">
            <div class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-md">1</div>
            <div>
              <h3 class="text-base font-bold text-slate-900 leading-tight">Datos del Recibo</h3>
              <p class="text-xs text-slate-500">Información de la factura emitida por la empresa proveedora</p>
            </div>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5 stagger-children">
            <!-- Provider / Service -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Empresa Proveedora / Servicio</mat-label>
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

            <!-- Period & Receipt Number -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Periodo Facturado</mat-label>
                <input matInput formControlName="period" placeholder="ej. 2026-07">
                <mat-icon matSuffix class="text-slate-400">calendar_month</mat-icon>
                @if (form.get('period')?.hasError('required')) {
                  <mat-error>El periodo es obligatorio</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Número de Factura / Recibo</mat-label>
                <input matInput formControlName="receiptNumber" placeholder="ej. FAC-001234">
                <mat-icon matSuffix class="text-slate-400">tag</mat-icon>
                @if (form.get('receiptNumber')?.hasError('required')) {
                  <mat-error>El número es obligatorio</mat-error>
                }
              </mat-form-field>
            </div>

            <!-- Financial Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Monto Total Factura ($)</mat-label>
                <input matInput type="number" formControlName="totalAmount" placeholder="0.00" class="font-mono">
                <span matPrefix class="mr-1 text-slate-500 font-bold">$</span>
                @if (form.get('totalAmount')?.hasError('required')) {
                  <mat-error>Requerido</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Consumo Global (kWh / m³)</mat-label>
                <input matInput type="number" formControlName="totalConsumption" placeholder="0.00" class="font-mono">
                @if (form.get('totalConsumption')?.hasError('required')) {
                  <mat-error>Requerido</mat-error>
                }
              </mat-form-field>
            </div>

            <!-- Form Actions -->
            <div class="flex items-center justify-between pt-5 border-t border-slate-100">
              <button mat-stroked-button type="button" routerLink="/receipts" class="!rounded-xl">
                <mat-icon>arrow_back</mat-icon>
                Cancelar
              </button>
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving()" class="btn-primary !rounded-xl !px-6">
                @if (saving()) {
                  <ng-container><mat-icon class="animate-spin">sync</mat-icon> Guardando...</ng-container>
                } @else {
                  <ng-container><mat-icon>save</mat-icon> {{ isEditMode() ? 'Actualizar Recibo' : 'Guardar Recibo' }}</ng-container>
                }
              </button>
            </div>
          </form>
        </div>
      </mat-card>

      <!-- Computed Result Sidebar -->
      <div class="space-y-6 slide-up" style="animation-delay: 100ms">
        <!-- Unit Value Card -->
        <mat-card class="!p-6 border border-slate-200/80">
          <div class="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
            <div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <mat-icon>paid</mat-icon>
            </div>
            <h3 class="text-sm font-bold text-slate-900">Valor Unitario</h3>
          </div>

          <div class="text-center py-4">
            <p class="text-4xl font-black text-indigo-700 font-mono leading-none">
              $ {{ unitValue() | number:'1.4-4' }}
            </p>
            <p class="text-xs text-slate-500 mt-2 font-medium">por unidad consumida</p>
          </div>

          @if (form.get('totalAmount')?.value && form.get('totalConsumption')?.value) {
            <div class="space-y-2 text-xs mt-4 pt-3 border-t border-slate-100">
              <div class="flex justify-between text-slate-500">
                <span>Monto total:</span>
                <span class="font-mono font-semibold text-slate-700">$ {{ form.get('totalAmount')?.value | number:'1.2-2' }}</span>
              </div>
              <div class="flex justify-between text-slate-500">
                <span>Consumo global:</span>
                <span class="font-mono font-semibold text-slate-700">{{ form.get('totalConsumption')?.value | number:'1.0-2' }} unidades</span>
              </div>
            </div>
          }
        </mat-card>

        <!-- Formula Card -->
        <div class="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
          <div class="flex items-start gap-2">
            <mat-icon class="!w-5 !h-5 text-indigo-500 mt-0.5">functions</mat-icon>
            <div>
              <p class="text-xs font-bold text-indigo-800 mb-1">Fórmula de Cálculo</p>
              <p class="text-xs text-indigo-600 leading-relaxed font-mono bg-white/60 rounded-lg p-2 border border-indigo-100">
                VU = Monto ($) ÷ Consumo Global
              </p>
              <p class="text-xs text-indigo-500 mt-2 leading-relaxed">El valor unitario se usará para prorratear el consumo individual de cada inquilino.</p>
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
    .step-number { width: 32px; height: 32px; border-radius: 50%; background: var(--color-primary-600); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3); flex-shrink: 0; }
    .step-text h3 { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0; line-height: 1.3; }
    .step-text p { font-size: 0.75rem; color: var(--text-muted); margin: 2px 0 0 0; }

    form { display: flex; flex-direction: column; gap: 20px; }

    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } }

    mat-form-field { width: 100%; margin-bottom: 0 !important; }

    .unit-value-card { border: 1px solid var(--surface-border-light); border-radius: var(--radius-lg); background: var(--surface-card); padding: 24px !important; }
    .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--surface-border-light); }
    .card-icon { width: 36px; height: 36px; border-radius: var(--radius-md); background: #eef2ff; color: var(--color-primary-600); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .card-title { font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin: 0; }

    .unit-value-display { text-align: center; padding: 16px 0; }
    .unit-value-number { font-size: 2.2rem; font-weight: 900; color: var(--color-primary-600); font-family: 'Inter', monospace; line-height: 1; }
    .unit-value-label { font-size: 0.75rem; color: var(--text-muted); margin-top: 8px; font-weight: 500; }

    .value-summary { margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--surface-border-light); display: flex; flex-direction: column; gap: 8px; }
    .summary-row { display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted); }
    .summary-value { font-family: 'Inter', monospace; font-weight: 600; color: var(--text-primary); }

    .formula-box { padding: 16px; border-radius: var(--radius-lg); background: linear-gradient(135deg, #eef2ff, #f5f3ff); border: 1px solid #c7d2fe; }
    .formula-header { display: flex; align-items: flex-start; gap: 8px; }
    .formula-title { font-size: 0.75rem; font-weight: 700; color: #4338ca; margin-bottom: 4px; }
    .formula-code { font-family: 'Inter', monospace; font-size: 0.75rem; color: var(--color-primary-600); background: rgba(255,255,255,0.6); border-radius: var(--radius-md); padding: 8px 12px; border: 1px solid #c7d2fe; margin-bottom: 8px; }
    .formula-desc { font-size: 0.75rem; color: var(--color-primary-500); line-height: 1.5; }

    .form-actions { display: flex; align-items: center; justify-content: space-between; padding-top: 20px; border-top: 1px solid var(--surface-border-light); margin-top: 4px; }

    .btn-cancel { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border: 1px solid var(--surface-border); border-radius: var(--radius-lg); background: #fff; color: var(--text-secondary); font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.15s ease; }
    .btn-cancel:hover { background: var(--surface-bg); border-color: var(--text-muted); }

    .btn-submit { display: inline-flex; align-items: center; gap: 8px; padding: 10px 24px; background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700)); color: #fff; border: none; border-radius: var(--radius-lg); font-size: 0.85rem; font-weight: 600; cursor: pointer; box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3); transition: all 0.15s ease; }
    .btn-submit:hover:not(:disabled) { box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4); transform: translateY(-1px); }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ReceiptFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private receiptApi = inject(ReceiptApiService);
  private serviceApi = inject(ServiceApiService);
  private snackBar = inject(MatSnackBar);

  form: FormGroup;
  receiptId: string | null = null;
  isEditMode = signal(false);
  saving = signal(false);
  unitValue = signal(0);
  services = signal<Service[]>([]);

  constructor() {
    this.form = this.fb.group({
      serviceId: ['', Validators.required],
      period: ['', Validators.required],
      receiptNumber: ['', Validators.required],
      totalAmount: [0, [Validators.required, Validators.min(0.01)]],
      totalConsumption: [0, [Validators.required, Validators.min(0.01)]]
    });

    this.form.valueChanges.subscribe(() => this.calculateUnitValue());
  }

  ngOnInit(): void {
    this.loadServices();
    this.receiptId = this.route.snapshot.paramMap.get('id');
    if (this.receiptId && this.receiptId !== 'new') {
      this.isEditMode.set(true);
      this.loadReceipt(this.receiptId);
    }
  }

  private loadServices(): void {
    this.serviceApi.findAll().subscribe({
      next: (data) => this.services.set(data || []),
      error: () => this.services.set([])
    });
  }

  private loadReceipt(id: string): void {
    this.receiptApi.findById(id).subscribe({
      next: (data) => {
        if (data) {
          this.form.patchValue({
            serviceId: data.serviceId,
            period: data.period,
            receiptNumber: data.receiptNumber,
            totalAmount: data.totalAmount,
            totalConsumption: data.totalConsumption
          });
          this.form.get('serviceId')?.disable();
          this.form.get('receiptNumber')?.disable();
          this.calculateUnitValue();
        }
      },
      error: () => {
        this.snackBar.open('Error al cargar el recibo', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/receipts']);
      }
    });
  }

  calculateUnitValue(): void {
    const amount = this.form.get('totalAmount')?.value || 0;
    const consumption = this.form.get('totalConsumption')?.value || 0;
    this.unitValue.set(consumption > 0 ? amount / consumption : 0);
  }

  getServiceIcon(name: string): string {
    const n = (name || '').toLowerCase();
    if (n.includes('electricidad') || n.includes('electr')) return 'bolt';
    if (n.includes('agua')) return 'water_drop';
    if (n.includes('gas')) return 'local_fire_department';
    return 'receipt';
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
    const payload: Receipt = this.form.getRawValue();

    const request$ = this.isEditMode() && this.receiptId
      ? this.receiptApi.update(this.receiptId, payload)
      : this.receiptApi.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.snackBar.open(
          this.isEditMode() ? 'Recibo actualizado exitosamente' : 'Recibo registrado exitosamente',
          'OK',
          { duration: 3000 }
        );
        this.router.navigate(['/receipts']);
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open('Error al guardar el recibo. Intente de nuevo.', 'Cerrar', { duration: 4000 });
      }
    });
  }
}
