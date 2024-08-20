import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoFinalCreateComponent } from './producto_final-create.component';

describe('ProductoFinalCreateComponent', () => {
  let component: ProductoFinalCreateComponent;
  let fixture: ComponentFixture<ProductoFinalCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductoFinalCreateComponent]
    });
    fixture = TestBed.createComponent(ProductoFinalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
