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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  sceneLoaded = false;
  @ViewChild('model') modelRef: ElementRef;
  resize$: Observable<Event>;
  destroyed$ = new Subject<void>();
  resizeTimerSub$: Subscription;

  constructor(
    private modelInteractionService: ModelInteractionService,
    public terminalDialog: MatDialog
  ) {}

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  ngOnInit() {
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
