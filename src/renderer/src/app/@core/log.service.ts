import { Inject, Injectable } from '@angular/core';

import { DtoConfiguration, LogLevel } from '@ipc';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  // <editor-fold desc='Private properties'>
  private configuration: DtoConfiguration;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  constructor() { }
  // </editor-fold>

  // <editor-fold desc='public methods'>
  injectConfiguraton(configuration: DtoConfiguration): void {
    this.configuration = configuration;
  }

  info(object: any, ...args: Array<any>): void {
    this.log(LogLevel.Info, object, ...args);
  }

  error(object: any, ...args: Array<any>): void {
    this.log(LogLevel.Error, object, ...args);
  }

  verbose(object: any, ...args: Array<any>): void {
    this.log(LogLevel.Verbose, object, ...args);
  }

  debug(object: any, ...args: Array<any>): void {
    this.log(LogLevel.Debug, object, ...args);
  }

  log(logLevel: LogLevel, object: any, ...args: Array<any>): void {
    if (!this.configuration) {
      return;
    }
    if (logLevel <= this.configuration.current.rendererLogLevel) {
      switch (logLevel) {
        case LogLevel.Info: {
          console.info(object, ...args);
          break;
        }
        case LogLevel.Error: {
          console.error(object, ...args);
          break;
        }
        case LogLevel.Verbose: {
          console.log(object, ...args);
          break;
        }
        case LogLevel.Debug: {
          console.debug(object, ...args);
          break;
        }
      }
    }
  }
  // </editor-fold>

}
