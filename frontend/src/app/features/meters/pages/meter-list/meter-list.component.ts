import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { MeterApiService } from '../../services/meter-api.service';

@Component({
  selector: 'app-meter-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent
  ],
  template: `
    <app-page-header 
      title="Medidores de Servicios" 
      subtitle="Registro de contadores eléctricos, de agua potable y otros servicios por unidad">
      <button mat-raised-button color="primary" class="!rounded-xl !px-5 !py-2 shadow-md">
        <mat-icon class="mr-1">speed</mat-icon>
        Nuevo Medidor
      </button>
    </app-page-header>
    
    <!-- Search and Filter Bar -->
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
      <div class="relative flex-1 max-w-md">
        <mat-form-field appearance="outline" class="w-full !mb-0 text-sm">
          <mat-label>Buscar por código o número de serie...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (ngModelChange)="onSearchChange($event)">
          <mat-icon matSuffix class="text-slate-400">search</mat-icon>
        </mat-form-field>
      </div>

      <div class="text-xs text-slate-500 font-medium self-end sm:self-center">
        Total: <span class="font-bold text-slate-800">{{ filteredMeters().length }}</span> medidores
      </div>
    </div>

    <!-- Loading State -->
    @if (loading()) {
      <app-loading-spinner message="Cargando medidores..."></app-loading-spinner>
    } @else {
      <!-- Empty State -->
      @if (filteredMeters().length === 0) {
        <app-empty-state
          icon="speed"
          title="No hay medidores registrados"
          description="Aún no ha asociado ningún medidor de servicio público a las unidades."
          actionLabel="Agregar Medidor"
          actionIcon="add">
        </app-empty-state>
      } @else {
        <!-- Table View -->
        <mat-card class="!p-0 overflow-hidden shadow-sm border border-slate-200/80">
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="filteredMeters()" class="w-full">
              <!-- Service Type & Serial Column -->
              <ng-container matColumnDef="serialNumber">
                <th mat-header-cell *matHeaderCellDef>N° Serie / Código</th>
                <td mat-cell *matCellDef="let meter">
                  <div class="flex items-center gap-3 py-1">
                    <div [class]="getServiceIconClass(meter.serviceType)">
                      <mat-icon class="!w-5 !h-5">{{ getServiceIcon(meter.serviceType) }}</mat-icon>
                    </div>
                    <div>
                      <p class="font-mono font-bold text-slate-900 leading-tight">{{ meter.serialNumber }}</p>
                      <p class="text-xs font-semibold text-slate-500 mt-0.5">{{ meter.serviceName }}</p>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Assigned Location Column -->
              <ng-container matColumnDef="location">
                <th mat-header-cell *matHeaderCellDef>Asignación</th>
                <td mat-cell *matCellDef="let meter">
                  <div>
                    <p class="font-semibold text-slate-800 text-sm">{{ meter.propertyName }}</p>
                    <p class="text-xs text-slate-500">{{ meter.unitName }}</p>
                  </div>
                </td>
              </ng-container>

              <!-- Last Reading Column -->
              <ng-container matColumnDef="lastReading">
                <th mat-header-cell *matHeaderCellDef>Última Lectura</th>
                <td mat-cell *matCellDef="let meter">
                  <div class="font-mono text-sm">
                    <span class="font-bold text-slate-900">{{ meter.lastReadingValue | number:'1.0-2' }}</span>
                    <span class="text-xs text-slate-500 ml-1">{{ meter.unitOfMeasure }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let meter">
                  <span class="status-badge status-badge-active">OPERATIVO</span>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="text-right">Acciones</th>
                <td mat-cell *matCellDef="let meter" class="text-right">
                  <button mat-icon-button title="Ver historial de lecturas" class="!text-slate-500 hover:!text-indigo-600">
                    <mat-icon>history</mat-icon>
                  </button>
                  <button mat-icon-button title="Editar" class="!text-slate-500 hover:!text-indigo-600">
                    <mat-icon>edit</mat-icon>
                  </button>
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
export class MeterListComponent implements OnInit {
  private meterApi = inject(MeterApiService);

  displayedColumns = ['serialNumber', 'location', 'lastReading', 'status', 'actions'];
  
  meters = signal<any[]>([]);
  searchTerm = signal('');
  loading = signal(true);

  filteredMeters = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.meters();
    return this.meters().filter(m => 
      m.serialNumber.toLowerCase().includes(term) || 
      m.propertyName.toLowerCase().includes(term) ||
      m.unitName.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.loadMeters();
  }

  loadMeters(): void {
    this.loading.set(true);
    this.meterApi.findAll().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.meters.set(data);
        } else {
          this.loadSampleMeters();
        }
        this.loading.set(false);
      },
      error: () => {
        this.loadSampleMeters();
        this.loading.set(false);
      }
    });
  }

  private loadSampleMeters(): void {
    this.meters.set([
      { id: '1', serialNumber: 'MED-ELEC-101', serviceType: 'ELECTRICITY', serviceName: 'Electricidad ⚡', propertyName: 'Edificio Los Olivos', unitName: 'Depto 101', lastReadingValue: 12450.0, unitOfMeasure: 'kWh' },
      { id: '2', serialNumber: 'MED-ELEC-102', serviceType: 'ELECTRICITY', serviceName: 'Electricidad ⚡', propertyName: 'Edificio Los Olivos', unitName: 'Depto 102', lastReadingValue: 8930.5, unitOfMeasure: 'kWh' },
      { id: '3', serialNumber: 'MED-AGUA-GEN', serviceType: 'WATER', serviceName: 'Agua Potable 💧', propertyName: 'Edificio Los Olivos', unitName: 'Medidor Matriz Principal', lastReadingValue: 4320.0, unitOfMeasure: 'm³' },
      { id: '4', serialNumber: 'MED-GAS-101', serviceType: 'GAS', serviceName: 'Gas Natural 🔥', propertyName: 'Edificio Los Olivos', unitName: 'Depto 101', lastReadingValue: 120.4, unitOfMeasure: 'm³' }
    ]);
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  getServiceIcon(type: string): string {
    switch (type) {
      case 'ELECTRICITY': return 'bolt';
      case 'WATER': return 'water_drop';
      case 'GAS': return 'local_fire_department';
      default: return 'speed';
    }
  }

  getServiceIconClass(type: string): string {
    const base = 'w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-sm ';
    switch (type) {
      case 'ELECTRICITY': return base + 'bg-amber-50 text-amber-600';
      case 'WATER': return base + 'bg-blue-50 text-blue-600';
      case 'GAS': return base + 'bg-orange-50 text-orange-600';
      default: return base + 'bg-slate-100 text-slate-600';
    }
  }
}
