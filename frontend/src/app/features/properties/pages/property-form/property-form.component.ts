import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent
  ],
  template: `
    <app-page-header title="Nueva Propiedad" subtitle="Crear una nueva propiedad">
    </app-page-header>
    
    <mat-card class="max-w-2xl mx-auto">
      <form [formGroup]="form" class="p-6">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="name" placeholder="Nombre de la propiedad">
          <mat-error *ngIf="form.get('name')?.hasError('required')">
            El nombre es requerido
          </mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Dirección</mat-label>
          <textarea matInput formControlName="address" rows="2" placeholder="Dirección completa"></textarea>
          <mat-error *ngIf="form.get('address')?.hasError('required')">
            La dirección es requerida
          </mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Descripción opcional"></textarea>
        </mat-form-field>
        
        <div class="flex justify-end gap-2 mt-4">
          <button mat-button routerLink="/properties">Cancelar</button>
          <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="form.invalid">
            <mat-icon>save</mat-icon>
            Guardar
          </button>
        </div>
      </form>
    </mat-card>
  `
})
export class PropertyFormComponent {
  form: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      description: ['']
    });
  }
  
  onSubmit() {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
    }
  }
}
