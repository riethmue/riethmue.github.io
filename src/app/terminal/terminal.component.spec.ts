import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Terminal2Component } from './terminal.component';

describe('Terminal2Component', () => {
  let component: Terminal2Component;
  let fixture: ComponentFixture<Terminal2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Terminal2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(Terminal2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
