import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TerminalComponent } from '../terminal/terminal.component';

@Component({
  selector: 'app-about-me-card',
  templateUrl: './about-me-card.component.html',
  styleUrls: ['./about-me-card.component.css'],
  standalone: true,
  imports: [TerminalComponent],
})
export class AboutMeCardComponent implements OnInit {
  isLandscape: boolean = false;
  @Output()
  terminalExited = new EventEmitter<any>();

  constructor(public breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe(['(orientation: landscape)'])
      .subscribe((state) => {
        this.isLandscape = state.matches;
      });
  }

  onTerminalExited() {}

  ngOnInit(): void {}
}
