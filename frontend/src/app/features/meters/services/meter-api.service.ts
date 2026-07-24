import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiBaseService } from '../../../core/services/api-base.service';
import type { Meter } from '../models/meter.model';

export type { Meter } from '../models/meter.model';

@Injectable({
  providedIn: 'root'
})
export class MeterApiService extends ApiBaseService<Meter> {
  constructor(http: HttpClient) {
    super(http, 'meters');
  }
}
