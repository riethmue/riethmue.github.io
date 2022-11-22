import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
@Component({
  selector: 'app-about-me-card',
  templateUrl: './about-me-card.component.html',
  styleUrls: ['./about-me-card.component.scss'],
})
export class AboutMeCardComponent implements OnInit {
  isLandscape: boolean = false;
  constructor(public breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe(['(max-height: 500px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isLandscape = true;
        } else {
          this.isLandscape = false;
        }
      });
  }

  ngOnInit(): void {}
}
