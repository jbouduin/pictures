import { BrowserWindow } from 'electron';
import { injectable, inject } from 'inversify';

import { DtoLogMessage, LogLevel, LogSource, TargetType } from '@ipc';
import { IDatabaseService } from '../../database/database.service';
import { Configuration, IConfigurationService } from '../configuration';
import { IDataRouterService } from '../data-router.service';
import { IDataService, BaseDataService } from '../data-service';
import SERVICETYPES from 'di/service.types';
import { LogMaster } from 'database';

export interface ILogService extends IDataService {
  clearLogs(before?: Date): Promise<void>;
  injectWindow(browserWindow: BrowserWindow): void;
  info(logSource: LogSource, object: any, ...args: Array<any>): void;
  error(logSource: LogSource, object: any, ...args: Array<any>): void;
  verbose(logSource: LogSource, object: any, ...args: Array<any>): void;
  debug(logSource: LogSource, object: any, ...args: Array<any>): void;
  log(logSource: LogSource, LogLevel: LogLevel, object: any, ...args: Array<any>): Promise<void>;
}

@injectable()
export class LogService extends BaseDataService implements ILogService {

  // <editor-fold desc='Private properties'>
  private browserWindow: BrowserWindow;
  // </editor-fold>

  // <editor-fold desc='Private getters'>
  private get configuration(): Configuration {
    return this.configurationService.fullConfiguration;
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    @inject(SERVICETYPES.ConfigurationService) configurationService: IConfigurationService,
    @inject(SERVICETYPES.DatabaseService) databaseService: IDatabaseService) {
    super(configurationService, databaseService);
    this.browserWindow = undefined;
  }
  // </editor-fold>

  // <editor-fold desc='IDataService interface methods'>
  public setRoutes(_router: IDataRouterService): void {

  }
  // </editor-fold>

  // <editor-fold desc='ILogService interface members'>
  public async clearLogs(before?: Date): Promise<void> {
    const queryBuilder = this.databaseService
      .getDeleteQueryBuilder(TargetType.LOG)
      .from(LogMaster);
    if (before) {
      queryBuilder.where('log_Master.created < :before', { before: this.dateToSqlParameter(before) });
    }
    console.log(queryBuilder.getQueryAndParameters());
    await queryBuilder.execute();
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

  public async log(logSource: LogSource, logLevel: LogLevel, object: any, ...args: Array<any>): Promise<void> {
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
      const masterRepository = this.databaseService.getLogMasterRepository();
      let logMaster = masterRepository.create();
      logMaster.source = LogSource[logSource];
      logMaster.logLevel = LogLevel[logLevel];
      logMaster.value = JSON.stringify(object);
      logMaster = await masterRepository.save(logMaster);
      if (args && args.length > 0) {
        const detailRepository = this.databaseService.getLogDetailRepository();
        const logDetails = args.map(detail => {
          const logDetail = detailRepository.create();
          logDetail.logMaster = logMaster;
          logDetail.value = JSON.stringify(detail);
          return logDetail;
        });
        detailRepository.save(logDetails)
      }
    }

  }
  // </editor-fold>
}
