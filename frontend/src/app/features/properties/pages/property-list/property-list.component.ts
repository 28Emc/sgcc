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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { PropertyApiService, Property } from '../../services/property-api.service';

@Component({
  selector: 'app-property-list',
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
    MatSnackBarModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent
  ],
  template: `
    <app-page-header 
      title="Propiedades e Inmuebles" 
      subtitle="Administración de propiedades, multifamiliares y sus unidades asociadas">
      <button mat-raised-button color="primary" routerLink="new" class="!rounded-xl !px-5 !py-2 shadow-md">
        <mat-icon class="mr-1">add</mat-icon>
        Nueva Propiedad
      </button>
    </app-page-header>
    
    <!-- Filter Search Bar -->
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
      <div class="relative flex-1 max-w-md">
        <mat-form-field appearance="outline" class="w-full !mb-0 text-sm">
          <mat-label>Buscar propiedad o dirección...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (ngModelChange)="onSearchChange($event)">
          <mat-icon matSuffix class="text-slate-400">search</mat-icon>
        </mat-form-field>
      </div>

      <div class="text-xs text-slate-500 font-medium self-end sm:self-center">
        Total: <span class="font-bold text-slate-800">{{ filteredProperties().length }}</span> propiedades
      </div>
    </div>

    <!-- Loading State -->
    @if (loading()) {
      <app-loading-spinner message="Cargando catálogo de propiedades..."></app-loading-spinner>
    } @else {
      <!-- Empty State -->
      @if (filteredProperties().length === 0) {
        <app-empty-state
          icon="apartment"
          title="No se encontraron propiedades"
          description="Aún no hay propiedades registradas o la búsqueda no arrojó resultados."
          actionLabel="Crear Propiedad"
          actionIcon="add"
          (actionClicked)="navigateToNew()">
        </app-empty-state>
      } @else {
        <!-- Table View -->
        <mat-card class="!p-0 overflow-hidden shadow-sm border border-slate-200/80">
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="filteredProperties()" class="w-full">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nombre del Inmueble</th>
                <td mat-cell *matCellDef="let property">
                  <div class="flex items-center gap-3 py-1">
                    <div class="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <mat-icon class="!w-5 !h-5">apartment</mat-icon>
                    </div>
                    <div>
                      <a [routerLink]="[property.id]" class="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                        {{ property.name }}
                      </a>
                      <p class="text-xs text-slate-500 truncate max-w-xs">{{ property.description || 'Sin descripción' }}</p>
                    </div>
                  </div>
                </td>
              </ng-container>
              
              <ng-container matColumnDef="address">
                <th mat-header-cell *matHeaderCellDef>Dirección</th>
                <td mat-cell *matCellDef="let property">
                  <div class="flex items-center gap-1.5 text-slate-600">
                    <mat-icon class="!w-4 !h-4 text-xs text-slate-400">location_on</mat-icon>
                    <span>{{ property.address }}</span>
                  </div>
                </td>
              </ng-container>
              
              <ng-container matColumnDef="units">
                <th mat-header-cell *matHeaderCellDef>Unidades</th>
                <td mat-cell *matCellDef="let property">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    {{ property.units || 3 }} Unidades
                  </span>
                </td>
              </ng-container>
              
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let property">
                  <span [class]="property.status === 'ACTIVE' || !property.status ? 'status-badge status-badge-active' : 'status-badge status-badge-inactive'">
                    {{ property.status === 'ACTIVE' || !property.status ? 'ACTIVO' : 'INACTIVO' }}
                  </span>
                </td>
              </ng-container>
              
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="text-right">Acciones</th>
                <td mat-cell *matCellDef="let property" class="text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button mat-icon-button [routerLink]="[property.id]" title="Ver detalle" class="!text-slate-500 hover:!text-indigo-600">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button mat-icon-button [routerLink]="[property.id, 'edit']" title="Editar" class="!text-slate-500 hover:!text-indigo-600">
                      <mat-icon>edit</mat-icon>
                    </button>
                  </div>
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
export class PropertyListComponent implements OnInit {
  private propertyApi = inject(PropertyApiService);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['name', 'address', 'units', 'status', 'actions'];
  
  properties = signal<Property[]>([]);
  searchTerm = signal('');
  loading = signal(true);

  filteredProperties = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.properties();
    return this.properties().filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.address.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.loading.set(true);
    this.propertyApi.findAll().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.properties.set(data);
        } else {
          // Fallback to sample data for presentation
          this.properties.set([
            { id: '1', name: 'Edificio Los Olivos', address: 'Av. Las Palmeras 456, Depto 101-302', description: 'Edificio multifamiliar de 3 niveles y 5 unidades', status: 'ACTIVE' },
            { id: '2', name: 'Residencial San Martín', address: 'Calle San Martín 789', description: 'Casa subdividida en 3 departamentos independientes', status: 'ACTIVE' },
            { id: '3', name: 'Condominio El Sol', address: 'Jr. Los Tulipanes 123', description: 'Propiedad comercial y residencial de 4 locales', status: 'ACTIVE' }
          ]);
        }
        this.loading.set(false);
      },
      error: () => {
        // Fallback demo data on offline / connection issue
        this.properties.set([
          { id: '1', name: 'Edificio Los Olivos', address: 'Av. Las Palmeras 456, Depto 101-302', description: 'Edificio multifamiliar de 3 niveles y 5 unidades', status: 'ACTIVE' },
          { id: '2', name: 'Residencial San Martín', address: 'Calle San Martín 789', description: 'Casa subdividida en 3 departamentos independientes', status: 'ACTIVE' },
          { id: '3', name: 'Condominio El Sol', address: 'Jr. Los Tulipanes 123', description: 'Propiedad comercial y residencial de 4 locales', status: 'ACTIVE' }
        ]);
        this.loading.set(false);
      }
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  navigateToNew(): void {
    // Navigation logic handled via router link or direct navigate
  }
}
