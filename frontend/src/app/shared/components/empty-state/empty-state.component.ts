import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="empty-host">
      <div class="empty-icon-wrap">
        <mat-icon class="empty-icon">{{ icon }}</mat-icon>
      </div>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-description">{{ description }}</p>
      @if (actionLabel) {
        <button class="empty-action" (click)="actionClicked.emit()">
          @if (actionIcon) {
            <mat-icon>{{ actionIcon }}</mat-icon>
          }
          {{ actionLabel }}
        </button>
      }
    </div>
  `,
  styles: [`
    .empty-host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 24px;
      text-align: center;
      background: white;
      border-radius: var(--radius-xl);
      border: 2px dashed var(--surface-border);
      animation: fadeIn 0.35s ease both;
    }

    .empty-icon-wrap {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: var(--color-primary-50);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      border: 1px solid var(--color-primary-100);
    }

    .empty-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: var(--color-primary-500);
    }

    .empty-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 8px;
    }

    .empty-description {
      font-size: 0.875rem;
      color: var(--text-muted);
      max-width: 36ch;
      margin: 0 0 28px;
      line-height: 1.6;
    }

    .empty-action {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 24px;
      background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700));
      color: white;
      border: none;
      border-radius: var(--radius-lg);
      font-size: 0.875rem;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .empty-action:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
    }

    .empty-action mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = 'No hay registros';
  @Input() description = 'Aún no se ha agregado información en esta sección.';
  @Input() actionLabel?: string;
  @Input() actionIcon?: string;
  @Output() actionClicked = new EventEmitter<void>();
}
