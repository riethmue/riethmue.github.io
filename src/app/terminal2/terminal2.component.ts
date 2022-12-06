import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { concatMap, delay, from, of, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-terminal2',
  templateUrl: './terminal2.component.html',
  styleUrls: ['./terminal2.component.scss'],
})
export class Terminal2Component implements OnInit {
  output = '[~] ';
  destroyed$ = new Subject<void>();
  @Output()
  exit = new EventEmitter<any>();
  ngOnInit(): void {
    const greeding =
      'I am a fullstack developer, studied Computational visualistics and have a passion for cloud-topics and computer-aided graphics. Do you want to have a look into my cv? [y/N]$';
    this.emulateTyping(greeding);
    window.location.hash = '#terminal';
  }

  onkeyPress = (e) => {
    const keyboard = (window.navigator as any).keyboard;
    keyboard.getLayoutMap().then((keyboardLayoutMap: any) => {
      const keyValue = keyboardLayoutMap.get(e.code);

      switch (keyValue) {
        case 'y' || 'Y':
          const output = '$ cat curriculumvitae.pdf%';
          this.emulateTyping(output, () => {
            window.open('assets/curriculum_vitae.pdf');
          });
          break;
        case 'n' || 'N':
          console.log('case n');
          this.exit.emit();
          break;
        default:
          this.output += '\r\n[~]';
          this.output += 'command not found';
          break;
      }

      console.log(
        `code: ${e.code}  <->  key: ${e.key}  <->  result: ${keyValue}`
      );
    });
  };
  emulateTyping(output: string, endFunction?: () => void) {
    from(output.split(''))
      .pipe(
        takeUntil(this.destroyed$),
        concatMap((val) => of(val).pipe(delay(10)))
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
