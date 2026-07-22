import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-12 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl my-4 fade-in">
      <div class="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-sm">
        <mat-icon class="!w-8 !h-8 text-3xl">{{ icon }}</mat-icon>
      </div>
      <h3 class="text-lg font-semibold text-slate-800 mb-1">{{ title }}</h3>
      <p class="text-sm text-slate-500 max-w-sm mb-6">{{ description }}</p>
      <button 
        *ngIf="actionLabel" 
        mat-raised-button 
        color="primary" 
        (click)="actionClicked.emit()"
        class="!rounded-xl !px-6 !py-2">
        <mat-icon *ngIf="actionIcon">{{ actionIcon }}</mat-icon>
        {{ actionLabel }}
      </button>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() icon: string = 'inbox';
  @Input() title: string = 'No hay registros';
  @Input() description: string = 'Aún no se ha agregado información en esta sección.';
  @Input() actionLabel?: string;
  @Input() actionIcon?: string;

  @Output() actionClicked = new EventEmitter<void>();
}
