import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MeterListComponent } from './meter-list.component';

describe('MeterListComponent', () => {
  let component: MeterListComponent;
  let fixture: ComponentFixture<MeterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeterListComponent, NoopAnimationsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(MeterListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct displayed columns', () => {
    expect(component.displayedColumns).toEqual(['serialNumber', 'location', 'lastReading', 'status', 'actions']);
  });

  it('should initialize with empty meters', () => {
    expect(component.meters()).toEqual([]);
  });

  it('should initialize with loading state', () => {
    expect(component.loading()).toBeTrue();
  });

  it('should initialize with closed drawer', () => {
    expect(component.drawerMode()).toBe('closed');
  });

  it('should filter meters by serial number', () => {
    component.meters.set([
      { id: '1', unitId: 'u1', serviceId: 's1', serialNumber: 'MED-ELEC-001', serviceName: 'Electricidad', unitName: 'Apt 101', propertyName: 'Edificio Central', status: 'ACTIVE' },
      { id: '2', unitId: 'u2', serviceId: 's2', serialNumber: 'MED-AGUA-002', serviceName: 'Agua', unitName: 'Apt 102', propertyName: 'Edificio Central', status: 'ACTIVE' }
    ]);
    component.searchTerm.set('ELEC');

    const filtered = component.filteredMeters();
    expect(filtered.length).toBe(1);
    expect(filtered[0].serialNumber).toBe('MED-ELEC-001');
  });

  it('should filter meters by service name', () => {
    component.meters.set([
      { id: '1', unitId: 'u1', serviceId: 's1', serialNumber: 'MED-ELEC-001', serviceName: 'Electricidad', unitName: 'Apt 101', propertyName: 'Edificio Central', status: 'ACTIVE' },
      { id: '2', unitId: 'u2', serviceId: 's2', serialNumber: 'MED-AGUA-002', serviceName: 'Agua Potable', unitName: 'Apt 102', propertyName: 'Edificio Central', status: 'ACTIVE' }
    ]);
    component.searchTerm.set('Agua');

    const filtered = component.filteredMeters();
    expect(filtered.length).toBe(1);
    expect(filtered[0].serviceName).toBe('Agua Potable');
  });

  it('should open create drawer', () => {
    component.openCreate();
    expect(component.drawerMode()).toBe('create');
    expect(component.selectedMeter()).toBeNull();
  });

  it('should open view drawer', () => {
    const meter = { id: '1', unitId: 'u1', serviceId: 's1', serialNumber: 'MED-ELEC-001', serviceName: 'Electricidad', status: 'ACTIVE' };
    component.openView(meter);
    expect(component.drawerMode()).toBe('view');
    expect(component.selectedMeter()?.serialNumber).toBe('MED-ELEC-001');
  });

  it('should open edit drawer with form values', () => {
    const meter = { id: '1', unitId: 'u1', serviceId: 's1', serialNumber: 'MED-ELEC-001', serviceName: 'Electricidad', status: 'ACTIVE' };
    component.openEdit(meter);
    expect(component.drawerMode()).toBe('edit');
    expect(component.form.get('serialNumber')?.value).toBe('MED-ELEC-001');
    expect(component.form.get('serviceId')?.value).toBe('s1');
    expect(component.form.get('unitId')?.value).toBe('u1');
  });

  it('should close drawer', () => {
    component.openCreate();
    expect(component.drawerMode()).toBe('create');
    component.closeDrawer();
    expect(component.drawerMode()).toBe('closed');
  });

  it('should return correct service icon', () => {
    expect(component.getServiceIcon('Electricidad')).toBe('bolt');
    expect(component.getServiceIcon('Agua Potable')).toBe('water_drop');
    expect(component.getServiceIcon('Gas Natural')).toBe('local_fire_department');
    expect(component.getServiceIcon('Internet')).toBe('speed');
  });

  it('should paginate correctly', () => {
    const meters = Array.from({ length: 25 }, (_, i) => ({
      id: `${i}`,
      unitId: 'u1',
      serviceId: 's1',
      serialNumber: `MED-${i}`,
      status: 'ACTIVE'
    }));
    component.meters.set(meters);
    component.pageSize.set(10);
    component.pageIndex.set(0);

    expect(component.paginatedMeters().length).toBe(10);

    component.pageIndex.set(2);
    expect(component.paginatedMeters().length).toBe(5);
  });
});
