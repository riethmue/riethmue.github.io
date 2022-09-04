import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputerModelComponent } from './computer-model.component';

describe('ComputerModelComponent', () => {
  let component: ComputerModelComponent;
  let fixture: ComponentFixture<ComputerModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComputerModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComputerModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
