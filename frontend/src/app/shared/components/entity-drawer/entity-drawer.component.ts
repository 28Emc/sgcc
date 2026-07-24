import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-entity-drawer',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDividerModule],
  template: `
    <div class="drawer-header">
      <div class="drawer-header-text">
        <h2 class="drawer-title">{{ title }}</h2>
        @if (subtitle) {
          <p class="drawer-subtitle">{{ subtitle }}</p>
        }
      </div>
      <button mat-icon-button (click)="close.emit()" class="drawer-close" title="Cerrar">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-divider></mat-divider>

    <div class="drawer-body">
      <!-- Summary slot (top: avatar, key info) -->
      @if (summaryTpl) {
        <div class="drawer-section">
          <ng-container *ngTemplateOutlet="summaryTpl"></ng-container>
        </div>
        <mat-divider></mat-divider>
      }

      <!-- Details slot (main fields grid) -->
      @if (detailsTpl) {
        <div class="drawer-section">
          <div class="drawer-section-header">
            <mat-icon>info</mat-icon>
            <h4>Detalles</h4>
          </div>
          <ng-container *ngTemplateOutlet="detailsTpl"></ng-container>
        </div>
      }

      <!-- Custom content slot -->
      @if (contentTpl) {
        <ng-container *ngTemplateOutlet="contentTpl"></ng-container>
      }

      <!-- Actions slot (bottom: buttons) -->
      @if (actionsTpl) {
        <mat-divider></mat-divider>
        <div class="drawer-actions">
          <ng-container *ngTemplateOutlet="actionsTpl"></ng-container>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .drawer-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      padding: 20px 20px 12px;
    }

    .drawer-header-text {
      flex: 1;
      min-width: 0;
    }

    .drawer-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      line-height: 1.3;
    }

    .drawer-subtitle {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin: 4px 0 0;
      line-height: 1.4;
    }

    .drawer-close {
      flex-shrink: 0;
    }

    .drawer-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px 20px 20px;
    }

    .drawer-section {
      margin-bottom: 20px;
    }

    .drawer-section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 14px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--surface-border-light);
    }

    .drawer-section-header mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--color-primary-500);
    }

    .drawer-section-header h4 {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
      margin: 0;
    }

    .drawer-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
      margin-top: 16px;
    }
  `]
})
export class EntityDrawerComponent {
  @Input() title = '';
  @Input() subtitle = '';

  @Input() summaryTpl: TemplateRef<any> | null = null;
  @Input() detailsTpl: TemplateRef<any> | null = null;
  @Input() contentTpl: TemplateRef<any> | null = null;
  @Input() actionsTpl: TemplateRef<any> | null = null;

  @Output() close = new EventEmitter<void>();
}
