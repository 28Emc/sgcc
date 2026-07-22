import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="page-header">
      <div class="page-header-content">
        <h1 class="page-header-title">{{ title }}</h1>
        @if (subtitle) {
          <p class="page-header-subtitle">{{ subtitle }}</p>
        }
      </div>
      <div class="page-header-actions">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 28px;
      flex-wrap: wrap;
    }

    .page-header-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .page-header-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }

    .page-header-subtitle {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin: 0;
      font-weight: 400;
      max-width: 55ch;
    }

    .page-header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
  `]
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
