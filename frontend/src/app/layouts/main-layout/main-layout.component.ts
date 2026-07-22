import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule
  ],
  template: `
    <mat-sidenav-container class="h-screen">
      <mat-sidenav #sidenav mode="side" opened class="w-64">
        <div class="p-4">
          <h1 class="text-xl font-bold text-indigo-600">SGCC</h1>
          <p class="text-sm text-gray-500">Sistema de Gestión de Cobros</p>
        </div>
        
        <mat-nav-list>
          <a mat-list-item routerLink="/properties" routerLinkActive="active">
            <mat-icon matListItemIcon>home</mat-icon>
            <span matListItemTitle>Propiedades</span>
          </a>
          <a mat-list-item routerLink="/tenants" routerLinkActive="active">
            <mat-icon matListItemIcon>people</mat-icon>
            <span matListItemTitle>Inquilinos</span>
          </a>
          <a mat-list-item routerLink="/meters" routerLinkActive="active">
            <mat-icon matListItemIcon>speed</mat-icon>
            <span matListItemTitle>Medidores</span>
          </a>
          <a mat-list-item routerLink="/readings" routerLinkActive="active">
            <mat-icon matListItemIcon>receipt_long</mat-icon>
            <span matListItemTitle>Lecturas</span>
          </a>
          <a mat-list-item routerLink="/receipts" routerLinkActive="active">
            <mat-icon matListItemIcon>receipt</mat-icon>
            <span matListItemTitle>Recibos</span>
          </a>
          <a mat-list-item routerLink="/settlements" routerLinkActive="active">
            <mat-icon matListItemIcon>calculate</mat-icon>
            <span matListItemTitle>Liquidaciones</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="sidenav.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="ml-2">SGCC - Sistema de Gestión de Cobros y Consumos</span>
        </mat-toolbar>
        
        <main class="p-6">
          <ng-content></ng-content>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
    
    .active {
      background-color: rgba(63, 81, 181, 0.1);
    }
    
    mat-sidenav {
      background-color: #fafafa;
    }
    
    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }
  `]
})
export class MainLayoutComponent {}
