import { TestBed } from '@angular/core/testing';

import { ModelInteractionService } from './model-interaction.service';

describe('ModelInteractionService', () => {
  let service: ModelInteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelInteractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
