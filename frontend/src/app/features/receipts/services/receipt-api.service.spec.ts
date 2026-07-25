import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ReceiptApiService } from './receipt-api.service';

describe('ReceiptApiService', () => {
  let service: ReceiptApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReceiptApiService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ReceiptApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should find all receipts', () => {
    const mockReceipts = [
      { id: '1', serviceId: 's1', period: '2026-07', receiptNumber: 'FAC-001', totalAmount: 1500, totalConsumption: 500, serviceName: 'Electricidad' },
      { id: '2', serviceId: 's2', period: '2026-07', receiptNumber: 'FAC-002', totalAmount: 800, totalConsumption: 200, serviceName: 'Agua' }
    ];

    service.findAll().subscribe(receipts => {
      expect(receipts.length).toBe(2);
      expect(receipts[0].receiptNumber).toBe('FAC-001');
    });

    const req = httpMock.expectOne(r => r.url.endsWith('/receipts'));
    expect(req.request.method).toBe('GET');
    req.flush(mockReceipts);
  });

  it('should find receipt by id', () => {
    const mockReceipt = { id: '1', serviceId: 's1', period: '2026-07', receiptNumber: 'FAC-001', totalAmount: 1500, totalConsumption: 500 };

    service.findById('1').subscribe(receipt => {
      expect(receipt.receiptNumber).toBe('FAC-001');
    });

    const req = httpMock.expectOne(r => r.url.includes('/receipts/1'));
    expect(req.request.method).toBe('GET');
    req.flush(mockReceipt);
  });

  it('should create a receipt', () => {
    const newReceipt = { serviceId: 's1', period: '2026-08', receiptNumber: 'FAC-003', totalAmount: 2000, totalConsumption: 600 };
    const createdReceipt = { id: '3', ...newReceipt };

    service.create(newReceipt).subscribe(receipt => {
      expect(receipt.id).toBe('3');
      expect(receipt.receiptNumber).toBe('FAC-003');
    });

    const req = httpMock.expectOne(r => r.url.endsWith('/receipts'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newReceipt);
    req.flush(createdReceipt);
  });

  it('should update a receipt', () => {
    const update = { serviceId: 's1', period: '2026-07', receiptNumber: 'FAC-001', totalAmount: 1800, totalConsumption: 500 };
    const updatedReceipt = { id: '1', serviceId: 's1', period: '2026-07', receiptNumber: 'FAC-001', totalAmount: 1800, totalConsumption: 500 };

    service.update('1', update).subscribe(receipt => {
      expect(receipt.totalAmount).toBe(1800);
    });

    const req = httpMock.expectOne(r => r.url.includes('/receipts/1'));
    expect(req.request.method).toBe('PUT');
    req.flush(updatedReceipt);
  });

  it('should delete a receipt', () => {
    service.delete('1').subscribe();

    const req = httpMock.expectOne(r => r.url.includes('/receipts/1'));
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
