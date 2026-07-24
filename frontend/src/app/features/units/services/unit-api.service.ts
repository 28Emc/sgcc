import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../../core/services/api-base.service';
import type { Unit } from '../models/unit.model';

export type { Unit } from '../models/unit.model';

@Injectable({
  providedIn: 'root'
})
export class UnitApiService extends ApiBaseService<Unit> {
  constructor(http: HttpClient) {
    super(http, 'units');
  }

  findByPropertyId(propertyId: string): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.apiUrl}/by-property/${propertyId}`);
  }
}
