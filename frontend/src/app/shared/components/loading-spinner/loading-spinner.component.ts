import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="flex flex-col items-center justify-center p-8 text-slate-500 fade-in">
      <mat-spinner [diameter]="diameter" color="primary"></mat-spinner>
      <p class="mt-4 text-sm font-medium text-slate-600" *ngIf="message">{{ message }}</p>
    </div>
  `
})
export class LoadingSpinnerComponent {
  @Input() diameter: number = 40;
  @Input() message: string = 'Cargando información...';
}
