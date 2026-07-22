import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent
  ],
  template: `
    <app-page-header title="Detalle de Propiedad" subtitle="Información de la propiedad">
      <button mat-button routerLink="/properties">
        <mat-icon>arrow_back</mat-icon>
        Volver
      </button>
      <button mat-raised-button color="primary" routerLink="edit">
        <mat-icon>edit</mat-icon>
        Editar
      </button>
    </app-page-header>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Información General</mat-card-title>
        </mat-card-header>
        <mat-card-content class="p-4">
          <div class="space-y-4">
            <div>
              <span class="text-gray-500 text-sm">Nombre</span>
              <p class="font-medium">Propiedad Ejemplo</p>
            </div>
            <div>
              <span class="text-gray-500 text-sm">Dirección</span>
              <p class="font-medium">Calle Principal 123</p>
            </div>
            <div>
              <span class="text-gray-500 text-sm">Descripción</span>
              <p class="font-medium">Propiedad de ejemplo para testing</p>
            </div>
            <div>
              <span class="text-gray-500 text-sm">Estado</span>
              <p class="font-medium text-green-600">ACTIVE</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
      
      <mat-card>
        <mat-card-header>
          <mat-card-title>Unidades</mat-card-title>
        </mat-card-header>
        <mat-card-content class="p-4">
          <p class="text-gray-500">5 unidades registradas</p>
          <button mat-button color="primary" class="mt-2">
            <mat-icon>add</mat-icon>
            Agregar Unidad
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class PropertyDetailComponent {}
