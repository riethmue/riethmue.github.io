import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  faGithub,
  faMedium,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { Observable, Subject, fromEvent, takeUntil } from 'rxjs';
import { InitialSceneConfig } from './computer-model/scene-constants';
import { ModalService } from './services/modal/modal.service';
import { AboutMeCardComponent } from './about-me-card/about-me-card.component';
import { ModelInteractionService } from './services/model-interaction/model-interaction.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('model') modelRef: ElementRef;
  @ViewChild('appContainer', { read: ViewContainerRef })
  container: ViewContainerRef;
  sceneLoaded = false;
  resize$: Observable<Event>;
  destroyed$ = new Subject<void>();
  faTwitter = faTwitter;
  faMedium = faMedium;
  faGithub = faGithub;
  terminalWidth = 70;
  currentYear = new Date().getFullYear();
  AsciiGreeting = `
  ######   ###  #######  #######  #     #  #     #  #     #  ####### 
  #     #   #   #           #     #     #  ##   ##  #     #  #       
  #     #   #   #           #     #     #  # # # #  #     #  #       
  ######    #   #####       #     #######  #  #  #  #     #  #####   
  #   #     #   #           #     #     #  #     #  #     #  #       
  #    #    #   #           #     #     #  #     #  #     #  #       
  #     #  ###  #######     #     #     #  #     #   #####   ####### 
  `;

  constructor(
    private modelInteractionService: ModelInteractionService,
    private modalService: ModalService<AboutMeCardComponent>
  ) {}

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  ngOnInit() {
    this.resize$ = fromEvent(window, 'resize');
    this.resize$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.resizeView();
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

  onModelClicked() {}

  async onTerminalButtonClicked() {
    await this.modalService.open(AboutMeCardComponent);
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
}
