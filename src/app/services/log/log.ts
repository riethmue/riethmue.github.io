import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  private enabled = environment.enableLogging;

  log(...args: any[]) {
    if (this.enabled) {
      console.log('%c[LOG]', 'color: #0f0', ...args);
    }
  }

  warn(...args: any[]) {
    if (this.enabled) {
      console.warn('%c[WARN]', 'color: #ff0', ...args);
    }
  }

  error(...args: any[]) {
    if (this.enabled) {
      console.error('%c[ERROR]', 'color: #f00', ...args);
    }
  }

  debug(...args: any[]) {
    if (this.enabled) {
      console.debug('%c[DEBUG]', 'color: #0ff', ...args);
    }
  }
}
