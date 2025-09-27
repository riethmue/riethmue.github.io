import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PerformanceStats {
  fps: number;
  calls: number;
  tris: number;
  lines: number;
  points: number;
  geos: number;
  texs: number;
}

@Injectable({ providedIn: 'root' })
export class PerformanceStatsService {
  private statsSubject = new BehaviorSubject<PerformanceStats | null>(null);
  stats$ = this.statsSubject.asObservable();

  update(stats: PerformanceStats) {
    this.statsSubject.next(stats);
  }
}
