export interface Settlement {
  id?: string;
  receiptId: string;
  tenantId: string;
  consumption: number;
  unitValue: number;
  calculatedAmount: number;
  adjustmentAmount: number;
  finalAmount: number;
  status: string;
  tenantName?: string;
  propertyId?: string;
  receiptNumber?: string;
  period?: string;
  createdAt?: string;
}

export interface TenantConsumption {
  tenantId: string;
  consumption: number;
}
