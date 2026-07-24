import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { PropertyApiService, Property } from '../../../properties/services/property-api.service';
import { UnitApiService, Unit } from '../../services/unit-api.service';

type DrawerMode = 'closed' | 'view' | 'edit' | 'create';

@Component({
  selector: 'app-unit-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSidenavModule,
    MatDividerModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSnackBarModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    DrawerFieldComponent,
  ],
  template: `
    <app-page-header title="Unidades" subtitle="Gestión de unidades de alquiler por propiedad">
      <button mat-raised-button color="primary" (click)="openCreate()">
        <mat-icon>add</mat-icon>
        Nueva unidad
      </button>
    </app-page-header>

    <div class="toolbar">
      <div class="toolbar-search">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar por unidad o propiedad...</mat-label>
          <input matInput [ngModel]="searchTerm()" (ngModelChange)="onSearchChange($event)">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>
      <div class="total-count">{{ filteredUnits().length }} unidades</div>
    </div>

    <div class="content-with-drawer">
      @if (loading()) {
        <app-loading-spinner message="Cargando unidades..."></app-loading-spinner>
      } @else if (filteredUnits().length === 0) {
        <app-empty-state
          icon="home"
          title="No se encontraron unidades"
          description="Aún no hay unidades registradas o la búsqueda no arrojó resultados."
          actionLabel="Crear unidad"
          actionIcon="add"
          (actionClicked)="openCreate()">
        </app-empty-state>
      } @else {
        <div class="card-container">
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="paginatedUnits()">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Unidad</th>
                <td mat-cell *matCellDef="let unit">
                  <div class="cell-name">
                    <span class="cell-icon"><mat-icon>home</mat-icon></span>
                    <div>
                      <span class="cell-primary">{{ unit.name }}</span>
                      <span class="cell-sub">{{ unit.description || 'Sin descripción' }}</span>
                    </div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="property">
                <th mat-header-cell *matHeaderCellDef>Propiedad</th>
                <td mat-cell *matCellDef="let unit">
                  <span class="cell-property"><mat-icon>apartment</mat-icon>{{ getPropertyName(unit) }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let unit">
                  <span [class]="isActive(unit) ? 'badge badge-success' : 'badge badge-neutral'">
                    {{ isActive(unit) ? 'ACTIVO' : 'INACTIVO' }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef></th>
                <td mat-cell *matCellDef="let unit">
                  <div class="cell-actions">
                    <button mat-icon-button (click)="openView(unit); $event.stopPropagation()" title="Ver detalle"><mat-icon>visibility</mat-icon></button>
                    <button mat-icon-button (click)="openEdit(unit); $event.stopPropagation()" title="Editar"><mat-icon>edit</mat-icon></button>
                    <button mat-icon-button class="btn-icon-danger" (click)="deleteUnit(unit); $event.stopPropagation()" title="Eliminar"><mat-icon>delete</mat-icon></button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="clickable-row" (click)="openView(row)"></tr>
            </table>
          </div>
          <mat-paginator [length]="filteredUnits().length" [pageIndex]="pageIndex()" [pageSize]="pageSize()" [pageSizeOptions]="[5, 10, 25]" (page)="onPageChange($event)" showFirstLastButtons />
        </div>
      }

      <mat-drawer mode="over" position="end" [opened]="drawerMode() !== 'closed'" (closedStart)="closeDrawer()" class="entity-drawer">
        @if (drawerMode() === 'view' && selectedUnit()) {
          <div class="drawer-header">
            <div class="drawer-header-text">
              <h2 class="drawer-title">{{ selectedUnit()!.name }}</h2>
              <p class="drawer-subtitle">{{ getPropertyName(selectedUnit()!) }}</p>
            </div>
            <button mat-icon-button (click)="closeDrawer()" title="Cerrar"><mat-icon>close</mat-icon></button>
          </div>
          <mat-divider />
          <div class="drawer-body">
            <div class="drawer-section"><span [class]="isActive(selectedUnit()!) ? 'badge badge-success' : 'badge badge-neutral'">{{ isActive(selectedUnit()!) ? 'ACTIVO' : 'INACTIVO' }}</span></div>
            <mat-divider />
            <div class="drawer-section">
              <div class="drawer-section-header"><mat-icon>info</mat-icon><h4>Detalles</h4></div>
              <app-drawer-field label="Unidad">{{ selectedUnit()!.name }}</app-drawer-field>
              <app-drawer-field label="Propiedad">{{ getPropertyName(selectedUnit()!) }}</app-drawer-field>
              <app-drawer-field label="Descripción">{{ selectedUnit()!.description || 'Sin descripción' }}</app-drawer-field>
              <app-drawer-field label="Estado">{{ isActive(selectedUnit()!) ? 'Activo' : 'Inactivo' }}</app-drawer-field>
            </div>
            <mat-divider />
            <div class="drawer-actions">
              <button mat-stroked-button (click)="openEdit(selectedUnit()!)"><mat-icon>edit</mat-icon><span class="button-text">Editar</span></button>
              <button mat-stroked-button color="warn" (click)="deleteUnit(selectedUnit()!)"><mat-icon>delete</mat-icon><span class="button-text">Eliminar</span></button>
            </div>
          </div>
        }

        @if (drawerMode() === 'edit' || drawerMode() === 'create') {
          <div class="drawer-header">
            <div class="drawer-header-text">
              <h2 class="drawer-title">{{ drawerMode() === 'edit' ? 'Editar unidad' : 'Nueva unidad' }}</h2>
              <p class="drawer-subtitle">{{ drawerMode() === 'edit' ? 'Modifica los datos de la unidad' : 'Registra una unidad para una propiedad' }}</p>
            </div>
            <button mat-icon-button (click)="closeDrawer()" title="Cerrar"><mat-icon>close</mat-icon></button>
          </div>
          <mat-divider />
          <div class="drawer-body">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="drawer-section">
                <div class="drawer-section-header"><mat-icon>edit</mat-icon><h4>Datos de la unidad</h4></div>
                <mat-form-field appearance="outline" class="drawer-form-field">
                  <mat-label>Propiedad</mat-label>
                  <mat-select formControlName="propertyId">
                    @for (property of properties(); track property.id) { <mat-option [value]="property.id">{{ property.name }}</mat-option> }
                  </mat-select>
                  @if (form.get('propertyId')?.hasError('required') && form.get('propertyId')?.touched) { <mat-error>Selecciona una propiedad</mat-error> }
                </mat-form-field>
                <mat-form-field appearance="outline" class="drawer-form-field">
                  <mat-label>Nombre de la unidad</mat-label>
                  <input matInput formControlName="name" placeholder="Ej.: Departamento 101">
                  @if (form.get('name')?.hasError('required') && form.get('name')?.touched) { <mat-error>El nombre es obligatorio</mat-error> }
                </mat-form-field>
                <mat-form-field appearance="outline" class="drawer-form-field">
                  <mat-label>Descripción</mat-label>
                  <textarea matInput formControlName="description" rows="3" placeholder="Detalles opcionales"></textarea>
                </mat-form-field>
              </div>
              <mat-divider />
              <div class="drawer-actions">
                <button mat-stroked-button type="button" (click)="closeDrawer()">Cancelar</button>
                <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving()">
                  <mat-icon>{{ saving() ? 'sync' : 'save' }}</mat-icon><span class="button-text">{{ saving() ? ' Guardando...' : (drawerMode() === 'edit' ? ' Actualizar' : ' Crear') }}</span>
                </button>
              </div>
            </form>
          </div>
        }
      </mat-drawer>
    </div>
  `,
  styles: [`
    .content-with-drawer { position: relative; }
    .entity-drawer { width: 480px !important; }
    .cell-name { display: flex; align-items: center; gap: 12px; }
    .cell-icon { display: flex; width: 36px; height: 36px; flex: 0 0 auto; align-items: center; justify-content: center; border-radius: var(--radius-sm); background: var(--color-primary-50); color: var(--color-primary-600); }
    .cell-primary, .cell-sub { display: block; }
    .cell-primary { color: var(--text-primary); font-size: .875rem; font-weight: 600; }
    .cell-sub { max-width: 260px; overflow: hidden; color: var(--text-muted); font-size: .75rem; text-overflow: ellipsis; white-space: nowrap; }
    .cell-property { display: inline-flex; align-items: center; gap: 6px; color: var(--text-secondary); font-size: .85rem; }
    .cell-property mat-icon { width: 16px; height: 16px; color: var(--text-muted); font-size: 16px; }
    .cell-actions, .drawer-actions { display: flex; justify-content: flex-end; gap: 4px; }
    .btn-icon-danger:hover { color: #dc2626 !important; }
    .drawer-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 20px 20px 12px; }
    .drawer-header-text { min-width: 0; flex: 1; }
    .drawer-title { margin: 0; color: var(--text-primary); font-size: 1.1rem; font-weight: 700; }
    .drawer-subtitle { margin: 4px 0 0; color: var(--text-muted); font-size: .8rem; }
    .drawer-body { overflow-y: auto; padding: 16px 20px 20px; }
    .drawer-section { margin-bottom: 20px; }
    .drawer-form-field { width: 100%; }
    .drawer-actions { padding-top: 16px; }
  `]
})
export class UnitListComponent implements OnInit {
  private readonly unitApi = inject(UnitApiService);
  private readonly propertyApi = inject(PropertyApiService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  displayedColumns = ['name', 'property', 'status', 'actions'];
  units = signal<Unit[]>([]);
  properties = signal<Property[]>([]);
  selectedUnit = signal<Unit | null>(null);
  drawerMode = signal<DrawerMode>('closed');
  searchTerm = signal('');
  loading = signal(true);
  saving = signal(false);
  pageIndex = signal(0);
  pageSize = signal(10);

  form: FormGroup = this.fb.group({
    propertyId: ['', Validators.required],
    name: ['', Validators.required],
    description: ['']
  });

  filteredUnits = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.units();
    return this.units().filter(unit => [unit.name, unit.description, this.getPropertyName(unit)].some(value => (value || '').toLowerCase().includes(term)));
  });

  paginatedUnits = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredUnits().slice(start, start + this.pageSize());
  });

  ngOnInit(): void { this.loadUnits(); this.loadProperties(); }

  loadUnits(): void {
    this.loading.set(true);
    this.unitApi.findAll().subscribe({
      next: units => { this.units.set(units || []); this.loading.set(false); },
      error: () => { this.units.set([]); this.loading.set(false); }
    });
  }

  private loadProperties(): void {
    this.propertyApi.findAll().subscribe({ next: properties => this.properties.set(properties || []) });
  }

  onSearchChange(value: string): void { this.searchTerm.set(value); this.pageIndex.set(0); }
  onPageChange(event: PageEvent): void { this.pageIndex.set(event.pageIndex); this.pageSize.set(event.pageSize); }
  isActive(unit: Unit): boolean { return !unit.status || unit.status === 'ACTIVE'; }
  getPropertyName(unit: Unit): string { return unit.propertyName || this.properties().find(property => property.id === unit.propertyId)?.name || 'Sin propiedad'; }

  openView(unit: Unit): void { this.selectedUnit.set(unit); this.drawerMode.set('view'); }
  openCreate(): void { this.selectedUnit.set(null); this.form.reset({ propertyId: '', name: '', description: '' }); this.drawerMode.set('create'); }
  openEdit(unit: Unit): void { this.selectedUnit.set(unit); this.form.reset({ propertyId: unit.propertyId, name: unit.name, description: unit.description || '' }); this.drawerMode.set('edit'); }
  closeDrawer(): void { this.drawerMode.set('closed'); this.selectedUnit.set(null); this.form.reset({ propertyId: '', name: '', description: '' }); }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const payload: Unit = this.form.getRawValue();
    const selected = this.selectedUnit();
    const request$ = this.drawerMode() === 'edit' && selected?.id ? this.unitApi.update(selected.id, payload) : this.unitApi.create(payload);
    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.snackBar.open(this.drawerMode() === 'edit' ? 'Unidad actualizada' : 'Unidad creada', 'OK', { duration: 3000 });
        this.closeDrawer();
        this.loadUnits();
      },
      error: () => { this.saving.set(false); this.snackBar.open('No se pudo guardar la unidad. Revise los datos e inténtelo de nuevo.', 'Cerrar', { duration: 4000 }); }
    });
  }

  deleteUnit(unit: Unit): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Eliminar unidad', message: `¿Eliminar la unidad "${unit.name}"? Esta acción no se puede deshacer.`, confirmLabel: 'Eliminar', color: 'warn' } as ConfirmDialogData
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed || !unit.id) return;
      this.unitApi.delete(unit.id).subscribe({
        next: () => { this.snackBar.open('Unidad eliminada', 'OK', { duration: 3000 }); this.closeDrawer(); this.loadUnits(); },
        error: () => this.snackBar.open('No se pudo eliminar la unidad', 'Cerrar', { duration: 3000 })
      });
    });
  }
}
