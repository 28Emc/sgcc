import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, RouterLinkActive, MatIconModule, MatButtonModule, MatRippleModule],
  template: `
    <div class="app-shell">
      <!-- ════ SIDEBAR ════ -->
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed()">
        <!-- Brand -->
        <div class="sidebar-brand">
          <div class="brand-logo">
            <mat-icon>account_balance_wallet</mat-icon>
          </div>
          @if (!sidebarCollapsed()) {
            <div class="brand-text">
              <span class="brand-name">SGCC</span>
              <span class="brand-sub">Gestión de Cobros</span>
            </div>
          }
        </div>

        <!-- Navigation -->
        <nav class="sidebar-nav">
          @for (group of navGroups; track group.label) {
            @if (!sidebarCollapsed()) {
              <p class="nav-group-label">{{ group.label }}</p>
            }
            @for (item of group.items; track item.route) {
              <a
                [routerLink]="item.route"
                routerLinkActive="nav-link-active"
                class="nav-link"
                [title]="sidebarCollapsed() ? item.label : ''"
                matRipple
                [matRippleColor]="'rgba(255,255,255,0.06)'"
              >
                <mat-icon class="nav-link-icon">{{ item.icon }}</mat-icon>
                @if (!sidebarCollapsed()) {
                  <span class="nav-link-label">{{ item.label }}</span>
                }
              </a>
            }
          }
        </nav>

        <!-- User Footer -->
        <div class="sidebar-footer">
          <div class="user-avatar">AD</div>
          @if (!sidebarCollapsed()) {
            <div class="user-info">
              <span class="user-name">Administrador</span>
              <span class="user-role">admin&#64;sgcc.com</span>
            </div>
          }
        </div>
      </aside>

      <!-- ════ MAIN AREA ════ -->
      <div class="main-area">
        <!-- Top Header -->
        <header class="app-header">
          <div class="header-left">
            <button class="header-toggle" (click)="sidebarCollapsed.update(v => !v)" title="Alternar menú">
              <mat-icon>{{ sidebarCollapsed() ? 'menu_open' : 'menu' }}</mat-icon>
            </button>
            <span class="header-badge">SGCC v1.0</span>
          </div>
          <div class="header-right">
            <button class="header-action" title="Notificaciones">
              <mat-icon>notifications_none</mat-icon>
            </button>
            <button class="header-action" title="Configuración">
              <mat-icon>settings</mat-icon>
            </button>
          </div>
        </header>

        <!-- Page Content -->
        <main class="page-wrapper fade-in">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    /* ── Shell layout ── */
    .app-shell {
      display: flex;
      height: 100vh;
      overflow: hidden;
      background: var(--surface-bg);
    }

    /* ── Sidebar ── */
    .sidebar {
      width: var(--sidebar-width);
      min-width: var(--sidebar-width);
      background: var(--sidebar-bg);
      display: flex;
      flex-direction: column;
      transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                  min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      flex-shrink: 0;
      z-index: 100;
      box-shadow: 4px 0 24px rgba(0,0,0,0.15);
    }

    .sidebar.collapsed {
      width: 68px;
      min-width: 68px;
    }

    /* Brand */
    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 16px;
      border-bottom: 1px solid var(--sidebar-border);
      min-height: 72px;
      flex-shrink: 0;
    }

    .brand-logo {
      width: 38px;
      height: 38px;
      flex-shrink: 0;
      border-radius: 10px;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    }

    .brand-logo mat-icon {
      color: white;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .brand-name {
      font-size: 1rem;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.01em;
      line-height: 1.2;
    }

    .brand-sub {
      font-size: 0.68rem;
      color: var(--sidebar-text);
      font-weight: 500;
      margin-top: 1px;
      white-space: nowrap;
    }

    /* Nav */
    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: 12px 10px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-group-label {
      font-size: 0.63rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #475569;
      padding: 16px 8px 6px;
      margin: 0;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 9px 10px;
      border-radius: 8px;
      color: var(--sidebar-text);
      text-decoration: none;
      transition: background 0.15s ease, color 0.15s ease;
      position: relative;
      overflow: hidden;
      white-space: nowrap;
    }

    .nav-link:hover {
      background: var(--sidebar-hover-bg);
      color: #e2e8f0;
    }

    .nav-link-active {
      background: rgba(99, 102, 241, 0.16) !important;
      color: #a5b4fc !important;
      border-left: 3px solid var(--color-primary-500);
      padding-left: 7px;
    }

    .nav-link-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .nav-link-label {
      font-size: 0.845rem;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Footer */
    .sidebar-footer {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      border-top: 1px solid var(--sidebar-border);
      background: rgba(0,0,0,0.15);
      flex-shrink: 0;
    }

    .user-avatar {
      width: 34px;
      height: 34px;
      flex-shrink: 0;
      border-radius: 50%;
      background: linear-gradient(135deg, #8b5cf6, #6366f1);
      color: white;
      font-weight: 700;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .user-name {
      font-size: 0.825rem;
      font-weight: 600;
      color: #e2e8f0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: 0.7rem;
      color: var(--sidebar-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ── Main area ── */
    .main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-width: 0;
    }

    /* Header */
    .app-header {
      height: 58px;
      min-height: 58px;
      background: rgba(255,255,255,0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--surface-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      z-index: 50;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      flex-shrink: 0;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-toggle {
      width: 36px;
      height: 36px;
      border: none;
      background: transparent;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--text-secondary);
      transition: background 0.15s ease, color 0.15s ease;
    }

    .header-toggle:hover {
      background: var(--surface-border-light);
      color: var(--text-primary);
    }

    .header-badge {
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      color: var(--color-primary-600);
      background: var(--color-primary-50);
      border: 1px solid var(--color-primary-200);
      padding: 3px 10px;
      border-radius: 999px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .header-action {
      width: 36px;
      height: 36px;
      border: none;
      background: transparent;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--text-secondary);
      transition: background 0.15s ease, color 0.15s ease;
    }

    .header-action:hover {
      background: var(--surface-border-light);
      color: var(--text-primary);
    }

    .header-action mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    /* Page wrapper */
    .page-wrapper {
      flex: 1;
      overflow-y: auto;
      padding: 28px 28px;
    }
  `]
})
export class MainLayoutComponent {
  sidebarCollapsed = signal(false);

  navGroups: NavGroup[] = [
    {
      label: 'Principal',
      items: [
        { label: 'Dashboard',    icon: 'dashboard',     route: '/dashboard' },
        { label: 'Propiedades',  icon: 'apartment',     route: '/properties' },
        { label: 'Inquilinos',   icon: 'people_alt',    route: '/tenants' },
      ]
    },
    {
      label: 'Consumos',
      items: [
        { label: 'Medidores',    icon: 'speed',         route: '/meters' },
        { label: 'Lecturas',     icon: 'edit_note',     route: '/readings' },
        { label: 'Recibos',      icon: 'receipt_long',  route: '/receipts' },
      ]
    },
    {
      label: 'Servicios',
      items: [
        { label: 'Servicios',     icon: 'build',         route: '/services' },
        { label: 'Unidades',      icon: 'home',          route: '/units' },
        { label: 'Ocupaciones',   icon: 'key',           route: '/occupancies' },
      ]
    },
    {
      label: 'Finanzas',
      items: [
        { label: 'Liquidaciones', icon: 'payments',     route: '/settlements' },
      ]
    }
  ];
}
