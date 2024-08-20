import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoFinalComponent } from './producto_final.component';

describe('ProductoFinalComponent', () => {
  let component: ProductoFinalComponent;
  let fixture: ComponentFixture<ProductoFinalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductoFinalComponent]
    });
    fixture = TestBed.createComponent(ProductoFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
