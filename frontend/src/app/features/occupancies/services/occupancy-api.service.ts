import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiBaseService } from '../../../core/services/api-base.service';
import type { Occupancy } from '../models/occupancy.model';

export type { Occupancy } from '../models/occupancy.model';

@Injectable({
  providedIn: 'root'
})
export class OccupancyApiService extends ApiBaseService<Occupancy> {
  constructor(http: HttpClient) {
    super(http, 'occupancies');
  }
}
