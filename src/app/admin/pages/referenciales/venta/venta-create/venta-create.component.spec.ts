import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaCreateComponent } from './venta-create.component';

describe('VentaCreateComponent', () => {
  let component: VentaCreateComponent;
  let fixture: ComponentFixture<VentaCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VentaCreateComponent]
    });
    fixture = TestBed.createComponent(VentaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
