import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export abstract class ApiBaseService<T extends { id?: string }> {
  protected readonly apiUrl: string;

  constructor(protected readonly http: HttpClient, endpoint: string) {
    this.apiUrl = `${environment.apiUrl}/${endpoint}`;
  }

  findAll(): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl);
  }

  findById(id: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  create(entity: T): Observable<T> {
    return this.http.post<T>(this.apiUrl, entity);
  }

  update(id: string, entity: T): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${id}`, entity);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
