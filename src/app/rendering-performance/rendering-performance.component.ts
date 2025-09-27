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
}
