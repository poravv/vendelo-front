import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedReportComponent } from './save-report.component';

describe('SavedReportComponent', () => {
  let component: SavedReportComponent;
  let fixture: ComponentFixture<SavedReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavedReportComponent]
    });
    fixture = TestBed.createComponent(SavedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
