import { BrowserWindow } from 'electron';
import { injectable } from 'inversify';

import { DtoLogMessage, LogLevel, LogSource } from '@ipc';
import { Configuration } from '../data/configuration';

export interface ILogService {
  injectConfiguraton(configuration: Configuration): void;
  injectWindow(browserWindow: BrowserWindow): void
  info(logSource: LogSource, object: any, ...args: Array<any>): void;
  error(logSource: LogSource, object: any, ...args: Array<any>): void;
  verbose(logSource: LogSource, object: any, ...args: Array<any>): void;
  debug(logSource: LogSource, object: any, ...args: Array<any>): void;
  log(logSource: LogSource, LogLevel: LogLevel, object: any, ...args: Array<any>): void;
}

@injectable()
export class LogService implements ILogService {

  // <editor-fold desc='Private properties'>
  private configuration: Configuration;
  private browserWindow: BrowserWindow;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    this.configuration = undefined;
    this.browserWindow = undefined;
  }
  // </editor-fold>

  // <editor-fold desc='ILogService interface members'>
  public injectConfiguraton(configuration: Configuration): void {
    this.configuration = configuration;
  }

  public injectWindow(browserWindow: BrowserWindow): void {
    this.browserWindow = browserWindow;
  }

  public info(logSource: LogSource, object: any, ...args: Array<any>): void {
    this.log(logSource, LogLevel.Info, object, ...args);
  }

  public error(logSource: LogSource, object: any, ...args: Array<any>): void {
    this.log(logSource, LogLevel.Error, object, ...args);
  }

  public verbose(logSource: LogSource, object: any, ...args: Array<any>): void {
    this.log(logSource, LogLevel.Verbose, object, ...args);
  }

  public debug(logSource: LogSource, object: any, ...args: Array<any>): void {
    this.log(logSource, LogLevel.Debug, object, ...args);
  }

  public log(logSource: LogSource, logLevel: LogLevel, object: any, ...args: Array<any>): void {
    if (!this.configuration || !this.browserWindow) {
      return;
    }

    if ((logSource === LogSource.Main && logLevel <= this.configuration.current.mainLogLevel)||
      (logSource === LogSource.Queue && logLevel <= this.configuration.current.queueLogLevel))
    {
      const message: DtoLogMessage = {
        logSource,
        logLevel,
        object,
        args
      };
      this.browserWindow.webContents.send('log', JSON.stringify(message));
    }
  }
  // </editor-fold>
}
