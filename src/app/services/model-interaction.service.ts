import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { InitialSceneConfig } from '../computer-model/scene-constants';

@Injectable({
  providedIn: 'root',
})
export class ModelInteractionService {
  retries = 0;
  onResetView$: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  onScreenSizeChanged$: BehaviorSubject<[number, number]> = new BehaviorSubject<
    [number, number]
  >(null);
  onSceneInitialized$: BehaviorSubject<InitialSceneConfig> =
    new BehaviorSubject<InitialSceneConfig>(null);
  constructor() {}
}
