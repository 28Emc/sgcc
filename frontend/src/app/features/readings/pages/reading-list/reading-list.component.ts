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
import { ReadingApiService } from '../../services/reading-api.service';

@Component({
  selector: 'app-reading-list',
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
      title="Lecturas de Medidores" 
      subtitle="Registro mensual de toma de lecturas por departamento o medidor general">
      <button mat-raised-button color="primary" (click)="toggleForm()" class="!rounded-xl !px-5 !py-2 shadow-md">
        <mat-icon class="mr-1">{{ showForm() ? 'close' : 'edit_note' }}</mat-icon>
        {{ showForm() ? 'Cancelar' : 'Capturar Nueva Lectura' }}
      </button>
    </app-page-header>

    <!-- Form for Capturing New Reading -->
    @if (showForm()) {
      <mat-card class="!p-6 mb-8 border border-blue-100 bg-gradient-to-r from-blue-50/30 to-white shadow-md fade-in">
        <div class="flex items-center gap-3 mb-6 pb-3 border-b border-slate-200/80">
          <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <mat-icon>speed</mat-icon>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900">Registro de Toma de Lectura</h3>
            <p class="text-xs text-slate-500">Ingrese la lectura física actual tomada del medidor de la unidad</p>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <mat-form-field appearance="outline" class="w-full md:col-span-2">
            <mat-label>Seleccionar Medidor / Unidad</mat-label>
            <mat-select formControlName="meterSerial" (selectionChange)="onMeterSelected($event.value)">
              <mat-option value="MED-ELEC-101">MED-ELEC-101 - Depto 101 (Juan Pérez)</mat-option>
              <mat-option value="MED-ELEC-102">MED-ELEC-102 - Depto 102 (María García)</mat-option>
              <mat-option value="MED-ELEC-201">MED-ELEC-201 - Depto 201 (Carlos Mendoza)</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Lectura Anterior</mat-label>
            <input matInput type="number" formControlName="previousValue" readonly class="!bg-slate-100 font-bold">
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Lectura Actual Tomada</mat-label>
            <input matInput type="number" formControlName="currentValue" (input)="calculateConsumption()">
            <mat-error *ngIf="form.get('currentValue')?.hasError('required')">Requerido</mat-error>
          </mat-form-field>

          <!-- Calculated Net Consumption Box -->
          <div class="md:col-span-3 p-4 rounded-xl bg-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-2 text-slate-700 font-medium text-sm">
              <mat-icon class="text-indigo-600">calculate</mat-icon>
              <span>Consumo Neto Calculado:</span>
            </div>
            <div class="text-xl font-extrabold text-indigo-700 font-mono">
              {{ calculatedConsumption() | number:'1.0-2' }} <span class="text-xs text-slate-500 font-normal">units</span>
            </div>
          </div>

          <div class="md:col-span-1 flex items-center">
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || calculatedConsumption() < 0" class="!rounded-xl !py-3.5 w-full shadow-sm">
              <mat-icon>save</mat-icon>
              Guardar Lectura
            </button>
          </div>
        </form>
      </mat-card>
    }

    <!-- Readings Table -->
    @if (loading()) {
      <app-loading-spinner message="Cargando historial de lecturas..."></app-loading-spinner>
    } @else {
      @if (readings().length === 0) {
        <app-empty-state
          icon="edit_note"
          title="No hay lecturas registradas"
          description="Aún no ha ingresado la primera lectura del mes."
          actionLabel="Capturar Lectura"
          actionIcon="add"
          (actionClicked)="showForm.set(true)">
        </app-empty-state>
      } @else {
        <mat-card class="!p-0 overflow-hidden shadow-sm border border-slate-200/80">
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="readings()" class="w-full">
              <!-- Meter & Tenant Column -->
              <ng-container matColumnDef="meter">
                <th mat-header-cell *matHeaderCellDef>Medidor / Inquilino</th>
                <td mat-cell *matCellDef="let r">
                  <div class="flex items-center gap-3 py-1">
                    <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <mat-icon>speed</mat-icon>
                    </div>
                    <div>
                      <p class="font-bold text-slate-900 leading-tight font-mono">{{ r.meterSerial }}</p>
                      <p class="text-xs text-slate-500 mt-0.5">{{ r.tenantName }} ({{ r.unitName }})</p>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Readings Comparison Column -->
              <ng-container matColumnDef="readingsComparison">
                <th mat-header-cell *matHeaderCellDef>Anterior vs. Actual</th>
                <td mat-cell *matCellDef="let r">
                  <div class="font-mono text-xs">
                    <span class="text-slate-400">{{ r.previousValue }}</span>
                    <mat-icon class="!w-3 !h-3 text-slate-400 mx-1 align-middle">arrow_forward</mat-icon>
                    <span class="font-bold text-slate-900 text-sm">{{ r.currentValue }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Net Consumption Column -->
              <ng-container matColumnDef="netConsumption">
                <th mat-header-cell *matHeaderCellDef>Consumo Generado</th>
                <td mat-cell *matCellDef="let r">
                  <span class="inline-flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 font-mono text-sm">
                    <mat-icon class="!w-4 !h-4 text-indigo-500">bolt</mat-icon>
                    +{{ r.currentValue - r.previousValue | number:'1.0-2' }} kWh
                  </span>
                </td>
              </ng-container>

              <!-- Date Column -->
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Fecha de Toma</th>
                <td mat-cell *matCellDef="let r">
                  <span class="text-xs text-slate-600 font-medium">{{ r.readingDate }}</span>
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
export class ReadingListComponent implements OnInit {
  private readingApi = inject(ReadingApiService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['meter', 'readingsComparison', 'netConsumption', 'date'];

  readings = signal<any[]>([]);
  loading = signal(true);
  showForm = signal(false);
  calculatedConsumption = signal(0);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      meterSerial: ['MED-ELEC-101', Validators.required],
      previousValue: [12150.0, Validators.required],
      currentValue: [12450.0, Validators.required],
      readingDate: ['2026-07-20', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadReadings();
    this.calculateConsumption();
  }

  loadReadings(): void {
    this.loading.set(true);
    this.readingApi.findAll().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.readings.set(data);
        } else {
          this.loadSampleReadings();
        }
        this.loading.set(false);
      },
      error: () => {
        this.loadSampleReadings();
        this.loading.set(false);
      }
    });
  }

  private loadSampleReadings(): void {
    this.readings.set([
      { id: '1', meterSerial: 'MED-ELEC-101', tenantName: 'Juan Pérez', unitName: 'Depto 101', previousValue: 12150.0, currentValue: 12450.0, readingDate: '2026-07-20' },
      { id: '2', meterSerial: 'MED-ELEC-102', tenantName: 'María García', unitName: 'Depto 102', previousValue: 8610.0, currentValue: 8930.5, readingDate: '2026-07-20' },
      { id: '3', meterSerial: 'MED-ELEC-201', tenantName: 'Carlos Mendoza', tenantUnit: 'Depto 201', previousValue: 5400.0, currentValue: 5610.0, readingDate: '2026-07-20' }
    ]);
  }

  toggleForm(): void {
    this.showForm.update(v => !v);
  }

  onMeterSelected(val: string): void {
    if (val === 'MED-ELEC-101') this.form.patchValue({ previousValue: 12150.0, currentValue: 12450.0 });
    if (val === 'MED-ELEC-102') this.form.patchValue({ previousValue: 8610.0, currentValue: 8930.5 });
    if (val === 'MED-ELEC-201') this.form.patchValue({ previousValue: 5400.0, currentValue: 5610.0 });
    this.calculateConsumption();
  }

  calculateConsumption(): void {
    const prev = this.form.get('previousValue')?.value || 0;
    const curr = this.form.get('currentValue')?.value || 0;
    this.calculatedConsumption.set(Math.max(0, curr - prev));
  }

  onSubmit(): void {
    if (this.form.valid && this.calculatedConsumption() >= 0) {
      const val = this.form.value;
      const newReading = {
        id: Date.now().toString(),
        meterSerial: val.meterSerial,
        tenantName: val.meterSerial === 'MED-ELEC-101' ? 'Juan Pérez' : 'María García',
        unitName: 'Depto Alquilado',
        previousValue: val.previousValue,
        currentValue: val.currentValue,
        readingDate: new Date().toISOString().split('T')[0]
      };
      this.readings.update(list => [newReading, ...list]);
      this.showForm.set(false);
      this.snackBar.open('Lectura física registrada correctamente', 'OK', { duration: 3000 });
    }
  }
}
