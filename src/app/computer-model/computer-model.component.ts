import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { Subject } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';
import * as THREE from 'three';

import { ModelInteractionService } from '../services/model-interaction/model-interaction.service';
import { ModelScene } from './model-scene';
import { InitialSceneConfig } from './scene-constants';

@Component({
  selector: 'app-computer-model',
  templateUrl: './computer-model.component.html',
  styleUrls: ['./computer-model.component.scss'],
  standalone: false,
})
export class ComputerModelComponent implements OnInit {
  @ViewChild('renderContainer', { static: true }) renderContainer: ElementRef;
  scene: ModelScene;
  public get hoverModel() {
    return this.scene ? this.scene.hoverModel : false;
  }

  @Output()
  loaded = new EventEmitter<any>();
  @Output()
  modelClicked = new EventEmitter<any>();

  destroyed$ = new Subject<void>();
  initialized$ = new Subject<void>();

  constructor(private modelInteractionService: ModelInteractionService) {}

  ngOnDestroy() {
    this.scene?.disposeAll();
    this.scene = null;
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit() {
    this.modelInteractionService.onResetView$
      .pipe(skip(1), takeUntil(this.destroyed$))
      .subscribe(() => this.scene?.resetView());
    this.modelInteractionService.onSceneInitialized$
      .pipe(skip(1), takeUntil(this.initialized$), takeUntil(this.destroyed$))
      .subscribe((config) => {
        this.initialize(config);
      });
    this.modelInteractionService.onScreenSizeChanged$
      .pipe(skip(1), takeUntil(this.destroyed$))
      .subscribe((size) => {
        this.scene?.resizeView(size[0], size[1]);
      });
  }

  public initialize(config: InitialSceneConfig): void {
    this.scene = new ModelScene(this.renderContainer, {
      model: {
        filePath: 'assets/',
        fileName: 'retro_computer.glb',
        scaling: 50,
        position: new THREE.Vector3(0, 0, 0),
      },
      renderer: {
        rendererParameter: {
          antialias: true,
        },
        devicePixelRatio: config.devicePixelRatio,
        size: config.size,
      },
      camera: {
        fov: 50,
        position: new THREE.Vector3(0, 5, 5),
        lookAt: new THREE.Vector3(0, 0, 0),
        near: 1,
        far: 1000,
      },
      lights: [
        {
          light: new THREE.AmbientLight(0xffffff, 0.3),
        },
        {
          light: new THREE.DirectionalLight(0xffffff, 0.6),
        },
      ],
    });

    this.scene.sceneLoaded
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.loaded.emit());

    this.scene.modelClicked
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.modelClicked.emit());

    this.initialized$.next();
    this.initialized$.complete();
  }
}
