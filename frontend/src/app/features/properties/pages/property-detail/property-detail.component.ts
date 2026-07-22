import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { PropertyApiService, Property } from '../../services/property-api.service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    PageHeaderComponent
  ],
  template: `
    <app-page-header [title]="property()?.name || 'Detalle de Propiedad'" subtitle="Información detallada del inmueble y sus unidades">
      <button mat-button routerLink="/properties" class="!rounded-xl mr-2">
        <mat-icon>arrow_back</mat-icon>
        Volver
      </button>
      <button mat-raised-button color="primary" [routerLink]="['/properties', propertyId, 'edit']" class="!rounded-xl shadow-sm">
        <mat-icon>edit</mat-icon>
        Editar Propiedad
      </button>
    </app-page-header>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- General Info Card -->
      <mat-card class="!p-6 lg:col-span-1 border border-slate-200/80">
        <div class="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shadow-sm">
            <mat-icon class="!w-6 !h-6">apartment</mat-icon>
          </div>
          <div>
            <h2 class="text-lg font-bold text-slate-900 leading-tight">{{ property()?.name }}</h2>
            <span class="status-badge status-badge-active mt-1">ACTIVO</span>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dirección</span>
            <p class="font-medium text-slate-800 text-sm mt-0.5 flex items-center gap-1.5">
              <mat-icon class="!w-4 !h-4 text-xs text-slate-400">location_on</mat-icon>
              {{ property()?.address }}
            </p>
          </div>

          <div>
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Descripción</span>
            <p class="text-sm text-slate-600 mt-0.5">{{ property()?.description || 'Sin descripción adicional.' }}</p>
          </div>

          <div>
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total de Unidades</span>
            <p class="text-sm font-bold text-slate-800 mt-0.5">{{ units().length }} Unidades registradas</p>
          </div>
        </div>
      </mat-card>
      
      <!-- Units & Meters List Card -->
      <div class="lg:col-span-2 space-y-6">
        <mat-card class="!p-6 border border-slate-200/80">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-base font-bold text-slate-900">Unidades Asociadas</h3>
              <p class="text-xs text-slate-500">Departamentos, locales o ambientes configurados</p>
            </div>

            <button mat-stroked-button color="primary" class="!rounded-xl">
              <mat-icon>add</mat-icon>
              Agregar Unidad
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (unit of units(); track unit.id) {
              <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:shadow-sm transition-all">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-bold text-slate-900 text-sm">{{ unit.name }}</span>
                  <span class="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700">Ocupado</span>
                </div>
                <p class="text-xs text-slate-500 mb-3">Inquilino: <strong class="text-slate-700">{{ unit.tenantName }}</strong></p>
                <div class="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-200/60">
                  <span>Área: {{ unit.area }} m²</span>
                  <span>Medidor: {{ unit.meterCode }}</span>
                </div>
              </div>
            }
          </div>
        </mat-card>
      </div>
    </div>
  `
})
export class PropertyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private propertyApi = inject(PropertyApiService);

  propertyId = '';
  property = signal<Property | null>(null);

  units = signal([
    { id: 'u1', name: 'Departamento 101', tenantName: 'Juan Pérez', area: 65, meterCode: 'MED-ELEC-101' },
    { id: 'u2', name: 'Departamento 102', tenantName: 'María García', area: 70, meterCode: 'MED-ELEC-102' },
    { id: 'u3', name: 'Departamento 201', tenantName: 'Carlos Mendoza', area: 65, meterCode: 'MED-ELEC-201' }
  ]);

  ngOnInit(): void {
    this.propertyId = this.route.snapshot.paramMap.get('id') || '1';
    this.loadPropertyDetail();
  }

  loadPropertyDetail(): void {
    this.propertyApi.findById(this.propertyId).subscribe({
      next: (data) => {
        this.property.set(data);
      },
      error: () => {
        // Fallback sample data
        this.property.set({
          id: this.propertyId,
          name: 'Edificio Los Olivos',
          address: 'Av. Las Palmeras 456, Depto 101-302',
          description: 'Edificio multifamiliar de 3 niveles y 5 unidades residenciales independientes.',
          status: 'ACTIVE'
        });
      }
    });
  }
}
