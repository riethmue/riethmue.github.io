import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faGithub,
  faMedium,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { AboutMeCardComponent } from './about-me-card/about-me-card.component';
import { ComputerModelComponent } from './computer-model/computer-model.component';
import { InitialSceneConfig } from './computer-model/scene-constants';
import { ModalComponent } from './modal/modal.component';
import { ModalService } from './services/modal/modal.service';
import { ModelInteractionService } from './services/model-interaction/model-interaction.service';
import { log } from './services/debug-logger/debug-logger.service';
import { TerminalComponent } from './terminal/terminal.component';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    ComputerModelComponent,
  ],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('model', { static: false }) modelRef?: ElementRef<HTMLElement>;
  @ViewChild('appContainer', { read: ViewContainerRef, static: false })
  container?: ViewContainerRef;
  private platformId = inject(PLATFORM_ID);
  isBrowserEnv = isPlatformBrowser(this.platformId);
  sceneLoaded = false;
  sceneInitialized = false;
  destroyed$ = new Subject<void>();
  faXTwitter = faXTwitter;
  faMedium = faMedium;
  faGithub = faGithub;
  terminalWidth = 70;
  currentYear = new Date().getFullYear();
  debugShowSpinner = environment.debug.showSpinner;
  private lastOrientation: 'portrait' | 'landscape' | null = null;

  constructor(
    private modelInteractionService: ModelInteractionService,
    private modalService: ModalService,
    private cd: ChangeDetectorRef
  ) {
    log.info('App initialized', {
      production: environment.production,
      debugLogging: environment.debug.enableLogging,
      showSpinner: environment.debug.showSpinner,
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  ngOnInit(): void {
    if (this.isBrowserEnv) {
      // Track orientation changes
      fromEvent(window, 'resize')
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
          this.resizeView();
          this.updateOrientation();
        });
    }
  }
  ngAfterViewInit(): void {
    if (!this.isBrowserEnv || !this.modelRef) return;

    const el = this.modelRef.nativeElement;
    // Cap pixel ratio to 1.5 for performance (even high DPI displays)
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
    const config: InitialSceneConfig = {
      size: { width: el.offsetWidth, height: el.offsetHeight },
      devicePixelRatio: pixelRatio,
    };

    log.debug('Scene initialization', {
      width: el.offsetWidth,
      height: el.offsetHeight,
      pixelRatio,
    });

    this.sceneInitialized = true;
    this.cd.markForCheck();
    this.modelInteractionService.onSceneInitialized$.next(config);
    this.resizeView();
  }

  onSceneLoaded() {
    log.info('3D Scene loaded');
    this.sceneLoaded = true;
    this.cd.markForCheck();
  }

  onModelClicked() {
    this.onTerminalButtonClicked();
  }

  async onTerminalButtonClicked() {
    await this.modalService.open(AboutMeCardComponent);
  }

  resizeView(): void {
    if (!this.isBrowserEnv || !this.modelRef) return;
    const el = this.modelRef.nativeElement;
    this.modelInteractionService.onScreenSizeChanged$.next([
      el.offsetWidth,
      el.offsetHeight,
    ]);
  }

  updateOrientation(): void {
    const currentOrientation =
      window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';

    // Skip if orientation hasn't changed
    if (this.lastOrientation === currentOrientation) {
      return;
    }

    this.lastOrientation = currentOrientation;
    log.debug(`Orientation changed to ${currentOrientation}`);
  }

  onResetView() {
    this.modelInteractionService.onResetView$.next();
  }
}
