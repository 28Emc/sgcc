export interface Meter {
  id?: string;
  unitId: string;
  serviceId: string;
  serialNumber: string;
  status?: string;
  serviceName?: string;
  unitName?: string;
  propertyName?: string;
  lastReadingValue?: number;
  unitOfMeasure?: string;
  serviceType?: string;
  createdAt?: string;
  updatedAt?: string;
}
