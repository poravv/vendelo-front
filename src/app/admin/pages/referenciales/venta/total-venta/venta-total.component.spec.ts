import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VentaTotalComponent } from './venta-total.component';

describe('VentaComponent', () => {
  let component: VentaTotalComponent;
  let fixture: ComponentFixture<VentaTotalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VentaTotalComponent]
    });
    fixture = TestBed.createComponent(VentaTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
