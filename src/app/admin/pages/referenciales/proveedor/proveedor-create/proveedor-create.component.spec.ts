import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedorCreateComponent } from './proveedor-create.component';

describe('ProveedorCreateComponent', () => {
  let component: ProveedorCreateComponent;
  let fixture: ComponentFixture<ProveedorCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProveedorCreateComponent]
    });
    fixture = TestBed.createComponent(ProveedorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
