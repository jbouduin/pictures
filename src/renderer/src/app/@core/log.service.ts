import { Injectable } from '@angular/core';
import { DtoConfiguration, DtoLogMessage } from '@ipc';
import { LogLevel, LogSource, BaseLogService } from '@ipc';
import { IpcService, DataRequestFactory, DataVerb } from '@ipc';
import { ConfigurationService } from '@ipc';

@Injectable({
  providedIn: 'root'
})
export class LogService extends BaseLogService {

  // <editor-fold desc='Private properties'>
  private configurationService: ConfigurationService;
  private ipcService: IpcService;
  private dataRequestFactory: DataRequestFactory;
  private get configuration(): DtoConfiguration {
    return this.configurationService.configuration;
  }

  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(configurationService: ConfigurationService, dataRequestFactory: DataRequestFactory, ipcService: IpcService) {
    super();
    this.configurationService = configurationService;
    this.dataRequestFactory = dataRequestFactory;
    this.ipcService = ipcService;
  }
  // </editor-fold>

  // <editor-fold desc='public methods'>
  public initializeService(ipcService: IpcService): void {
    this.ipcService = ipcService;
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

  private log(logSource: LogSource, logLevel: LogLevel, object: any, ...args: Array<any>): void {
    if (!this.configurationService) {
      return;
    }
    if ((logSource === LogSource.Renderer && logLevel <= this.configuration.current.rendererLogLevel) ||
      (logSource === LogSource.Main && logLevel <= this.configuration.current.mainLogLevel) ||
      (logSource === LogSource.Queue && logLevel <= this.configuration.current.queueLogLevel)) {
      const logMessage: DtoLogMessage =
      {
        logLevel: logLevel,
        logSource: logSource,
        object: object,
        args: args
      };

      const logRequest = this.dataRequestFactory.createDataRequest<DtoLogMessage>(DataVerb.POST, "/log", logMessage);
      this.ipcService.dataRequest(logRequest);
    }
  }
  // </editor-fold>

}
