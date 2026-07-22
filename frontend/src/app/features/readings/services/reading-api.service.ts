import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Reading {
  id?: string;
  meterId: string;
  readingDate: string;
  readingValue: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReadingApiService {
  private apiUrl = `${environment.apiUrl}/readings`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Reading[]> {
    return this.http.get<Reading[]>(this.apiUrl);
  }

  findById(id: string): Observable<Reading> {
    return this.http.get<Reading>(`${this.apiUrl}/${id}`);
  }

  create(reading: Reading): Observable<Reading> {
    return this.http.post<Reading>(this.apiUrl, reading);
  }
}
