import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Service {
  id?: string;
  name: string;
  measurementUnit: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceApiService {
  private apiUrl = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl);
  }

  findById(id: string): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${id}`);
  }

  create(service: Service): Observable<Service> {
    return this.http.post<Service>(this.apiUrl, service);
  }

  update(id: string, service: Service): Observable<Service> {
    return this.http.put<Service>(`${this.apiUrl}/${id}`, service);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
