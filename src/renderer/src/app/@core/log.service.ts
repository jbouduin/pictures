import { Injectable } from '@angular/core';
import { DtoConfiguration, DtoLogMessage, LogLevel, LogSource } from '@ipc';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  // <editor-fold desc='Private properties'>
  private configuration: DtoConfiguration;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor() { }
  // </editor-fold>

  // <editor-fold desc='public methods'>
  public injectConfiguraton(configuration: DtoConfiguration): void {
    this.configuration = configuration;
    window.api.electronIpcRemoveAllListeners('log');
    window.api.electronIpcOn('log', (_event, arg) => {
      try {
        const message: DtoLogMessage = JSON.parse(arg);
        this.log(message.logSource, message.logLevel, message.object, message.args);
      } catch (error) {
        this.log(
          LogSource.Renderer,
          LogLevel.Error,
          'Error processing message received:',
          arg);
      }
    });
  }

  public info(object: any, ...args: Array<any>): void {
    this.log(LogSource.Renderer, LogLevel.Info, object, ...args);
  }

  public error(object: any, ...args: Array<any>): void {
    this.log(LogSource.Renderer, LogLevel.Error, object, ...args);
  }

  public verbose(object: any, ...args: Array<any>): void {
    this.log(LogSource.Renderer, LogLevel.Verbose, object, ...args);
  }

  public debug(object: any, ...args: Array<any>): void {
    this.log(LogSource.Renderer, LogLevel.Debug, object, ...args);
  }

  public log(logSource: LogSource, logLevel: LogLevel, object: any, ...args: Array<any>): void {
    if (!this.configuration) {
      return;
    }
    if ((logSource === LogSource.Renderer && logLevel <= this.configuration.current.rendererLogLevel) ||
      (logSource === LogSource.Main && logLevel <= this.configuration.current.mainLogLevel)||
      (logSource === LogSource.Queue && logLevel <= this.configuration.current.queueLogLevel)) {
      switch (logLevel) {
        case LogLevel.Info: {
          console.info(`[${LogSource[logSource]}]`, object, ...args);
          break;
        }
        case LogLevel.Error: {
          console.error(`[${LogSource[logSource]}]`, object, ...args);
          break;
        }
        case LogLevel.Verbose: {
          console.log(`[${LogSource[logSource]}]`, object, ...args);
          break;
        }
        case LogLevel.Debug: {
          console.debug(`[${LogSource[logSource]}]`, object, ...args);
          break;
        }
      }
    }
  }
  // </editor-fold>

}
