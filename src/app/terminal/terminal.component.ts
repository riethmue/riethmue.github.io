import {
  AfterViewInit,
  ElementRef,
  OnDestroy,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { OnChanges } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  from,
  of,
  concatMap,
  delay,
  takeUntil,
  Subject,
  filter,
  Observable,
  fromEvent,
  Subscription,
  timer,
} from 'rxjs';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TerminalComponent
  implements AfterViewInit, OnInit, OnChanges, OnDestroy
{
  @ViewChild('terminal') terminalRef: ElementRef;
  terminal: Terminal;
  fitAddon: FitAddon;
  destroyed$ = new Subject<void>();
  resize$: Observable<Event>;
  resizeTimerSub$: Subscription;
  constructor(public dialogRef: MatDialogRef<TerminalComponent>) {}

  ngOnInit() {
    this.resize$ = fromEvent(window, 'resize');
    this.resize$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      if (this.resizeTimerSub$) {
        this.resizeTimerSub$.unsubscribe();
      }
      this.resizeTimerSub$ = timer(200)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
          this.fitAddon.fit();
          const proposeDimensions: any = this.fitAddon.proposeDimensions();
          this.terminal.resize(proposeDimensions.cols, proposeDimensions.rows);
        });
    });
  }

  ngOnDestroy() {
    this.terminal.dispose();
    this.destroyed$.next();
    this.destroyed$.complete();
    //remove eventlistener ?
  }

  ngOnChanges(changes: SimpleChanges) {
    this.fitAddon.fit();
  }

  readInput() {
    this.terminal.onKey(({ key, domEvent }) => {
      if (key === 'Y' || key === 'y') {
        this.terminal.write(key);
        this.terminal.write('\r\n[~]');
        const output =
          'cd sarah\r\n[~/sarah] cat curriculumvitae.pdf$test https://www.google.com';
        this.emulateTyping(output);
      } else if (key === 'N' || key === 'n') {
        this.dialogRef.close();
      }
    });
  }

  emulateTyping(output: string) {
    from(output.split(''))
      .pipe(
        takeUntil(this.destroyed$), //takeuntil?
        concatMap((val) => of(val).pipe(delay(100)))
      )
      .subscribe((i) => {
        if (i === '$') {
          this.terminal.write('\r\n[~]');
        } else {
          this.terminal.write(i);
        }
      });
  }

  onClose() {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
    const xtermjsTheme = {
      foreground: '#72FF72',
      background: '#000000',
      selectionBackground: '#000000',
      black: '#000000',
      brightBlack: '#000000',
      red: '#ea00d9',
      brightRed: '#ea00d9',
      green: '#72FF72',
      brightGreen: '#72FF72',
      yellow: '#FFFF72',
      brightYellow: '#FFFF72',
      blue: '#133e7c',
      brightBlue: '#133e7c',
      magenta: '#711c91',
      brightMagenta: '#711c91',
      cyan: '#0abdc6',
      brightCyan: '#0abdc6',
      white: '#FFFFFF',
      brightWhite: '#FFFFFF',
    };
    this.terminal = new Terminal();
    this.terminal.options = {
      cursorBlink: true,
      cursorStyle: 'underline',
      theme: xtermjsTheme,
      fontSize: 15,
    };
    this.fitAddon = new FitAddon();
    this.terminal.loadAddon(this.fitAddon);
    this.terminal.loadAddon(new WebLinksAddon());
    this.terminal.open(this.terminalRef.nativeElement);
    this.fitAddon.fit();
    const greeding =
      "[~]Hi I'm Sarah.$I'm a software developer and exploring computers since 1996 👶 $Do you want to have a look into my cv? [y/N]$";
    this.emulateTyping(greeding);
    this.readInput();
  }
}
