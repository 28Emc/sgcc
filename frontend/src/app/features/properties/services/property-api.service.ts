import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiBaseService } from '../../../core/services/api-base.service';
import type { Property } from '../models/property.model';

export type { Property } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyApiService extends ApiBaseService<Property> {
  constructor(http: HttpClient) {
    super(http, 'properties');
  }
}
