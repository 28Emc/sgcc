import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { ReceiptApiService, Receipt } from '../../services/receipt-api.service';

@Component({
  selector: 'app-receipt-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent
  ],
  template: `
    <app-page-header
      title="Recibos de Servicios Públicos"
      subtitle="Registro de las facturas globales emitidas por las empresas proveedoras (Luz del Sur, Sedapal, Enel)">
      <button mat-raised-button color="primary" routerLink="new" class="btn-primary">
        <mat-icon class="mr-1">add</mat-icon>
        Registrar Nuevo Recibo
      </button>
    </app-page-header>

    <!-- Search and Filter Bar -->
    <div class="toolbar">
      <div class="toolbar-search">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar por proveedor o periodo...</mat-label>
          <input matInput [ngModel]="searchTerm()" (ngModelChange)="onSearchChange($event)">
          <mat-icon matSuffix class="text-slate-400">search</mat-icon>
        </mat-form-field>
      </div>

      <div class="total-count">
        Mostrando <span class="font-bold text-slate-800">{{ paginatedReceipts().length }}</span> de <span class="font-bold text-slate-800">{{ filteredReceipts().length }}</span> recibos
      </div>
    </div>

    <!-- Receipts Table -->
    @if (loading()) {
      <app-loading-spinner message="Cargando historial de recibos..."></app-loading-spinner>
    } @else {
      @if (filteredReceipts().length === 0) {
        <app-empty-state
          icon="receipt_long"
          title="No hay recibos ingresados"
          description="Registre el primer recibo del proveedor para iniciar el proceso de liquidación."
          actionLabel="Registrar Recibo"
          actionIcon="add"
          (actionClicked)="navigateToNew()">
        </app-empty-state>
      } @else {
        <mat-card class="card-container">
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="paginatedReceipts()" class="w-full">
              <!-- Provider Column -->
              <ng-container matColumnDef="provider">
                <th mat-header-cell *matHeaderCellDef>Proveedor / Servicio</th>
                <td mat-cell *matCellDef="let receipt">
                  <div class="flex items-center gap-3 py-1">
                    <div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <mat-icon>receipt</mat-icon>
                    </div>
                    <div>
                       <a [routerLink]="[receipt.id]" class="font-bold text-slate-900 leading-tight hover:text-indigo-600 transition-colors">{{ receipt.serviceName }}</a>
                      <p class="text-xs text-slate-500 mt-0.5">N° {{ receipt.receiptNumber }}</p>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Period Column -->
              <ng-container matColumnDef="period">
                <th mat-header-cell *matHeaderCellDef>Periodo</th>
                <td mat-cell *matCellDef="let receipt">
                  <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    <mat-icon class="!w-3.5 !h-3.5 text-slate-400">calendar_month</mat-icon>
                    {{ receipt.period }}
                  </span>
                </td>
              </ng-container>

              <!-- Total Amount Column -->
              <ng-container matColumnDef="totalAmount">
                <th mat-header-cell *matHeaderCellDef>Monto Factura</th>
                <td mat-cell *matCellDef="let receipt">
                  <span class="font-extrabold text-slate-900 text-sm font-mono">$ {{ receipt.totalAmount | number:'1.2-2' }}</span>
                </td>
              </ng-container>

              <!-- Consumption & Unit Price Column -->
              <ng-container matColumnDef="unitValue">
                <th mat-header-cell *matHeaderCellDef>Valor Unitario Calculado</th>
                <td mat-cell *matCellDef="let receipt">
                  <div>
                    <span class="font-mono font-bold text-indigo-600">$ {{ (receipt.totalConsumption > 0 ? receipt.totalAmount / receipt.totalConsumption : 0) | number:'1.4-4' }}</span>
                    <span class="text-xs text-slate-400"> / unidad</span>
                    <p class="text-xs text-slate-500">Consumo: {{ receipt.totalConsumption | number:'1.0-2' }} global</p>
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let receipt">
                  <span class="status-badge status-badge-active">REGISTRADO</span>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="text-right">Acciones</th>
                <td mat-cell *matCellDef="let receipt" class="text-right">
                  <button mat-icon-button [routerLink]="[receipt.id]" title="Ver detalle" class="!text-slate-500 hover:!text-indigo-600">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button [routerLink]="[receipt.id, 'edit']" title="Editar" class="!text-slate-500 hover:!text-indigo-600">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="deleteReceipt(receipt)" title="Eliminar" class="!text-slate-500 hover:!text-red-600">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <mat-paginator
            [length]="filteredReceipts().length"
            [pageIndex]="pageIndex()"
            [pageSize]="pageSize()"
            [pageSizeOptions]="[5, 10, 25, 50]"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        </mat-card>
      }
    }
  `
})
export class ReceiptListComponent implements OnInit {
  private receiptApi = inject(ReceiptApiService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  displayedColumns = ['provider', 'period', 'totalAmount', 'unitValue', 'status', 'actions'];

  receipts = signal<Receipt[]>([]);
  loading = signal(true);
  searchTerm = signal('');
  pageIndex = signal(0);
  pageSize = signal(10);

  filteredReceipts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.receipts();
    return this.receipts().filter(r =>
      (r.serviceName || '').toLowerCase().includes(term) ||
      (r.period || '').toLowerCase().includes(term) ||
      (r.receiptNumber || '').toLowerCase().includes(term)
    );
  });

  paginatedReceipts = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredReceipts().slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.loadReceipts();
  }

  loadReceipts(): void {
    this.loading.set(true);
    this.receiptApi.findAll().subscribe({
      next: (data) => {
        this.receipts.set(data || []);
        this.loading.set(false);
      },
      error: () => {
        this.receipts.set([]);
        this.loading.set(false);
      }
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.pageIndex.set(0);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  navigateToNew(): void {
    this.router.navigate(['/receipts/new']);
  }

  deleteReceipt(receipt: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Recibo',
        message: `¿Está seguro de eliminar el recibo "${receipt.receiptNumber}"? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        color: 'warn'
      } as ConfirmDialogData
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && receipt.id) {
        this.receiptApi.delete(receipt.id).subscribe({
          next: () => {
            this.snackBar.open('Recibo eliminado', 'OK', { duration: 3000 });
            this.loadReceipts();
          },
          error: () => this.snackBar.open('Error al eliminar el recibo', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }
}
