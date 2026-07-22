import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="spinner-host">
      <div class="spinner-ring">
        <svg viewBox="25 25 50 50">
          <circle cx="50" cy="50" r="20" fill="none" stroke-width="3.5"></circle>
        </svg>
      </div>
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
      animation: fadeIn 0.3s ease both;
    }

    .spinner-ring {
      width: 44px;
      height: 44px;
      animation: rotate 1.4s linear infinite;
    }

    .spinner-ring svg {
      width: 100%;
      height: 100%;
    }

    .spinner-ring circle {
      stroke: var(--color-primary-500);
      stroke-linecap: round;
      animation: dash 1.4s ease-in-out infinite;
    }

    .spinner-message {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-weight: 500;
      margin: 0;
    }

    @keyframes rotate {
      100% { transform: rotate(360deg); }
    }

    @keyframes dash {
      0%   { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
      50%  { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
      100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() message = 'Cargando información...';
}
