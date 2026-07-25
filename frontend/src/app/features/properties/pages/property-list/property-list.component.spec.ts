import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PropertyListComponent } from './property-list.component';

describe('PropertyListComponent', () => {
  let component: PropertyListComponent;
  let fixture: ComponentFixture<PropertyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyListComponent, NoopAnimationsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct displayed columns', () => {
    expect(component.displayedColumns).toEqual(['name', 'address', 'status', 'actions']);
  });

  it('should initialize with empty properties', () => {
    expect(component.properties()).toEqual([]);
  });

  it('should initialize with loading state', () => {
    expect(component.loading()).toBeTrue();
  });

  it('should initialize with closed drawer', () => {
    expect(component.drawerMode()).toBe('closed');
  });

  it('should filter properties by search term', () => {
    component.properties.set([
      { id: '1', name: 'Edificio Central', address: 'Av. Principal 123', status: 'ACTIVE' },
      { id: '2', name: 'Condominio Norte', address: 'Calle Secundaria 456', status: 'ACTIVE' }
    ]);
    component.searchTerm.set('Central');

    const filtered = component.filteredProperties();
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Edificio Central');
  });

  it('should return all properties when search is empty', () => {
    component.properties.set([
      { id: '1', name: 'Edificio Central', address: 'Av. Principal 123', status: 'ACTIVE' },
      { id: '2', name: 'Condominio Norte', address: 'Calle Secundaria 456', status: 'ACTIVE' }
    ]);
    component.searchTerm.set('');

    expect(component.filteredProperties().length).toBe(2);
  });

  it('should open create drawer', () => {
    component.openCreate();
    expect(component.drawerMode()).toBe('create');
    expect(component.selectedProperty()).toBeNull();
  });

  it('should open view drawer', () => {
    const property = { id: '1', name: 'Edificio Central', address: 'Av. Principal 123', status: 'ACTIVE' };
    component.openView(property);
    expect(component.drawerMode()).toBe('view');
    expect(component.selectedProperty()?.name).toBe('Edificio Central');
  });

  it('should open edit drawer', () => {
    const property = { id: '1', name: 'Edificio Central', address: 'Av. Principal 123', status: 'ACTIVE' };
    component.openEdit(property);
    expect(component.drawerMode()).toBe('edit');
    expect(component.form.get('name')?.value).toBe('Edificio Central');
  });

  it('should close drawer', () => {
    component.openCreate();
    expect(component.drawerMode()).toBe('create');
    component.closeDrawer();
    expect(component.drawerMode()).toBe('closed');
  });
});
