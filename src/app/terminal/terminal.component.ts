import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { concatMap, delay, from, of, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-terminal',
    templateUrl: './terminal.component.html',
    styleUrls: ['./terminal.component.scss'],
    standalone: false
})
export class TerminalComponent implements OnInit {
  output = '[~] ';
  destroyed$ = new Subject<void>();
  @ViewChild('terminal') terminal: ElementRef;
  @Output()
  exit = new EventEmitter<any>();
  ngOnInit(): void {
    const greeding =
      'I am a fullstack developer, studied Computational visualistics and have a passion for cloud-related topics and computer-aided graphics. Do you want to have a look into my cv? [y/N]$%';
    this.emulateTyping(greeding, () => {
      this.terminal.nativeElement.focus();
    });
    window.location.hash = '#terminal';
  }

  onkeyPress = (e) => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    const isYKey =
      (isMobile && (e.keyCode === 121 || e.keyCode === 89)) ||
      (!isMobile && (e.key === 'y' || e.key === 'Y'));

    const isNKey =
      (isMobile && (e.keyCode === 110 || e.keyCode === 78)) ||
      (!isMobile && (e.key === 'n' || e.key === 'N'));

    if (isYKey) {
      const output = ' cat curriculumvitae.pdf%';
      this.emulateTyping(output, () => {
        window.open('assets/curriculum_vitae.pdf');
        this.exit.emit();
      });
    } else if (isNKey) {
      this.exit.emit();
    } else {
      this.output += '\r\n[~] command not found';
    }
  };

  emulateTyping(output: string, endFunction?: () => void) {
    from(output.split(''))
      .pipe(
        takeUntil(this.destroyed$),
        concatMap((val) => of(val).pipe(delay(50)))
      )
      .subscribe((i) => {
        switch (i) {
          case '$':
            this.output += '\r\n[~]';
            break;
          case '%':
            endFunction();
            break;
          default:
            this.output += i;
            break;
        }
      });
  }
}
