import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiBaseService } from '../../../core/services/api-base.service';
import type { Receipt } from '../models/receipt.model';

export type { Receipt } from '../models/receipt.model';

@Injectable({
  providedIn: 'root'
})
export class ReceiptApiService extends ApiBaseService<Receipt> {
  constructor(http: HttpClient) {
    super(http, 'receipts');
  }
}
