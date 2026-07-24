import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  color?: 'primary' | 'warn';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="p-6 max-w-sm">
      <div class="flex items-center gap-3 mb-4">
        <div [class]="data.color === 'warn' ? 'w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center' : 'w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center'">
          <mat-icon>{{ data.color === 'warn' ? 'warning' : 'help_outline' }}</mat-icon>
        </div>
        <h3 class="text-base font-bold text-slate-900">{{ data.title }}</h3>
      </div>
      <p class="text-sm text-slate-600 mb-6 leading-relaxed">{{ data.message }}</p>
      <div class="flex items-center justify-end gap-3">
        <button mat-stroked-button mat-dialog-close class="!rounded-xl">
          {{ data.cancelLabel || 'Cancelar' }}
        </button>
        <button mat-raised-button [color]="data.color === 'warn' ? 'warn' : 'primary'" mat-dialog-close [mat-dialog-close]="true" class="!rounded-xl">
          {{ data.confirmLabel || 'Confirmar' }}
        </button>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}
