import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Receipt {
  id?: string;
  serviceId: string;
  serviceName?: string;
  period: string;
  receiptNumber: string;
  totalAmount: number;
  totalConsumption: number;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReceiptApiService {
  private apiUrl = `${environment.apiUrl}/receipts`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Receipt[]> {
    return this.http.get<Receipt[]>(this.apiUrl);
  }

  findById(id: string): Observable<Receipt> {
    return this.http.get<Receipt>(`${this.apiUrl}/${id}`);
  }

  create(receipt: Receipt): Observable<Receipt> {
    return this.http.post<Receipt>(this.apiUrl, receipt);
  }

  update(id: string, receipt: Receipt): Observable<Receipt> {
    return this.http.put<Receipt>(`${this.apiUrl}/${id}`, receipt);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
