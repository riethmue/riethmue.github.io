import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PerformanceStatsService } from '../services/performance-stats/performance-stats.service';

@Component({
  selector: 'app-rendering-performance',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './rendering-performance.component.html',
  styleUrls: ['./rendering-performance.component.css'],
})
export class RenderingPerformanceComponent {
  stats$ = this.statsService.stats$;
  constructor(private statsService: PerformanceStatsService) {}

  getBar(value: number, max: number): string {
    const barLength = 10;
    const filled = Math.min(Math.round((value / max) * barLength), barLength);
    const empty = barLength - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }
}
