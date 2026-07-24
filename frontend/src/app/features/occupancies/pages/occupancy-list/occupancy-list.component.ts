import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
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
import { TenantApiService, Tenant } from '../../../tenants/services/tenant-api.service';
import { UnitApiService, Unit } from '../../../units/services/unit-api.service';
import { OccupancyApiService, Occupancy } from '../../services/occupancy-api.service';

type DrawerMode = 'closed' | 'view' | 'edit' | 'create';

@Component({
  selector: 'app-occupancy-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatTableModule, MatButtonModule,
    MatIconModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatSidenavModule,
    MatDividerModule, MatDialogModule, MatPaginatorModule, MatSnackBarModule,
    PageHeaderComponent, LoadingSpinnerComponent, EmptyStateComponent, DrawerFieldComponent
  ],
  template: `
    <app-page-header title="Ocupaciones" subtitle="Contratos de alquiler y asignación de inquilinos a unidades">
      <button mat-raised-button color="primary" (click)="openCreate()"><mat-icon>add</mat-icon> Nueva ocupación</button>
    </app-page-header>

    <div class="toolbar"><div class="toolbar-search"><mat-form-field appearance="outline" class="search-field"><mat-label>Buscar por inquilino o unidad...</mat-label><input matInput [ngModel]="searchTerm()" (ngModelChange)="onSearchChange($event)"><mat-icon matSuffix>search</mat-icon></mat-form-field></div><div class="total-count">{{ filteredOccupancies().length }} ocupaciones</div></div>

    <div class="content-with-drawer">
      @if (loading()) {
        <app-loading-spinner message="Cargando ocupaciones..."></app-loading-spinner>
      } @else if (filteredOccupancies().length === 0) {
        <app-empty-state icon="key" title="No se encontraron ocupaciones" description="Aún no hay contratos registrados o la búsqueda no arrojó resultados." actionLabel="Crear ocupación" actionIcon="add" (actionClicked)="openCreate()" />
      } @else {
        <div class="card-container"><div class="overflow-x-auto"><table mat-table [dataSource]="paginatedOccupancies()">
          <ng-container matColumnDef="tenant"><th mat-header-cell *matHeaderCellDef>Inquilino</th><td mat-cell *matCellDef="let occupancy"><div class="cell-name"><span class="cell-icon"><mat-icon>person</mat-icon></span><span class="cell-primary">{{ getTenantName(occupancy) }}</span></div></td></ng-container>
          <ng-container matColumnDef="unit"><th mat-header-cell *matHeaderCellDef>Unidad</th><td mat-cell *matCellDef="let occupancy"><span class="cell-unit"><mat-icon>home</mat-icon>{{ getUnitName(occupancy) }}</span></td></ng-container>
          <ng-container matColumnDef="dates"><th mat-header-cell *matHeaderCellDef>Vigencia</th><td mat-cell *matCellDef="let occupancy"><span class="cell-primary">{{ occupancy.startDate }}</span><span class="cell-sub">hasta {{ occupancy.endDate || 'actualidad' }}</span></td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Estado</th><td mat-cell *matCellDef="let occupancy"><span [class]="isActive(occupancy) ? 'badge badge-success' : 'badge badge-neutral'">{{ isActive(occupancy) ? 'ACTIVA' : 'INACTIVA' }}</span></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let occupancy"><div class="cell-actions"><button mat-icon-button (click)="openView(occupancy); $event.stopPropagation()" title="Ver detalle"><mat-icon>visibility</mat-icon></button><button mat-icon-button (click)="openEdit(occupancy); $event.stopPropagation()" title="Editar"><mat-icon>edit</mat-icon></button><button mat-icon-button class="btn-icon-danger" (click)="deleteOccupancy(occupancy); $event.stopPropagation()" title="Eliminar"><mat-icon>delete</mat-icon></button></div></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr><tr mat-row *matRowDef="let row; columns: displayedColumns;" class="clickable-row" (click)="openView(row)"></tr>
        </table></div><mat-paginator [length]="filteredOccupancies().length" [pageIndex]="pageIndex()" [pageSize]="pageSize()" [pageSizeOptions]="[5, 10, 25]" (page)="onPageChange($event)" showFirstLastButtons /></div>
      }

      <mat-drawer mode="over" position="end" [opened]="drawerMode() !== 'closed'" (closedStart)="closeDrawer()" class="entity-drawer">
        @if (drawerMode() === 'view' && selectedOccupancy()) {
          <div class="drawer-header"><div class="drawer-header-text"><h2 class="drawer-title">{{ getTenantName(selectedOccupancy()!) }}</h2><p class="drawer-subtitle">{{ getUnitName(selectedOccupancy()!) }}</p></div><button mat-icon-button (click)="closeDrawer()" title="Cerrar"><mat-icon>close</mat-icon></button></div><mat-divider />
          <div class="drawer-body"><div class="drawer-summary"><span class="cell-icon"><mat-icon>key</mat-icon></span><span [class]="isActive(selectedOccupancy()!) ? 'badge badge-success' : 'badge badge-neutral'">{{ isActive(selectedOccupancy()!) ? 'ACTIVA' : 'INACTIVA' }}</span></div><mat-divider />
            <div class="drawer-section"><div class="drawer-section-header"><mat-icon>description</mat-icon><h4>Contrato de ocupación</h4></div><app-drawer-field label="Inquilino">{{ getTenantName(selectedOccupancy()!) }}</app-drawer-field><app-drawer-field label="Unidad">{{ getUnitName(selectedOccupancy()!) }}</app-drawer-field><app-drawer-field label="Inicio">{{ selectedOccupancy()!.startDate }}</app-drawer-field><app-drawer-field label="Fin">{{ selectedOccupancy()!.endDate || 'Vigente' }}</app-drawer-field></div><mat-divider /><div class="drawer-actions"><button mat-stroked-button (click)="openEdit(selectedOccupancy()!)"><mat-icon>edit</mat-icon><span class="button-text">Editar</span></button><button mat-stroked-button color="warn" (click)="deleteOccupancy(selectedOccupancy()!)"><mat-icon>delete</mat-icon><span class="button-text">Eliminar</span></button></div>
          </div>
        }
        @if (drawerMode() === 'edit' || drawerMode() === 'create') {
          <div class="drawer-header"><div class="drawer-header-text"><h2 class="drawer-title">{{ drawerMode() === 'edit' ? 'Editar ocupación' : 'Nueva ocupación' }}</h2><p class="drawer-subtitle">Asigna un inquilino a una unidad y define la vigencia del contrato.</p></div><button mat-icon-button (click)="closeDrawer()" title="Cerrar"><mat-icon>close</mat-icon></button></div><mat-divider />
          <div class="drawer-body"><form [formGroup]="form" (ngSubmit)="onSubmit()"><div class="drawer-section"><div class="drawer-section-header"><mat-icon>key</mat-icon><h4>Datos del contrato</h4></div>
            <mat-form-field appearance="outline" class="drawer-form-field"><mat-label>Inquilino</mat-label><mat-select formControlName="tenantId">@for (tenant of tenants(); track tenant.id) { <mat-option [value]="tenant.id">{{ tenant.name }}</mat-option> }</mat-select>@if (form.get('tenantId')?.hasError('required') && form.get('tenantId')?.touched) { <mat-error>Selecciona un inquilino</mat-error> }</mat-form-field>
            <mat-form-field appearance="outline" class="drawer-form-field"><mat-label>Unidad</mat-label><mat-select formControlName="unitId">@for (unit of units(); track unit.id) { <mat-option [value]="unit.id">{{ unit.name }}</mat-option> }</mat-select>@if (form.get('unitId')?.hasError('required') && form.get('unitId')?.touched) { <mat-error>Selecciona una unidad</mat-error> }</mat-form-field>
            <mat-form-field appearance="outline" class="drawer-form-field"><mat-label>Fecha de inicio</mat-label><input matInput type="date" formControlName="startDate">@if (form.get('startDate')?.hasError('required') && form.get('startDate')?.touched) { <mat-error>Indica la fecha de inicio</mat-error> }</mat-form-field>
            <mat-form-field appearance="outline" class="drawer-form-field"><mat-label>Fecha de fin</mat-label><input matInput type="date" formControlName="endDate"></mat-form-field>
          </div><mat-divider /><div class="drawer-actions"><button mat-stroked-button type="button" (click)="closeDrawer()">Cancelar</button><button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving()"><mat-icon>{{ saving() ? 'sync' : 'save' }}</mat-icon><span class="button-text">{{ saving() ? ' Guardando...' : (drawerMode() === 'edit' ? ' Actualizar' : ' Crear') }}</span></button></div></form></div>
        }
      </mat-drawer>
    </div>
  `,
  styles: [`
    .content-with-drawer { position: relative; } .entity-drawer { width: 480px !important; } .cell-name, .drawer-summary { display: flex; align-items: center; gap: 12px; } .cell-icon { display: inline-flex; width: 36px; height: 36px; align-items: center; justify-content: center; border-radius: var(--radius-sm); background: var(--color-primary-50); color: var(--color-primary-600); } .cell-primary, .cell-sub { display: block; } .cell-primary { color: var(--text-primary); font-size: .875rem; font-weight: 600; } .cell-sub { color: var(--text-muted); font-size: .75rem; } .cell-unit { display: inline-flex; align-items: center; gap: 6px; color: var(--text-secondary); font-size: .85rem; } .cell-unit mat-icon { width: 16px; height: 16px; color: var(--text-muted); font-size: 16px; } .cell-actions, .drawer-actions { display: flex; justify-content: flex-end; gap: 4px; } .btn-icon-danger:hover { color: #dc2626 !important; } .drawer-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 20px 20px 12px; } .drawer-header-text { min-width: 0; flex: 1; } .drawer-title { margin: 0; color: var(--text-primary); font-size: 1.1rem; font-weight: 700; } .drawer-subtitle { margin: 4px 0 0; color: var(--text-muted); font-size: .8rem; } .drawer-body { overflow-y: auto; padding: 16px 20px 20px; } .drawer-summary { margin-bottom: 20px; } .drawer-section { margin-bottom: 20px; } .drawer-form-field { width: 100%; } .drawer-actions { padding-top: 16px; }
  `]
})
export class OccupancyListComponent implements OnInit {
  private readonly occupancyApi = inject(OccupancyApiService); private readonly tenantApi = inject(TenantApiService); private readonly unitApi = inject(UnitApiService); private readonly snackBar = inject(MatSnackBar); private readonly dialog = inject(MatDialog); private readonly fb = inject(FormBuilder);
  displayedColumns = ['tenant', 'unit', 'dates', 'status', 'actions']; occupancies = signal<Occupancy[]>([]); tenants = signal<Tenant[]>([]); units = signal<Unit[]>([]); selectedOccupancy = signal<Occupancy | null>(null); drawerMode = signal<DrawerMode>('closed'); searchTerm = signal(''); loading = signal(true); saving = signal(false); pageIndex = signal(0); pageSize = signal(10);
  form: FormGroup = this.fb.group({ tenantId: ['', Validators.required], unitId: ['', Validators.required], startDate: ['', Validators.required], endDate: [''] });
  filteredOccupancies = computed(() => { const term = this.searchTerm().toLowerCase().trim(); return !term ? this.occupancies() : this.occupancies().filter(occupancy => [this.getTenantName(occupancy), this.getUnitName(occupancy)].some(value => value.toLowerCase().includes(term))); }); paginatedOccupancies = computed(() => this.filteredOccupancies().slice(this.pageIndex() * this.pageSize(), (this.pageIndex() + 1) * this.pageSize()));
  ngOnInit(): void { this.loadOccupancies(); this.tenantApi.findAll().subscribe({ next: tenants => this.tenants.set(tenants || []) }); this.unitApi.findAll().subscribe({ next: units => this.units.set(units || []) }); }
  loadOccupancies(): void { this.loading.set(true); this.occupancyApi.findAll().subscribe({ next: occupancies => { this.occupancies.set(occupancies || []); this.loading.set(false); }, error: () => { this.occupancies.set([]); this.loading.set(false); } }); }
  onSearchChange(value: string): void { this.searchTerm.set(value); this.pageIndex.set(0); } onPageChange(event: PageEvent): void { this.pageIndex.set(event.pageIndex); this.pageSize.set(event.pageSize); } isActive(occupancy: Occupancy): boolean { return !occupancy.status || occupancy.status === 'ACTIVE'; } getTenantName(occupancy: Occupancy): string { return occupancy.tenantName || this.tenants().find(tenant => tenant.id === occupancy.tenantId)?.name || 'Sin inquilino'; } getUnitName(occupancy: Occupancy): string { return occupancy.unitName || this.units().find(unit => unit.id === occupancy.unitId)?.name || 'Sin unidad'; }
  openView(occupancy: Occupancy): void { this.selectedOccupancy.set(occupancy); this.drawerMode.set('view'); } openCreate(): void { this.selectedOccupancy.set(null); this.form.reset({ tenantId: '', unitId: '', startDate: '', endDate: '' }); this.drawerMode.set('create'); } openEdit(occupancy: Occupancy): void { this.selectedOccupancy.set(occupancy); this.form.reset({ tenantId: occupancy.tenantId, unitId: occupancy.unitId, startDate: occupancy.startDate, endDate: occupancy.endDate || '' }); this.drawerMode.set('edit'); } closeDrawer(): void { this.drawerMode.set('closed'); this.selectedOccupancy.set(null); this.form.reset({ tenantId: '', unitId: '', startDate: '', endDate: '' }); }
  onSubmit(): void { if (this.form.invalid) { this.form.markAllAsTouched(); return; } this.saving.set(true); const selected = this.selectedOccupancy(); const payload: Occupancy = this.form.getRawValue(); const request$ = this.drawerMode() === 'edit' && selected?.id ? this.occupancyApi.update(selected.id, payload) : this.occupancyApi.create(payload); request$.subscribe({ next: () => { this.saving.set(false); this.snackBar.open(this.drawerMode() === 'edit' ? 'Ocupación actualizada' : 'Ocupación creada', 'OK', { duration: 3000 }); this.closeDrawer(); this.loadOccupancies(); }, error: () => { this.saving.set(false); this.snackBar.open('No se pudo guardar la ocupación. Revise los datos e inténtelo de nuevo.', 'Cerrar', { duration: 4000 }); } }); }
  deleteOccupancy(occupancy: Occupancy): void { this.dialog.open(ConfirmDialogComponent, { width: '400px', data: { title: 'Eliminar ocupación', message: `¿Eliminar la ocupación de ${this.getTenantName(occupancy)}? Esta acción no se puede deshacer.`, confirmLabel: 'Eliminar', color: 'warn' } as ConfirmDialogData }).afterClosed().subscribe(confirmed => { if (!confirmed || !occupancy.id) return; this.occupancyApi.delete(occupancy.id).subscribe({ next: () => { this.snackBar.open('Ocupación eliminada', 'OK', { duration: 3000 }); this.closeDrawer(); this.loadOccupancies(); }, error: () => this.snackBar.open('No se pudo eliminar la ocupación', 'Cerrar', { duration: 3000 }) }); }); }
}
