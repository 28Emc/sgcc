import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MeterApiService } from './meter-api.service';

describe('MeterApiService', () => {
  let service: MeterApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeterApiService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(MeterApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should find all meters', () => {
    const mockMeters = [
      { id: '1', unitId: 'u1', serviceId: 's1', serialNumber: 'MED-001', status: 'ACTIVE' },
      { id: '2', unitId: 'u2', serviceId: 's2', serialNumber: 'MED-002', status: 'INACTIVE' }
    ];

    service.findAll().subscribe(meters => {
      expect(meters.length).toBe(2);
      expect(meters[0].serialNumber).toBe('MED-001');
    });

    const req = httpMock.expectOne(r => r.url.endsWith('/meters'));
    expect(req.request.method).toBe('GET');
    req.flush(mockMeters);
  });

  it('should find meter by id', () => {
    const mockMeter = { id: '1', unitId: 'u1', serviceId: 's1', serialNumber: 'MED-001', status: 'ACTIVE' };

    service.findById('1').subscribe(meter => {
      expect(meter.serialNumber).toBe('MED-001');
    });

    const req = httpMock.expectOne(r => r.url.includes('/meters/1'));
    expect(req.request.method).toBe('GET');
    req.flush(mockMeter);
  });

  it('should create a meter', () => {
    const newMeter = { unitId: 'u1', serviceId: 's1', serialNumber: 'MED-003' };
    const createdMeter = { id: '3', ...newMeter, status: 'ACTIVE' };

    service.create(newMeter).subscribe(meter => {
      expect(meter.id).toBe('3');
      expect(meter.serialNumber).toBe('MED-003');
    });

    const req = httpMock.expectOne(r => r.url.endsWith('/meters'));
    expect(req.request.method).toBe('POST');
    req.flush(createdMeter);
  });

  it('should update a meter', () => {
    const update = { unitId: 'u1', serviceId: 's1', serialNumber: 'MED-001-UPDATED' };
    const updatedMeter = { id: '1', unitId: 'u1', serviceId: 's1', serialNumber: 'MED-001-UPDATED', status: 'ACTIVE' };

    service.update('1', update).subscribe(meter => {
      expect(meter.serialNumber).toBe('MED-001-UPDATED');
    });

    const req = httpMock.expectOne(r => r.url.includes('/meters/1'));
    expect(req.request.method).toBe('PUT');
    req.flush(updatedMeter);
  });

  it('should delete a meter', () => {
    service.delete('1').subscribe();

    const req = httpMock.expectOne(r => r.url.includes('/meters/1'));
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
