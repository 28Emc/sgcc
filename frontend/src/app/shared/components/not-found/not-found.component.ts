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
      <button class="not-found-action" (click)="router.navigate(['/dashboard'])">
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
      background: linear-gradient(135deg, #fee2e2, #fecaca);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      border: 2px solid #fca5a5;
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
      color: #1e293b;
      margin: 0;
      line-height: 1;
      letter-spacing: -0.05em;
    }

    .not-found-subtitle {
      font-size: 1.25rem;
      font-weight: 700;
      color: #334155;
      margin: 8px 0 12px;
    }

    .not-found-description {
      font-size: 0.9rem;
      color: #64748b;
      max-width: 40ch;
      margin: 0 0 32px;
      line-height: 1.6;
    }

    .not-found-action {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 28px;
      background: linear-gradient(135deg, #4f46e5, #4338ca);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .not-found-action:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(79, 70, 229, 0.45);
    }
  `]
})
export class NotFoundComponent {
  router = inject(Router);
}
