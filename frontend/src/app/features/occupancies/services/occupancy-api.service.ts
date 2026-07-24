import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Occupancy {
  id?: string;
  tenantId: string;
  unitId: string;
  startDate: string;
  endDate?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OccupancyApiService {
  private apiUrl = `${environment.apiUrl}/occupancies`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Occupancy[]> {
    return this.http.get<Occupancy[]>(this.apiUrl);
  }

  findById(id: string): Observable<Occupancy> {
    return this.http.get<Occupancy>(`${this.apiUrl}/${id}`);
  }

  create(occupancy: Occupancy): Observable<Occupancy> {
    return this.http.post<Occupancy>(this.apiUrl, occupancy);
  }

  update(id: string, occupancy: Occupancy): Observable<Occupancy> {
    return this.http.put<Occupancy>(`${this.apiUrl}/${id}`, occupancy);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
