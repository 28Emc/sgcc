import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  template: `
    <mat-sidenav-container class="h-screen bg-slate-50">
      <mat-sidenav #sidenav mode="side" opened class="!w-64 !bg-slate-900 !text-white !border-r-0 shadow-xl">
        <div class="flex flex-col h-full">
          <!-- Brand Header -->
          <div class="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <mat-icon class="!w-6 !h-6">account_balance_wallet</mat-icon>
              </div>
              <div>
                <h1 class="text-lg font-bold tracking-tight text-white leading-none">SGCC</h1>
                <p class="text-[11px] text-slate-400 font-medium mt-1">Gestión de Cobros</p>
              </div>
            </div>
          </div>

          <!-- Navigation Links -->
          <div class="px-3 py-4 flex-1 overflow-y-auto space-y-1">
            <p class="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-2">Menú Principal</p>
            
            <a mat-list-item routerLink="/dashboard" routerLinkActive="nav-active" class="nav-item">
              <mat-icon matListItemIcon class="nav-icon">dashboard</mat-icon>
              <span matListItemTitle class="nav-title">Dashboard</span>
            </a>

            <a mat-list-item routerLink="/properties" routerLinkActive="nav-active" class="nav-item">
              <mat-icon matListItemIcon class="nav-icon">apartment</mat-icon>
              <span matListItemTitle class="nav-title">Propiedades</span>
            </a>

            <a mat-list-item routerLink="/tenants" routerLinkActive="nav-active" class="nav-item">
              <mat-icon matListItemIcon class="nav-icon">people_alt</mat-icon>
              <span matListItemTitle class="nav-title">Inquilinos</span>
            </a>

            <p class="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase mt-6 mb-2">Consumos y Servicios</p>

            <a mat-list-item routerLink="/meters" routerLinkActive="nav-active" class="nav-item">
              <mat-icon matListItemIcon class="nav-icon">speed</mat-icon>
              <span matListItemTitle class="nav-title">Medidores</span>
            </a>

            <a mat-list-item routerLink="/readings" routerLinkActive="nav-active" class="nav-item">
              <mat-icon matListItemIcon class="nav-icon">edit_note</mat-icon>
              <span matListItemTitle class="nav-title">Lecturas</span>
            </a>

            <a mat-list-item routerLink="/receipts" routerLinkActive="nav-active" class="nav-item">
              <mat-icon matListItemIcon class="nav-icon">receipt_long</mat-icon>
              <span matListItemTitle class="nav-title">Recibos de Servicios</span>
            </a>

            <p class="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase mt-6 mb-2">Liquidación</p>

            <a mat-list-item routerLink="/settlements" routerLinkActive="nav-active" class="nav-item">
              <mat-icon matListItemIcon class="nav-icon">payments</mat-icon>
              <span matListItemTitle class="nav-title">Liquidaciones</span>
            </a>
          </div>

          <!-- User Footer -->
          <div class="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
              AD
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-slate-200 truncate">Administrador</p>
              <p class="text-xs text-slate-400 truncate">admin&#64;sgcc.com</p>
            </div>
          </div>
        </div>
      </mat-sidenav>

      <mat-sidenav-content class="flex flex-col min-h-screen">
        <!-- Top Toolbar Header -->
        <header class="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 px-6 py-3 flex items-center justify-between shadow-sm">
          <div class="flex items-center gap-3">
            <button mat-icon-button (click)="sidenav.toggle()" class="!text-slate-600 hover:!bg-slate-100">
              <mat-icon>menu</mat-icon>
            </button>
            <div class="hidden sm:block">
              <span class="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">SGCC Cloud Lab v1.0</span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button mat-icon-button class="!text-slate-600">
              <mat-icon>notifications_none</mat-icon>
            </button>
            <button mat-icon-button class="!text-slate-600">
              <mat-icon>settings</mat-icon>
            </button>
          </div>
        </header>

        <!-- Main Workspace Content -->
        <main class="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto fade-in">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .nav-item {
      border-radius: 0.75rem !important;
      color: #94a3b8 !important;
      margin-bottom: 2px;
      transition: all 0.2s ease;
    }
    
    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.05) !important;
      color: #f8fafc !important;
    }
    
    .nav-active {
      background: linear-gradient(to right, #3b82f6, #4f46e5) !important;
      color: #ffffff !important;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
    }

    .nav-active .nav-icon {
      color: #ffffff !important;
    }

    .nav-icon {
      color: #64748b !important;
    }

    .nav-title {
      font-size: 0.875rem !important;
      font-weight: 500 !important;
    }
  `]
})
export class MainLayoutComponent {}
