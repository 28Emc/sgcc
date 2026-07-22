import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-medium text-gray-800">{{ title }}</h1>
        <p *ngIf="subtitle" class="text-gray-500 mt-1">{{ subtitle }}</p>
      </div>
      <div class="flex gap-2">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
