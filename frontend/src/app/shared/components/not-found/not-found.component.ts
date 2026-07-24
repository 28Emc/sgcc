import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="not-found-host">
      <div class="not-found-icon-wrap">
        <mat-icon class="not-found-icon">explore_off</mat-icon>
      </div>
      <h1 class="not-found-title">404</h1>
      <p class="not-found-subtitle">Página no encontrada</p>
      <p class="not-found-description">
        La ruta que intentaste visitar no existe o fue movida a otra ubicación.
      </p>
      <button mat-raised-button color="primary" (click)="router.navigate(['/dashboard'])">
        <mat-icon>home</mat-icon>
        Volver al Dashboard
      </button>
    </div>
  `,
  styles: [`
    .not-found-host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      padding: 48px 24px;
      text-align: center;
    }

    .not-found-icon-wrap {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background: #fee2e2;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
    }

    .not-found-icon {
      font-size: 44px;
      width: 44px;
      height: 44px;
      color: #dc2626;
    }

    .not-found-title {
      font-size: 3.5rem;
      font-weight: 900;
      color: var(--text-primary);
      margin: 0;
      line-height: 1;
      letter-spacing: -0.05em;
    }

    .not-found-subtitle {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-secondary);
      margin: 8px 0 12px;
    }

    .not-found-description {
      font-size: 0.9rem;
      color: var(--text-muted);
      max-width: 40ch;
      margin: 0 0 32px;
      line-height: 1.6;
    }
  `]
})
export class NotFoundComponent {
  router = inject(Router);
}
