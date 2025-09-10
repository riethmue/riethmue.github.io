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

  @ViewChild('term', { static: true })
  terminalContainer!: ElementRef<HTMLDivElement>;
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
    console.log(
      'Terminal opened, container:',
      this.terminalContainer.nativeElement
    );

    // check size after open
    const rect = this.terminalContainer.nativeElement.getBoundingClientRect();
    console.log('Terminal container rect:', rect);

    this.fitAddon.fit();

    this.resizeObserver = new ResizeObserver(() => this.fitAddon.fit());
    this.resizeObserver.observe(this.terminalContainer.nativeElement);

    const greeting =
      'Welcome to SarahOS [Version 1.0.0]\r\n' +
      '(c) 2025 Sarah Riethmüller. All rights reserved.\r\n' +
      '\r\n' +
      'Type "help" to see available commands.\r\n%';

    this.emulateTyping(greeting, () => {
      this.term.writeln('');
      this.term.write('[~] ');
      this.term.focus();
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

  private listenForInput() {
    this.keySub = this.term.onKey(({ key, domEvent }) => {
      console.log('key', key, 'domevent', domEvent);
      const ev = domEvent;
      if (ev.key === 'Enter') {
        const cmd = this.inputBuffer.trim();
        this.term.write('\r\n'); // move to next line
        this.handleCommand(cmd);
        this.inputBuffer = '';
        this.term.write('[~] '); // prompt
      } else if (ev.key === 'Backspace') {
        if (this.inputBuffer.length > 0) {
          this.inputBuffer = this.inputBuffer.slice(0, -1);
          this.term.write('\b \b'); // delete char visually
        }
      } else if (key.length === 1) {
        this.inputBuffer += key;
        this.term.write(key); // echo character
      }
    });
  }

  private printAscii() {
    this.term.writeln('                                        __       ');
    this.term.writeln('                                       |  \\      ');
    this.term.writeln('  _______   ______    ______   ______  | $$____  ');
    this.term.writeln(' /       \\ |      \\  /      \\ |      \\ | $$    \\ ');
    this.term.writeln(
      '|  $$$$$$$  \\$$$$$$\\|  $$$$$$\\ \\$$$$$$\\| $$$$$$$\\'
    );
    this.term.writeln(' \\$$    \\  /      $$| $$   \\$$/      $$| $$  | $$');
    this.term.writeln(' _\\$$$$$$\\|  $$$$$$$| $$     |  $$$$$$$| $$  | $$');
    this.term.writeln('|       $$ \\$$    $$| $$      \\$$    $$| $$  | $$');
    this.term.writeln(
      ' \\$$$$$$$   \\$$$$$$$ \\$$       \\$$$$$$$ \\$$   \\$$'
    );
    this.term.writeln('');
  }

  private handleCommand(cmd: string) {
    switch (cmd.toLowerCase()) {
      case 'help':
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

      case 'about':
        this.term.writeln('👩🏻‍💻 Sarah Riethmüller');
        this.term.writeln('Fullstack Dev, Cloud Architect, DevOps');
        this.term.writeln('Passionate about 3D, graphics & retro vibes ✨');
        break;

      case 'skills':
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

      case 'info':
        this.term.writeln('                                        __       ');
        this.term.writeln('                                       |  \\      ');
        this.term.writeln('  _______   ______    ______   ______  | $$____  ');
        this.term.writeln(
          ' /       \\ |      \\  /      \\ |      \\ | $$    \\ '
        );
        this.term.writeln(
          '|  $$$$$$$  \\$$$$$$\\|  $$$$$$\\ \\$$$$$$\\| $$$$$$$\\'
        );
        this.term.writeln(
          ' \\$$    \\  /      $$| $$   \\$$/      $$| $$  | $$'
        );
        this.term.writeln(
          ' _\\$$$$$$\\|  $$$$$$$| $$     |  $$$$$$$| $$  | $$'
        );
        this.term.writeln(
          '|       $$ \\$$    $$| $$      \\$$    $$| $$  | $$'
        );
        this.term.writeln(
          ' \\$$$$$$$   \\$$$$$$$ \\$$       \\$$$$$$$ \\$$   \\$$'
        );
        this.term.writeln('');
        this.term.writeln('Welcome to SarahOS [Version 1.0.0]');
        this.term.writeln('(c) 2025 Sarah Riethmüller. All rights reserved.');
        this.term.writeln('');
        this.term.writeln('Type "help" to see available commands.');
        break;

      case 'fortune':
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

      case 'projects':
        this.term.writeln('🔹 Vaultwarden on Azure (Terraform, DevOps)');
        this.term.writeln('🔹 Exopulse Mollii Suit App (Ottobock)');
        this.term.writeln('🔹 3D Experiments with Three.js + Angular');
        break;

      case 'contact':
        this.term.writeln('📧 Mail: sarah@example.com');
        this.term.writeln('🐦 Twitter: @riethmue93');
        this.term.writeln('💻 GitHub: github.com/riethmue');
        break;

      // easteregg
      case 'hobbies':
        this.term.writeln('=== Hobbies ===');
        this.term.writeln('  • 🥋 Martial Arts (Krav Maga)');
        this.term.writeln('  • 🎮 Retro Gaming & Retro Consoles');
        this.term.writeln('  • 📚 Reading');
        this.term.writeln('  • 👩🏻‍💻 Experimenting with AI & 3D graphics');
        break;

      case 'clear':
        this.term.clear();
        break;

      case '':
        break;

      default:
        this.term.writeln(`command not found: ${cmd}`);
    }
  }

  private showHelp() {
    const lines = [
      '+-------------------------------+',
      '|       Available Commands      |',
      '+-------------------------------+',
      '| help     - Show this help     |',
      '| cv       - Open my CV         |',
      '| about    - Info about me      |',
      '| skills   - Show my skills     |',
      '| hobbies  - Show my hobbies    |',
      '| fortune  - Random fortune     |',
      '| info   - Show system info     |',
      '| clear    - Clear terminal     |',
      '+-------------------------------+',
    ];
    lines.forEach((line) => this.term.writeln(line));
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
