import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';
import { from, of, Subject } from 'rxjs';
import { concatMap, delay, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css'],
  standalone: true,
})
export class TerminalComponent implements AfterViewInit, OnDestroy {
  private term!: Terminal;
  private destroyed$ = new Subject<void>();
  private fitAddon!: FitAddon;
  private resizeObserver!: ResizeObserver;

  @ViewChild('term', { static: true })
  terminalContainer!: ElementRef<HTMLDivElement>;

  @Output() exit = new EventEmitter<void>();

  ngAfterViewInit(): void {
    this.term = new Terminal({
      cursorBlink: true,
      cursorStyle: 'underline',
      fontFamily: 'monospace',
      fontSize: 13,
      theme: {
        background: '#000000',
        foreground: '#00ff29',
        cursor: '#00ff29',
        selectionBackground: '#444444',
      },
    });

    this.fitAddon = new FitAddon();
    this.term.loadAddon(this.fitAddon);
    this.term.open(this.terminalContainer.nativeElement);
    this.fitAddon.fit();

    this.resizeObserver = new ResizeObserver(() => this.fitAddon.fit());
    this.resizeObserver.observe(this.terminalContainer.nativeElement);

    const greeting =
      'I am a fullstack developer, devops engineer and cloud architect.\r\n' +
      'I studied Computational visualistics and have a passion for all cloud-related topics and computer-aided graphics.\r\n' +
      'Do you want to have a look into my cv? [y/N]$%';

    this.emulateTyping(greeting, () => {
      this.term.focus();
      this.listenForInput();
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.resizeObserver?.disconnect();
    this.term?.dispose();
  }

  private listenForInput() {
    this.term.onKey((e) => {
      const key = e.key.toLowerCase();

      if (key === 'y') {
        const cmd = ' cat curriculumvitae.pdf%';
        this.emulateTyping(cmd, () => {
          const win = window.open('', '_blank');
          if (win) {
            win.location.href = 'assets/curriculum_vitae.pdf';
          } else {
            window.location.href = 'assets/curriculum_vitae.pdf';
          }
          this.exit.emit();
        });
      } else if (key === 'n') {
        this.exit.emit();
      } else {
        this.term.writeln('\r\n[~] command not found');
        this.term.write('[~] ');
      }
    });
  }

  private emulateTyping(text: string, endFn: () => void) {
    from(text.split(''))
      .pipe(
        takeUntil(this.destroyed$),
        concatMap((ch) => of(ch).pipe(delay(1)))
      )
      .subscribe((ch) => {
        switch (ch) {
          case '$':
            this.term.write('\r\n[~] ');
            break;
          case '%':
            endFn();
            break;
          default:
            this.term.write(ch);
        }
      });
  }
}
