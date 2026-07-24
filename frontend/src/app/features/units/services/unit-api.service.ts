import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Unit {
  id?: string;
  propertyId: string;
  name: string;
  description?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UnitApiService {
  private apiUrl = `${environment.apiUrl}/units`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.apiUrl);
  }

  findById(id: string): Observable<Unit> {
    return this.http.get<Unit>(`${this.apiUrl}/${id}`);
  }

  findByPropertyId(propertyId: string): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.apiUrl}/by-property/${propertyId}`);
  }

  create(unit: Unit): Observable<Unit> {
    return this.http.post<Unit>(this.apiUrl, unit);
  }

  update(id: string, unit: Unit): Observable<Unit> {
    return this.http.put<Unit>(`${this.apiUrl}/${id}`, unit);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
