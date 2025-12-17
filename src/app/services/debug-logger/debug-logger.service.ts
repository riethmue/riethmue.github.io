import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

@Injectable({
  providedIn: 'root',
})
export class DebugLoggerService {
  private static _instance?: DebugLoggerService;

  constructor() {
    // Store singleton instance for global access
    DebugLoggerService._instance = this;
  }

  static get instance(): DebugLoggerService {
    if (!DebugLoggerService._instance) {
      DebugLoggerService._instance = new DebugLoggerService();
    }
    return DebugLoggerService._instance;
  }

  private get isEnabled(): boolean {
    return environment.debug?.enableLogging ?? false;
  }

  debug(message: string, ...args: any[]): void {
    if (this.isEnabled) {
      console.log(`[${LogLevel.DEBUG}] ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.isEnabled) {
      console.info(`[${LogLevel.INFO}] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.isEnabled) {
      console.warn(`[${LogLevel.WARN}] ${message}`, ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    // Errors are always logged, regardless of debug setting
    console.error(`[${LogLevel.ERROR}] ${message}`, ...args);
  }

  group(label: string): void {
    if (this.isEnabled) {
      console.group(label);
    }
  }

  groupEnd(): void {
    if (this.isEnabled) {
      console.groupEnd();
    }
  }

  table(data: any): void {
    if (this.isEnabled) {
      console.table(data);
    }
  }
}

// Global logging functions - no need to inject!
export const log = {
  debug: (message: string, ...args: any[]) =>
    DebugLoggerService.instance.debug(message, ...args),
  info: (message: string, ...args: any[]) =>
    DebugLoggerService.instance.info(message, ...args),
  warn: (message: string, ...args: any[]) =>
    DebugLoggerService.instance.warn(message, ...args),
  error: (message: string, ...args: any[]) =>
    DebugLoggerService.instance.error(message, ...args),
  group: (label: string) => DebugLoggerService.instance.group(label),
  groupEnd: () => DebugLoggerService.instance.groupEnd(),
  table: (data: any) => DebugLoggerService.instance.table(data),
};
