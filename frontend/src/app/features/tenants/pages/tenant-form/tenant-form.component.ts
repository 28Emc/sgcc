import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';

@Component({
  selector: 'app-tenant-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    PageHeaderComponent
  ],
  template: `
    <app-page-header title="Nuevo Inquilino" subtitle="Registrar un nuevo inquilino">
    </app-page-header>
    
    <mat-card class="max-w-2xl mx-auto">
      <form [formGroup]="form" class="p-6">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="name" placeholder="Nombre completo">
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Documento</mat-label>
          <input matInput formControlName="documentNumber" placeholder="Número de documento">
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" placeholder="correo@ejemplo.com">
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Teléfono</mat-label>
          <input matInput formControlName="phone" placeholder="Número de teléfono">
        </mat-form-field>
        
        <div class="flex justify-end gap-2 mt-4">
          <button mat-button routerLink="/tenants">Cancelar</button>
          <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="form.invalid">
            Guardar
          </button>
        </div>
      </form>
    </mat-card>
  `
})
export class TenantFormComponent {
  form: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      documentNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
  }
  
  onSubmit() {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
    }
  }
}
