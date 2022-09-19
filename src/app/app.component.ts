import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  fromEvent,
  Observable,
  Subject,
  Subscription,
  takeUntil,
  timer,
} from 'rxjs';
import { InitialSceneConfig } from './computer-model/scene-constants';
import { ModelInteractionService } from './services/model-interaction.service';
import { MatDialog } from '@angular/material/dialog';
import { TerminalComponent } from './terminal/terminal.component';
import { MatIconRegistry } from '@angular/material/icon';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  sceneLoaded = false;
  @ViewChild('model') modelRef: ElementRef;
  resize$: Observable<Event>;
  destroyed$ = new Subject<void>();
  resizeTimerSub$: Subscription;
  faLinkedin = faLinkedin;
  AsciiGreeting =
    "                     _     \r\n                    | |    \r\n ___  __ _ _ __ __ _| |__  \r\n/ __|/ _` | '__/ _` | '_ \\ \r\n\\__ \\ (_| | | | (_| | | | |\r\n|___/\\__,_|_|  \\__,_|_| |_|\r\n                           \r\n                           \r\n      _      _   _                          _ _           \r\n     (_)    | | | |                        | | |          \r\n _ __ _  ___| |_| |__  _ __ ___  _   _  ___| | | ___ _ __ \r\n| '__| |/ _ \\ __| '_ \\| '_ ` _ \\| | | |/ _ \\ | |/ _ \\ '__|\r\n| |  | |  __/ |_| | | | | | | | | |_| |  __/ | |  __/ |   \r\n|_|  |_|\\___|\\__|_| |_|_| |_| |_|\\__,_|\\___|_|_|\\___|_|   \r\n                                                          \r\n                                                          ";

  constructor(
    private modelInteractionService: ModelInteractionService,
    public terminalDialog: MatDialog,
    private matIconRegistry: MatIconRegistry
  ) {
    this.matIconRegistry.addSvgIcon('test', 'assets/icon/linkedin.svg');
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  ngOnInit() {
    console.log(this.AsciiGreeting);
    this.resize$ = fromEvent(window, 'resize');
    this.resize$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      if (this.resizeTimerSub$) {
        this.resizeTimerSub$.unsubscribe();
      }
      this.resizeTimerSub$ = timer(200)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
          this.resizeView();
        });
    });
  }

  ngAfterViewInit() {
    const config: InitialSceneConfig = {
      size: {
        width: this.modelRef.nativeElement.offsetWidth,
        height: this.modelRef.nativeElement.offsetHeight,
      },
      devicePixelRatio: window.devicePixelRatio,
    };

    this.modelInteractionService.onSceneInitialized$.next(config);
  }

  onSceneLoaded() {
    this.sceneLoaded = true;
  }

  onModelClicked() {
    this.openTerminalDialog();
  }

  resizeView() {
    this.modelInteractionService.onScreenSizeChanged$.next([
      this.modelRef.nativeElement.offsetWidth,
      this.modelRef.nativeElement.offsetHeight,
    ]);
  }

  onResetView() {
    this.modelInteractionService.onResetView$.next();
  }

  openTerminalDialog() {
    let dialogRef = this.terminalDialog.open(TerminalComponent, {
      height: '64%',
      width: '40%', // golden ratio
      panelClass: 'terminal-dialog-container',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`); // TODO:
    });
  }
}
