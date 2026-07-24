import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drawer-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="drawer-field" [class.drawer-field-inline]="inline">
      <span class="drawer-field-label">{{ label }}</span>
      <span class="drawer-field-value">
        <ng-content></ng-content>
      </span>
    </div>
  `,
  styles: [`
    .drawer-field {
      margin-bottom: 14px;
    }

    .drawer-field-label {
      display: block;
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 3px;
    }

    .drawer-field-value {
      display: block;
      font-size: 0.875rem;
      color: var(--text-primary);
      font-weight: 500;
      line-height: 1.5;
    }

    .drawer-field-inline {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
    }

    .drawer-field-inline .drawer-field-label {
      margin-bottom: 0;
    }
  `]
})
export class DrawerFieldComponent {
  @Input() label = '';
  @Input() inline = false;
}
