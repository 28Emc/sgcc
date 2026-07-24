import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiBaseService } from '../../../core/services/api-base.service';
import type { Reading } from '../models/reading.model';

export type { Reading } from '../models/reading.model';

@Injectable({
  providedIn: 'root'
})
export class ReadingApiService extends ApiBaseService<Reading> {
  constructor(http: HttpClient) {
    super(http, 'readings');
  }
}
