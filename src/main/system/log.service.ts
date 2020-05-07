import { inject, injectable } from 'inversify';

import { LogLevel } from '@ipc';
import { Configuration } from '../data/configuration';

export interface ILogService {
  injectConfiguraton(configuration: Configuration): void;
  info(object: any, ...args: Array<any>): void;
  error(object: any, ...args: Array<any>): void;
  verbose(object: any, ...args: Array<any>): void;
  debug(object: any, ...args: Array<any>): void;
  log(LogLevel: LogLevel, object: any, ...args: Array<any>): void;
}

@injectable()
export class LogService implements ILogService {

  // <editor-fold desc='Private properties'>
  private configuration: Configuration;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    this.configuration = undefined;
  }
  // </editor-fold>

  // <editor-fold desc='ILogService interface members'>
  injectConfiguraton(configuration: Configuration): void {
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

    if (logLevel <= this.configuration.current.mainLogLevel) {
      switch (logLevel) {
        case LogLevel.Info: {
          console.info('[INFO]', object, ...args);
          break;
        }
        case LogLevel.Error: {
          console.error('[ERROR]', object, ...args);
          break;
        }
        case LogLevel.Verbose: {
          console.log('[VERBOSE]', object, ...args);
          break;
        }
        case LogLevel.Debug: {
          console.debug('[DEBUG]', object, ...args);
          break;
        }
      }
    }
  }
  // </editor-fold>
}
