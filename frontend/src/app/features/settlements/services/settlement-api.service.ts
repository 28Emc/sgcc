import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiBaseService } from '../../../core/services/api-base.service';
import type { Settlement, TenantConsumption } from '../models/settlement.model';

export type { Settlement, TenantConsumption } from '../models/settlement.model';

@Injectable({
  providedIn: 'root'
})
export class SettlementApiService extends ApiBaseService<Settlement> {
  constructor(http: HttpClient) {
    super(http, 'settlements');
  }

  generate(receiptId: string, tenantConsumptions: TenantConsumption[], unitValue: number) {
    return this.http.post<Settlement[]>(`${this.apiUrl}/generate`, {
      receiptId,
      tenantConsumptions,
      unitValue
    });
  }

  applyAdjustment(id: string, amount: number, reason: string) {
    return this.http.post<Settlement>(`${this.apiUrl}/${id}/adjust`, { amount, reason });
  }

  complete(id: string) {
    return this.http.put<Settlement>(`${this.apiUrl}/${id}/complete`, {});
  }
}
