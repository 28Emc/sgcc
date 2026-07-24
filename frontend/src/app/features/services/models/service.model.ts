export interface Service {
  id?: string;
  name: string;
  measurementUnit: string;
  status?: 'ACTIVE' | 'INACTIVE' | string;
}
