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
import { TerminalComponent } from './terminal/terminal.component';
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

  constructor(
    private modelInteractionService: ModelInteractionService,
    private modalService: ModalService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  ngOnInit(): void {
    if (this.isBrowserEnv) {
      // only subscribe if window exists
      fromEvent(window, 'resize')
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => this.resizeView());
    }
  }
  ngAfterViewInit(): void {
    if (!this.isBrowserEnv || !this.modelRef) return;

    const el = this.modelRef.nativeElement;
    const config: InitialSceneConfig = {
      size: { width: el.offsetWidth, height: el.offsetHeight },
      devicePixelRatio: window.devicePixelRatio,
    };

    // defer emit to next macrotask so child subscriptions are active
    setTimeout(() => {
      this.sceneInitialized = true;
      this.cd.markForCheck();
      this.modelInteractionService.onSceneInitialized$.next(config);
      this.resizeView();
    });
  }

  onSceneLoaded() {
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

  onResetView() {
    this.modelInteractionService.onResetView$.next();
  }
}
