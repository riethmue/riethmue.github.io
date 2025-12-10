import {
  AfterViewInit,
  Component,
  DOCUMENT,
  ElementRef,
  EventEmitter,
  Inject,
  inject,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';
import { from, of, Subject } from 'rxjs';
import { concatMap, delay, takeUntil } from 'rxjs/operators';
import { Command } from '../util/command.enum';
import { isMobile } from '../util/utils';

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
  private keySub?: { dispose: () => void };
  private inputBuffer = '';
  private isMobile = isMobile();

  @ViewChild('term', { static: true })
  terminalContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('hiddenInput', { static: true })
  hiddenInput!: ElementRef<HTMLTextAreaElement>;
  @Output() exit = new EventEmitter<void>();

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngAfterViewInit(): void {
    this.term = new Terminal({
      cursorBlink: true,
      cursorStyle: 'underline',
      fontFamily: 'monospace',
      fontSize: 13,
      lineHeight: 1.2,
      letterSpacing: 1,
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

    // safari: disable autocaps
    const el = this.hiddenInput.nativeElement;
    (el as any).autocapitalize = 'none';

    setTimeout(() => {
      this.fitAddon.fit();
    }, 0);

    this.resizeObserver = new ResizeObserver(() => this.fitAddon.fit());
    this.resizeObserver.observe(this.terminalContainer.nativeElement);

    const greeting =
      'Welcome to SarahOS [Version 1.0.0]\r\n' +
      '(c) 2025 Sarah Riethmüller. All rights reserved.\r\n' +
      '\r\n' +
      'Type "help" to see available commands.\r\n%';

    this.emulateTyping(greeting, () => {
      this.term.writeln('');
      this.printAscii();
      this.term.write('[~] ');
      this.term.focus();
      this.focusHiddenInput();
      this.listenForInput();
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.keySub?.dispose();
    this.resizeObserver?.disconnect();
    this.term?.dispose();
  }

  private asciiMini = [
    '                      _     ',
    '                     | |    ',
    '  ___  __ _ _ __ __ _| |__  ',
    " / __|/ _` | '__/ _` | '_ \\ ",
    ' \\__ \\ (_| | | | (_| | | | |',
    ' |___/\\__,_|_|  \\__,_|_| |_|',
    '                            ',
    '                            ',
  ];
  private asciiBig = [
    ' ░▒▓███████▓▒░░▒▓██████▓▒░░▒▓███████▓▒░ ░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░ ',
    '░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ',
    '░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ',
    ' ░▒▓██████▓▒░░▒▓████████▓▒░▒▓███████▓▒░░▒▓████████▓▒░▒▓████████▓▒░ ',
    '       ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ',
    '       ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ',
    '░▒▓███████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ',
    '                                                                   ',
  ];

  private printAscii() {
    const banner = window.innerWidth < 700 ? this.asciiMini : this.asciiBig;

    banner.forEach((line) => this.term.writeln(line));
    this.term.writeln('');
  }

  private focusHiddenInput() {
    const el = this.hiddenInput.nativeElement;
    el.focus({ preventScroll: true });
    // sarari-hack: cursor at the end
    el.setSelectionRange(el.value.length, el.value.length);
  }

  private listenForInput() {
    if (this.isMobile) {
      // --- iOS/Android workaround via hidden input ---
      const el = this.hiddenInput.nativeElement;
      (el as any).autocapitalize = 'none'; // Safari-only property
      el.autocomplete = 'off';
      el.autocorrect = false;
      el.spellcheck = false;

      el.addEventListener('input', () => {
        const value = el.value;
        if (value) {
          this.inputBuffer += value;
          this.term.write(value);
          el.value = ''; // leeren
        }
      });

      el.addEventListener('keydown', (ev: KeyboardEvent) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          const cmd = this.inputBuffer.trim();
          this.term.write('\r\n');
          this.handleCommand(cmd);
          this.inputBuffer = '';
          this.term.write('[~] ');
        } else if (ev.key === 'Backspace') {
          if (this.inputBuffer.length > 0) {
            this.inputBuffer = this.inputBuffer.slice(0, -1);
            this.term.write('\b \b');
          }
        }
      });

      // click into terminal setzt hidden input
      this.terminalContainer.nativeElement.addEventListener('click', () =>
        el.focus()
      );
    } else {
      // --- dekstop: xterm KeyListener ---
      this.keySub = this.term.onKey(({ key, domEvent }) => {
        const ev = domEvent;
        if (ev.key === 'Enter') {
          const cmd = this.inputBuffer.trim();
          this.term.write('\r\n');
          this.handleCommand(cmd);
          this.inputBuffer = '';
          this.term.write('[~] ');
        } else if (ev.key === 'Backspace') {
          if (this.inputBuffer.length > 0) {
            this.inputBuffer = this.inputBuffer.slice(0, -1);
            this.term.write('\b \b');
          }
        } else if (key.length === 1) {
          this.inputBuffer += key;
          this.term.write(key);
        }
      });
    }
  }

  private handleCommand(cmd: string) {
    switch (cmd.toLowerCase()) {
      case Command.Help:
        this.showHelp();
        break;

      case 'cv':
        const win = window.open('', '_blank');
        if (win) {
          win.location.href = 'assets/curriculum_vitae.pdf';
        } else {
          window.location.href = 'assets/curriculum_vitae.pdf';
        }
        this.exit.emit();
        break;

      case Command.About:
        this.term.writeln('👩🏻‍💻 Sarah Riethmüller');
        this.term.writeln('Fullstack Dev, Cloud Architect, DevOps');
        this.term.writeln('Passionate about 3D, graphics & retro vibes ✨');
        break;

      case Command.Skills:
        this.term.writeln('=== Languages ===');
        this.term.writeln('  • TypeScript, Python, C#, SQL');
        this.term.writeln('');
        this.term.writeln('=== Frameworks ===');
        this.term.writeln('  • Angular, React, Node.js');
        this.term.writeln('');
        this.term.writeln('=== Cloud ===');
        this.term.writeln('  • Azure ☁️');
        this.term.writeln('');
        this.term.writeln('=== DevOps ===');
        this.term.writeln(
          '  • Terraform, Docker, GitHub Actions, Azure DevOps'
        );
        this.term.writeln('');
        this.term.writeln('=== Databases ===');
        this.term.writeln('  • MySQL, MariaDB, SQLite, Cosmos DB');
        break;

      case Command.Info:
        this.printAscii();
        this.term.writeln('');
        this.term.writeln('Welcome to SarahOS [Version 1.0.0]');
        this.term.writeln('(c) 2025 Sarah Riethmüller. All rights reserved.');
        this.term.writeln('');
        this.term.writeln('Type "help" to see available commands.');
        break;

      case Command.Fortune:
        const fortunes = [
          '💡 Code is like humor. When you have to explain it, it’s bad.',
          '🚀 There is no cloud… just someone else’s computer.',
          '👾 Hack the planet!',
          '🐺 Trust your instincts, like a wolf in the wild.',
          '✨ Keep it retro, keep it green.',
        ];
        const random = fortunes[Math.floor(Math.random() * fortunes.length)];
        this.term.writeln('');
        this.term.writeln('--------------------------------');
        this.term.writeln(random);
        this.term.writeln('--------------------------------');
        this.term.writeln('');
        break;

      case Command.Projects:
        this.term.writeln('🔹 Vaultwarden on Azure (Terraform, DevOps)');
        this.term.writeln('🔹 Exopulse Mollii Suit App (Ottobock)');
        this.term.writeln('🔹 3D Experiments with Three.js + Angular');
        break;

      case Command.Contact:
        this.term.writeln('📧 Mail: sarah@example.com');
        this.term.writeln('🐦 Twitter: @riethmue93');
        this.term.writeln('💻 GitHub: github.com/riethmue');
        break;

      case Command.Hobbies:
        this.term.writeln('=== Hobbies ===');
        this.term.writeln('  • 🥋 Martial Arts (Krav Maga)');
        this.term.writeln('  • 🎮 Retro Gaming & Retro Consoles');
        this.term.writeln('  • 🌱 gardening');
        this.term.writeln('  • 📚 Reading');
        this.term.writeln('  • 👩🏻‍💻 Experimenting with AI & 3D graphics');
        break;

      case 'jil':
        this.term.writeln('');
        this.term.writeln('╔═══════════════════════════════════╗');
        this.term.writeln('║                                   ║');
        this.term.writeln('║        I love you 💚              ║');
        this.term.writeln('║                                   ║');
        this.term.writeln('╚═══════════════════════════════════╝');
        this.term.writeln('');
        break;

      case Command.Clear:
        this.term.clear();
        break;

      case '':
        break;

      default:
        this.term.writeln(`command not found: ${cmd}`);
    }

    // Auto-scroll to bottom after output
    this.term.scrollToBottom();
  }

  private showHelp() {
    const descriptions: Record<Command, string> = {
      [Command.Help]: 'Show this help',
      [Command.Cv]: 'Open my CV',
      [Command.About]: 'Info about me',
      [Command.Skills]: 'Show my skills',
      [Command.Hobbies]: 'Show my hobbies',
      [Command.Fortune]: 'Random fortune',
      [Command.Info]: 'Show system info',
      [Command.Clear]: 'Clear terminal',
      [Command.Projects]: 'List my projects',
      [Command.Contact]: 'Show contact info',
    };

    this.term.writeln('+-------------------------------+');
    this.term.writeln('|       Available Commands      |');
    this.term.writeln('+-------------------------------+');

    Object.entries(descriptions).forEach(([cmd, desc]) => {
      this.term.writeln(`| ${cmd.padEnd(8)} - ${desc.padEnd(17)}|`);
    });

    this.term.writeln('+-------------------------------+');
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
