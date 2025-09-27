import { TestBed } from '@angular/core/testing';

import { PerformanceStatsService } from './performance-stats.service.js';

describe('PerformanceStatsService', () => {
  let service: PerformanceStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerformanceStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
