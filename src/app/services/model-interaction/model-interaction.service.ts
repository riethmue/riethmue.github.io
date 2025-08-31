import { Injectable } from '@angular/core';

import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { InitialSceneConfig } from '../../computer-model/scene-constants';

@Injectable({
  providedIn: 'root',
})
export class ModelInteractionService {
  retries = 0;

  onResetView$ = new Subject<void>();
  onScreenSizeChanged$ = new ReplaySubject<[number, number]>(1);
  onSceneInitialized$ = new ReplaySubject<InitialSceneConfig>(1);
}
