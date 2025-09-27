import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderingPerformanceComponent } from './rendering-performance.component';

describe('RenderingPerformanceComponent', () => {
  let component: RenderingPerformanceComponent;
  let fixture: ComponentFixture<RenderingPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenderingPerformanceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RenderingPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
