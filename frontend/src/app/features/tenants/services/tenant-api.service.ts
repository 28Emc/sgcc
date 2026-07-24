import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiBaseService } from '../../../core/services/api-base.service';
import type { Tenant } from '../models/tenant.model';

export type { Tenant } from '../models/tenant.model';

@Injectable({
  providedIn: 'root'
})
export class TenantApiService extends ApiBaseService<Tenant> {
  constructor(http: HttpClient) {
    super(http, 'tenants');
  }
}
