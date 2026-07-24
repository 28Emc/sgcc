import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Meter {
  id?: string;
  unitId: string;
  serviceId: string;
  serialNumber: string;
  status?: string;
  serviceName?: string;
  unitName?: string;
  propertyName?: string;
  lastReadingValue?: number;
  unitOfMeasure?: string;
  serviceType?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MeterApiService {
  private apiUrl = `${environment.apiUrl}/meters`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Meter[]> {
    return this.http.get<Meter[]>(this.apiUrl);
  }

  findById(id: string): Observable<Meter> {
    return this.http.get<Meter>(`${this.apiUrl}/${id}`);
  }

  create(meter: Meter): Observable<Meter> {
    return this.http.post<Meter>(this.apiUrl, meter);
  }

  update(id: string, meter: Meter): Observable<Meter> {
    return this.http.put<Meter>(`${this.apiUrl}/${id}`, meter);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
