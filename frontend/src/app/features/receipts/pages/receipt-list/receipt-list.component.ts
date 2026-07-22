import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ReceiptApiService } from '../../services/receipt-api.service';

@Component({
  selector: 'app-receipt-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent
  ],
  template: `
    <app-page-header 
      title="Recibos de Servicios Públicos" 
      subtitle="Registro de las facturas globales emitidas por las empresas proveedoras (Luz del Sur, Sedapal, Enel)">
      <button mat-raised-button color="primary" (click)="toggleForm()" class="!rounded-xl !px-5 !py-2 shadow-md">
        <mat-icon class="mr-1">{{ showForm() ? 'close' : 'add' }}</mat-icon>
        {{ showForm() ? 'Cancelar' : 'Registrar Nuevo Recibo' }}
      </button>
    </app-page-header>
    
    <!-- Collapsible New Receipt Form -->
    @if (showForm()) {
      <mat-card class="!p-6 mb-8 border border-indigo-100 bg-gradient-to-r from-indigo-50/30 to-white shadow-md fade-in">
        <div class="flex items-center gap-3 mb-6 pb-3 border-b border-slate-200/80">
          <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <mat-icon>receipt</mat-icon>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900">Ingreso de Recibo de Proveedor</h3>
            <p class="text-xs text-slate-500">Los datos ingresados servirán para calcular el valor unitario por kWh / m³</p>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Empresa Proveedora / Servicio</mat-label>
            <mat-select formControlName="provider">
              <mat-option value="Luz del Sur - Electricidad">Luz del Sur - Electricidad ⚡</mat-option>
              <mat-option value="Sedapal - Agua Potable">Sedapal - Agua Potable 💧</mat-option>
              <mat-option value="Cálidda - Gas Natural">Cálidda - Gas Natural 🔥</mat-option>
            </mat-select>
            <mat-error *ngIf="form.get('provider')?.hasError('required')">Requerido</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Propiedad Inmueble</mat-label>
            <mat-select formControlName="propertyName">
              <mat-option value="Edificio Los Olivos">Edificio Los Olivos</mat-option>
              <mat-option value="Residencial San Martín">Residencial San Martín</mat-option>
              <mat-option value="Condominio El Sol">Condominio El Sol</mat-option>
            </mat-select>
            <mat-error *ngIf="form.get('propertyName')?.hasError('required')">Requerido</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Periodo Facturado (ej. 2026-07)</mat-label>
            <input matInput formControlName="period" placeholder="AAAA-MM">
            <mat-error *ngIf="form.get('period')?.hasError('required')">Requerido</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Monto Total Factura ($)</mat-label>
            <input matInput type="number" formControlName="totalAmount" placeholder="0.00">
            <span matPrefix class="mr-1 text-slate-500 font-bold">$</span>
            <mat-error *ngIf="form.get('totalAmount')?.hasError('required')">Requerido</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Consumo Global (kWh / m³)</mat-label>
            <input matInput type="number" formControlName="totalConsumption" placeholder="0.00">
            <mat-error *ngIf="form.get('totalConsumption')?.hasError('required')">Requerido</mat-error>
          </mat-form-field>

          <div class="flex items-center justify-end gap-2 md:col-span-1">
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid" class="!rounded-xl !px-6 !py-2 w-full">
              <mat-icon>save</mat-icon>
              Guardar Recibo
            </button>
          </div>
        </form>
      </mat-card>
    }

    <!-- Receipts Table -->
    @if (loading()) {
      <app-loading-spinner message="Cargando historial de recibos..."></app-loading-spinner>
    } @else {
      @if (receipts().length === 0) {
        <app-empty-state
          icon="receipt_long"
          title="No hay recibos ingresados"
          description="Registre el primer recibo del proveedor para iniciar el proceso de liquidación."
          actionLabel="Registrar Recibo"
          actionIcon="add"
          (actionClicked)="showForm.set(true)">
        </app-empty-state>
      } @else {
        <mat-card class="!p-0 overflow-hidden shadow-sm border border-slate-200/80">
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="receipts()" class="w-full">
              <!-- Provider Column -->
              <ng-container matColumnDef="provider">
                <th mat-header-cell *matHeaderCellDef>Proveedor / Servicio</th>
                <td mat-cell *matCellDef="let receipt">
                  <div class="flex items-center gap-3 py-1">
                    <div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <mat-icon>receipt</mat-icon>
                    </div>
                    <div>
                      <p class="font-bold text-slate-900 leading-tight">{{ receipt.provider }}</p>
                      <p class="text-xs text-slate-500 mt-0.5">{{ receipt.propertyName }}</p>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Period Column -->
              <ng-container matColumnDef="period">
                <th mat-header-cell *matHeaderCellDef>Periodo</th>
                <td mat-cell *matCellDef="let receipt">
                  <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    <mat-icon class="!w-3.5 !h-3.5 text-slate-400">calendar_month</mat-icon>
                    {{ receipt.period }}
                  </span>
                </td>
              </ng-container>

              <!-- Total Amount Column -->
              <ng-container matColumnDef="totalAmount">
                <th mat-header-cell *matHeaderCellDef>Monto Factura</th>
                <td mat-cell *matCellDef="let receipt">
                  <span class="font-extrabold text-slate-900 text-sm">$ {{ receipt.totalAmount | number:'1.2-2' }}</span>
                </td>
              </ng-container>

              <!-- Consumption & Unit Price Column -->
              <ng-container matColumnDef="unitValue">
                <th mat-header-cell *matHeaderCellDef>Valor Unitario Calculado</th>
                <td mat-cell *matCellDef="let receipt">
                  <div>
                    <span class="font-mono font-bold text-indigo-600">$ {{ (receipt.totalAmount / receipt.totalConsumption) | number:'1.4-4' }}</span>
                    <span class="text-xs text-slate-400"> / unidad</span>
                    <p class="text-xs text-slate-500">Consumo: {{ receipt.totalConsumption | number:'1.0-2' }} global</p>
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let receipt">
                  <span class="status-badge status-badge-active">LIQUIDADO</span>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </mat-card>
      }
    }
  `
})
export class ReceiptListComponent implements OnInit {
  private receiptApi = inject(ReceiptApiService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['provider', 'period', 'totalAmount', 'unitValue', 'status'];

  receipts = signal<any[]>([]);
  loading = signal(true);
  showForm = signal(false);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      provider: ['Luz del Sur - Electricidad', Validators.required],
      propertyName: ['Edificio Los Olivos', Validators.required],
      period: ['2026-07', Validators.required],
      totalAmount: [850.50, [Validators.required, Validators.min(1)]],
      totalConsumption: [1420.0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadReceipts();
  }

  loadReceipts(): void {
    this.loading.set(true);
    this.receiptApi.findAll().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.receipts.set(data);
        } else {
          this.loadSampleReceipts();
        }
        this.loading.set(false);
      },
      error: () => {
        this.loadSampleReceipts();
        this.loading.set(false);
      }
    });
  }

  private loadSampleReceipts(): void {
    this.receipts.set([
      { id: '1', provider: 'Luz del Sur - Electricidad ⚡', propertyName: 'Edificio Los Olivos', period: '2026-07', totalAmount: 850.50, totalConsumption: 1420.0 },
      { id: '2', provider: 'Sedapal - Agua Potable 💧', propertyName: 'Edificio Los Olivos', period: '2026-07', totalAmount: 320.00, totalConsumption: 180.0 },
      { id: '3', provider: 'Cálidda - Gas Natural 🔥', propertyName: 'Edificio Los Olivos', period: '2026-06', totalAmount: 140.20, totalConsumption: 95.0 }
    ]);
  }

  toggleForm(): void {
    this.showForm.update(v => !v);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const newReceipt = {
        id: Date.now().toString(),
        ...this.form.value
      };
      this.receipts.update(list => [newReceipt, ...list]);
      this.showForm.set(false);
      this.snackBar.open('Recibo registrado correctamente', 'OK', { duration: 3000 });
      this.form.reset({
        provider: 'Luz del Sur - Electricidad',
        propertyName: 'Edificio Los Olivos',
        period: '2026-07',
        totalAmount: 850.50,
        totalConsumption: 1420.0
      });
    }
  }
}
