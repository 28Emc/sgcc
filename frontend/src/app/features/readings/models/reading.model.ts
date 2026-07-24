export interface Reading {
  id?: string;
  meterId: string;
  readingDate: string;
  readingValue: number;
  previousValue?: number;
  meterSerial?: string;
  tenantName?: string;
  unitName?: string;
  createdAt?: string;
}
