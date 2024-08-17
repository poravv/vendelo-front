import { ComponentFixture, TestBed } from '@angular/core/testing';

import { sucursalCreateComponent } from './sucursal-create.component';

describe('sucursalCreateComponent', () => {
  let component: sucursalCreateComponent;
  let fixture: ComponentFixture<sucursalCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [sucursalCreateComponent]
    });
    fixture = TestBed.createComponent(sucursalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
