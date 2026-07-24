import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="spinner-host">
      <mat-progress-spinner mode="indeterminate" [diameter]="40"></mat-progress-spinner>
      @if (message) {
        <p class="spinner-message">{{ message }}</p>
      }
    </div>
  `,
  styles: [`
    .spinner-host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 56px 16px;
      gap: 16px;
    }

    .spinner-message {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-weight: 500;
      margin: 0;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() message = 'Cargando información...';
}
