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
}
