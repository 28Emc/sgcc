import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Settlement {
  id?: string;
  receiptId: string;
  tenantId: string;
  consumption: number;
  unitValue: number;
  calculatedAmount: number;
  adjustmentAmount: number;
  finalAmount: number;
  status: string;
  createdAt?: string;
}

export interface TenantConsumption {
  tenantId: string;
  consumption: number;
}

@Injectable({
  providedIn: 'root'
})
export class SettlementApiService {
  private apiUrl = `${environment.apiUrl}/settlements`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Settlement[]> {
    return this.http.get<Settlement[]>(this.apiUrl);
  }

  findById(id: string): Observable<Settlement> {
    return this.http.get<Settlement>(`${this.apiUrl}/${id}`);
  }

  generate(receiptId: string, tenantConsumptions: TenantConsumption[], unitValue: number): Observable<Settlement[]> {
    return this.http.post<Settlement[]>(`${this.apiUrl}/generate`, {
      receiptId,
      tenantConsumptions,
      unitValue
    });
  }

  applyAdjustment(id: string, amount: number, reason: string): Observable<Settlement> {
    return this.http.post<Settlement>(`${this.apiUrl}/${id}/adjust`, { amount, reason });
  }
}
