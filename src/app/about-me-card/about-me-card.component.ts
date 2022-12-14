import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ModalComponent } from '../modal/modal.component';
@Component({
  selector: 'app-about-me-card',
  templateUrl: './about-me-card.component.html',
  styleUrls: ['./about-me-card.component.scss'],
})
export class AboutMeCardComponent implements OnInit {
  isLandscape: boolean = false;
  @ViewChild('modalComponent') modal:
    | ModalComponent<AboutMeCardComponent>
    | undefined;
  @Output()
  terminalExited = new EventEmitter<any>();
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

  onTerminalExited() {
    this.modal?.close();
  }

  ngOnInit(): void {}
}
