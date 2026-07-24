import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiBaseService } from '../../../core/services/api-base.service';
import type { Service } from '../models/service.model';
export type { Service } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceApiService extends ApiBaseService<Service> {
  constructor(http: HttpClient) {
    super(http, 'services');
  }
}
