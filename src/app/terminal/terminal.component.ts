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
})
export class TerminalComponent implements OnInit {
  output = '[~] ';
  destroyed$ = new Subject<void>();
  @ViewChild('terminal') terminal: ElementRef;
  @Output()
  exit = new EventEmitter<any>();
  ngOnInit(): void {
    const greeding =
      'I am a fullstack developer, studied Computational visualistics and have a passion for cloud-topics and computer-aided graphics. Do you want to have a look into my cv? [y/N]$%';
    this.emulateTyping(greeding, () => {
      this.terminal.nativeElement.focus();
    });
    window.location.hash = '#terminal';
  }

  onkeyPress = (e) => {
    const keyboard = (window.navigator as any).keyboard;
    keyboard.getLayoutMap().then((keyboardLayoutMap: any) => {
      const keyValue = keyboardLayoutMap.get(e.code);

      switch (keyValue) {
        case 'y' || 'Y':
          const output = ' cat curriculumvitae.pdf%';
          this.emulateTyping(output, () => {
            window.open('assets/curriculum_vitae.pdf');
            this.exit.emit();
          });
          break;
        case 'n' || 'N':
          this.exit.emit();
          break;
        default:
          this.output += '\r\n[~]';
          this.output += 'command not found';
          break;
      }
    });
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
