export interface Receipt {
  id?: string;
  serviceId: string;
  serviceName?: string;
  period: string;
  receiptNumber: string;
  totalAmount: number;
  totalConsumption: number;
  createdAt?: string;
  updatedAt?: string;
}
