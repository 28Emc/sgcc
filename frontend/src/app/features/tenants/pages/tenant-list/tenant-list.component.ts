import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { DrawerFieldComponent } from '@shared/components/drawer-field/drawer-field.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { TenantApiService, Tenant } from '../../services/tenant-api.service';

type DrawerMode = 'closed' | 'view' | 'edit' | 'create';

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatTableModule, MatButtonModule,
    MatIconModule, MatInputModule, MatFormFieldModule, MatSidenavModule, MatDividerModule,
    MatDialogModule, MatPaginatorModule, MatSnackBarModule, PageHeaderComponent,
    LoadingSpinnerComponent, EmptyStateComponent, DrawerFieldComponent
  ],
  template: `
    <app-page-header title="Inquilinos" subtitle="Registro de inquilinos y titulares de contratos de alquiler">
      <button mat-raised-button color="primary" (click)="openCreate()"><mat-icon>person_add</mat-icon> Nuevo inquilino</button>
    </app-page-header>

    <div class="toolbar">
      <div class="toolbar-search">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar por nombre, documento o correo...</mat-label>
          <input matInput [ngModel]="searchTerm()" (ngModelChange)="onSearchChange($event)">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>
      <div class="total-count">{{ filteredTenants().length }} inquilinos</div>
    </div>

    <div class="content-with-drawer">
      @if (loading()) {
        <app-loading-spinner message="Cargando directorio de inquilinos..."></app-loading-spinner>
      } @else if (filteredTenants().length === 0) {
        <app-empty-state icon="people" title="No se encontraron inquilinos" description="Aún no hay inquilinos registrados o la búsqueda no arrojó resultados." actionLabel="Crear inquilino" actionIcon="person_add" (actionClicked)="openCreate()" />
      } @else {
        <div class="card-container">
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="paginatedTenants()">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Inquilino</th>
                <td mat-cell *matCellDef="let tenant">
                  <div class="cell-name">
                    <span class="avatar">{{ getInitials(tenant.name) }}</span>
                    <div><span class="cell-primary">{{ tenant.name }}</span><span class="cell-sub">{{ tenant.phone || 'Sin teléfono registrado' }}</span></div>
                  </div>
                </td>
              </ng-container>
              <ng-container matColumnDef="document">
                <th mat-header-cell *matHeaderCellDef>Documento</th>
                <td mat-cell *matCellDef="let tenant"><span class="document"><mat-icon>badge</mat-icon>{{ tenant.documentNumber }}</span></td>
              </ng-container>
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Correo</th>
                <td mat-cell *matCellDef="let tenant"><span class="cell-email">{{ tenant.email || 'Sin correo registrado' }}</span></td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let tenant"><span [class]="isActive(tenant) ? 'badge badge-success' : 'badge badge-neutral'">{{ isActive(tenant) ? 'ACTIVO' : 'INACTIVO' }}</span></td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef></th>
                <td mat-cell *matCellDef="let tenant"><div class="cell-actions">
                  <button mat-icon-button (click)="openView(tenant); $event.stopPropagation()" title="Ver detalle"><mat-icon>visibility</mat-icon></button>
                  <button mat-icon-button (click)="openEdit(tenant); $event.stopPropagation()" title="Editar"><mat-icon>edit</mat-icon></button>
                  <button mat-icon-button class="btn-icon-danger" (click)="deleteTenant(tenant); $event.stopPropagation()" title="Eliminar"><mat-icon>delete</mat-icon></button>
                </div></td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="clickable-row" (click)="openView(row)"></tr>
            </table>
          </div>
          <mat-paginator [length]="filteredTenants().length" [pageIndex]="pageIndex()" [pageSize]="pageSize()" [pageSizeOptions]="[5, 10, 25]" (page)="onPageChange($event)" showFirstLastButtons />
        </div>
      }

      <mat-drawer mode="over" position="end" [opened]="drawerMode() !== 'closed'" (closedStart)="closeDrawer()" class="entity-drawer">
        @if (drawerMode() === 'view' && selectedTenant()) {
          <div class="drawer-header"><div class="drawer-header-text"><h2 class="drawer-title">{{ selectedTenant()!.name }}</h2><p class="drawer-subtitle">{{ selectedTenant()!.documentNumber }}</p></div><button mat-icon-button (click)="closeDrawer()" title="Cerrar"><mat-icon>close</mat-icon></button></div>
          <mat-divider />
          <div class="drawer-body">
            <div class="tenant-summary"><span class="avatar avatar-large">{{ getInitials(selectedTenant()!.name) }}</span><span [class]="isActive(selectedTenant()!) ? 'badge badge-success' : 'badge badge-neutral'">{{ isActive(selectedTenant()!) ? 'ACTIVO' : 'INACTIVO' }}</span></div>
            <mat-divider />
            <div class="drawer-section"><div class="drawer-section-header"><mat-icon>person</mat-icon><h4>Datos de contacto</h4></div>
              <app-drawer-field label="Nombre completo">{{ selectedTenant()!.name }}</app-drawer-field>
              <app-drawer-field label="Documento">{{ selectedTenant()!.documentNumber }}</app-drawer-field>
              <app-drawer-field label="Correo">{{ selectedTenant()!.email || 'Sin correo registrado' }}</app-drawer-field>
              <app-drawer-field label="Teléfono">{{ selectedTenant()!.phone || 'Sin teléfono registrado' }}</app-drawer-field>
            </div>
            <mat-divider />
            <div class="drawer-actions"><button mat-stroked-button (click)="openEdit(selectedTenant()!)"><mat-icon>edit</mat-icon> Editar</button><button mat-stroked-button color="warn" (click)="deleteTenant(selectedTenant()!)"><mat-icon>delete</mat-icon> Eliminar</button></div>
          </div>
        }

        @if (drawerMode() === 'edit' || drawerMode() === 'create') {
          <div class="drawer-header"><div class="drawer-header-text"><h2 class="drawer-title">{{ drawerMode() === 'edit' ? 'Editar inquilino' : 'Nuevo inquilino' }}</h2><p class="drawer-subtitle">{{ drawerMode() === 'edit' ? 'Modifica los datos del titular' : 'Registra un nuevo titular de contrato' }}</p></div><button mat-icon-button (click)="closeDrawer()" title="Cerrar"><mat-icon>close</mat-icon></button></div>
          <mat-divider />
          <div class="drawer-body"><form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="drawer-section"><div class="drawer-section-header"><mat-icon>person</mat-icon><h4>Datos personales</h4></div>
              <mat-form-field appearance="outline" class="drawer-form-field"><mat-label>Nombre completo</mat-label><input matInput formControlName="name" placeholder="Ej.: Juan Pérez Mendoza">@if (form.get('name')?.hasError('required') && form.get('name')?.touched) { <mat-error>El nombre es obligatorio</mat-error> }</mat-form-field>
              <mat-form-field appearance="outline" class="drawer-form-field"><mat-label>Documento de identidad</mat-label><input matInput formControlName="documentNumber" placeholder="Ej.: 45678912">@if (form.get('documentNumber')?.hasError('required') && form.get('documentNumber')?.touched) { <mat-error>El documento es obligatorio</mat-error> }</mat-form-field>
              <mat-form-field appearance="outline" class="drawer-form-field"><mat-label>Correo electrónico</mat-label><input matInput type="email" formControlName="email" placeholder="correo@ejemplo.com">@if (form.get('email')?.hasError('email') && form.get('email')?.touched) { <mat-error>Ingresa un correo válido</mat-error> }</mat-form-field>
              <mat-form-field appearance="outline" class="drawer-form-field"><mat-label>Teléfono</mat-label><input matInput formControlName="phone" placeholder="Ej.: +51 987 654 321"></mat-form-field>
            </div>
            <mat-divider /><div class="drawer-actions"><button mat-stroked-button type="button" (click)="closeDrawer()">Cancelar</button><button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving()"><mat-icon>{{ saving() ? 'sync' : 'save' }}</mat-icon>{{ saving() ? ' Guardando...' : drawerMode() === 'edit' ? ' Actualizar' : ' Crear' }}</button></div>
          </form></div>
        }
      </mat-drawer>
    </div>
  `,
  styles: [`
    .content-with-drawer { position: relative; } .entity-drawer { width: 480px !important; }
    .cell-name { display: flex; align-items: center; gap: 12px; } .avatar { display: inline-flex; width: 36px; height: 36px; flex: 0 0 auto; align-items: center; justify-content: center; border-radius: 50%; background: var(--color-primary-600); color: #fff; font-size: .75rem; font-weight: 700; } .avatar-large { width: 52px; height: 52px; font-size: .95rem; }
    .cell-primary, .cell-sub { display: block; } .cell-primary { color: var(--text-primary); font-size: .875rem; font-weight: 600; } .cell-sub, .cell-email { color: var(--text-muted); font-size: .75rem; } .cell-email { color: var(--text-secondary); font-size: .85rem; }
    .document { display: inline-flex; align-items: center; gap: 6px; border: 1px solid var(--surface-border); border-radius: var(--radius-sm); background: var(--surface-bg); padding: 4px 8px; color: var(--text-secondary); font-family: monospace; font-size: .8rem; } .document mat-icon { width: 15px; height: 15px; color: var(--text-muted); font-size: 15px; }
    .cell-actions, .drawer-actions { display: flex; justify-content: flex-end; gap: 4px; } .btn-icon-danger:hover { color: #dc2626 !important; }
    .drawer-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 20px 20px 12px; } .drawer-header-text { min-width: 0; flex: 1; } .drawer-title { margin: 0; color: var(--text-primary); font-size: 1.1rem; font-weight: 700; } .drawer-subtitle { margin: 4px 0 0; color: var(--text-muted); font-size: .8rem; } .drawer-body { overflow-y: auto; padding: 16px 20px 20px; } .drawer-section { margin-bottom: 20px; } .tenant-summary { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; } .drawer-form-field { width: 100%; } .drawer-actions { padding-top: 16px; }
  `]
})
export class TenantListComponent implements OnInit {
  private readonly tenantApi = inject(TenantApiService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  displayedColumns = ['name', 'document', 'email', 'status', 'actions'];
  tenants = signal<Tenant[]>([]); selectedTenant = signal<Tenant | null>(null); drawerMode = signal<DrawerMode>('closed'); searchTerm = signal(''); loading = signal(true); saving = signal(false); pageIndex = signal(0); pageSize = signal(10);
  form: FormGroup = this.fb.group({ name: ['', Validators.required], documentNumber: ['', Validators.required], email: ['', Validators.email], phone: [''] });
  filteredTenants = computed(() => { const term = this.searchTerm().toLowerCase().trim(); return !term ? this.tenants() : this.tenants().filter(tenant => [tenant.name, tenant.documentNumber, tenant.email, tenant.phone].some(value => (value || '').toLowerCase().includes(term))); });
  paginatedTenants = computed(() => this.filteredTenants().slice(this.pageIndex() * this.pageSize(), (this.pageIndex() + 1) * this.pageSize()));
  ngOnInit(): void { this.loadTenants(); }
  loadTenants(): void { this.loading.set(true); this.tenantApi.findAll().subscribe({ next: tenants => { this.tenants.set(tenants || []); this.loading.set(false); }, error: () => { this.tenants.set([]); this.loading.set(false); } }); }
  onSearchChange(value: string): void { this.searchTerm.set(value); this.pageIndex.set(0); }
  onPageChange(event: PageEvent): void { this.pageIndex.set(event.pageIndex); this.pageSize.set(event.pageSize); }
  isActive(tenant: Tenant): boolean { return !tenant.status || tenant.status === 'ACTIVE'; }
  getInitials(name: string): string { const parts = (name || 'IN').trim().split(/\s+/); return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : parts[0].slice(0, 2).toUpperCase(); }
  openView(tenant: Tenant): void { this.selectedTenant.set(tenant); this.drawerMode.set('view'); }
  openCreate(): void { this.selectedTenant.set(null); this.form.reset({ name: '', documentNumber: '', email: '', phone: '' }); this.drawerMode.set('create'); }
  openEdit(tenant: Tenant): void { this.selectedTenant.set(tenant); this.form.reset({ name: tenant.name, documentNumber: tenant.documentNumber, email: tenant.email || '', phone: tenant.phone || '' }); this.drawerMode.set('edit'); }
  closeDrawer(): void { this.drawerMode.set('closed'); this.selectedTenant.set(null); this.form.reset({ name: '', documentNumber: '', email: '', phone: '' }); }
  onSubmit(): void { if (this.form.invalid) { this.form.markAllAsTouched(); return; } this.saving.set(true); const selected = this.selectedTenant(); const payload: Tenant = this.form.getRawValue(); const request$ = this.drawerMode() === 'edit' && selected?.id ? this.tenantApi.update(selected.id, payload) : this.tenantApi.create(payload); request$.subscribe({ next: () => { this.saving.set(false); this.snackBar.open(this.drawerMode() === 'edit' ? 'Inquilino actualizado' : 'Inquilino creado', 'OK', { duration: 3000 }); this.closeDrawer(); this.loadTenants(); }, error: () => { this.saving.set(false); this.snackBar.open('No se pudo guardar el inquilino. Revise los datos e inténtelo de nuevo.', 'Cerrar', { duration: 4000 }); } }); }
  deleteTenant(tenant: Tenant): void { this.dialog.open(ConfirmDialogComponent, { width: '400px', data: { title: 'Eliminar inquilino', message: `¿Eliminar a "${tenant.name}"? Esta acción no se puede deshacer.`, confirmLabel: 'Eliminar', color: 'warn' } as ConfirmDialogData }).afterClosed().subscribe(confirmed => { if (!confirmed || !tenant.id) return; this.tenantApi.delete(tenant.id).subscribe({ next: () => { this.snackBar.open('Inquilino eliminado', 'OK', { duration: 3000 }); this.closeDrawer(); this.loadTenants(); }, error: () => this.snackBar.open('No se pudo eliminar el inquilino', 'Cerrar', { duration: 3000 }) }); }); }
}
