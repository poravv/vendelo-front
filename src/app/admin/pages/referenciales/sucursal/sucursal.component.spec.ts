import { ComponentFixture, TestBed } from '@angular/core/testing';

import { sucursalComponent } from './sucursal.component';

describe('sucursalComponent', () => {
  let component: sucursalComponent;
  let fixture: ComponentFixture<sucursalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [sucursalComponent]
    });
    fixture = TestBed.createComponent(sucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
