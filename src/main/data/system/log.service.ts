import { BrowserWindow } from 'electron';
import { injectable, inject } from 'inversify';

import { DtoDataResponse, DtoLogMessage, LogLevel, LogSource, TargetType, DataStatus, DtoLogMaster } from '@ipc';
import { IDatabaseService } from '../../database/database.service';
import { Configuration, IConfigurationService } from '../configuration';
import { IDataRouterService } from '../data-router.service';
import { IDataService, BaseDataService } from '../data-service';
import SERVICETYPES from 'di/service.types';
import { LogMaster } from 'database';
import { RoutedRequest } from 'data/routed-request';
import { result } from 'lodash';

export interface ILogService extends IDataService {
  clearLogs(before?: Date): Promise<void>;
  injectWindow(browserWindow: BrowserWindow): void;
  info(logSource: LogSource, object: any, ...args: Array<any>): void;
  error(logSource: LogSource, object: any, ...args: Array<any>): void;
  verbose(logSource: LogSource, object: any, ...args: Array<any>): void;
  debug(logSource: LogSource, object: any, ...args: Array<any>): void;
  log(logSource: LogSource, LogLevel: LogLevel, object: any, ...args: Array<any>): Promise<DtoDataResponse<any>>;
}

@injectable()
export class LogService extends BaseDataService implements ILogService {

  // <editor-fold desc='Private properties'>
  private logWindow: BrowserWindow;
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
    this.logWindow = undefined;
  }
  // </editor-fold>

  // <editor-fold desc='IDataService interface methods'>
  public setRoutes(router: IDataRouterService): void {
    router.get('/log', this.loadLogs.bind(this));
    router.post('/log', this.createLog.bind(this));
  }
  // </editor-fold>

  public async createLog(request: RoutedRequest<DtoLogMessage>): Promise<DtoDataResponse<any>> {
    const logMessage = request.data;
    return this.log(logMessage.logSource, logMessage.logLevel, logMessage.object, logMessage.args);
  }

  public async loadLogs(request: RoutedRequest<undefined>): Promise<DtoDataResponse<Array<DtoLogMaster>>> {
    let result: DtoDataResponse<Array<DtoLogMaster>>;
    const logMasterRepository = this.databaseService.getLogMasterRepository();

    const sourceArray = new Array<string>();
    if (request.queryParams.renderer === 'true') {
      sourceArray.push('Renderer')
    }
    if (request.queryParams.queue === 'true') {
      sourceArray.push('Queue')
    }
    if (request.queryParams.main === 'true') {
      sourceArray.push('Main')
    }

    const levelArray = new Array<string>();
    if (request.queryParams.error === 'true') {
      levelArray.push('Error')
    }

    if (request.queryParams.info === 'true') {
      levelArray.push('Info')
    }

    if (request.queryParams.verbose === 'true') {
      levelArray.push('Verbose')
    }

    if (request.queryParams.debug === 'true') {
      levelArray.push('Debug')
    }
    const logMastersQryBuilder = logMasterRepository
      .createQueryBuilder('logMaster')
      .where('source in (:...sources)', { sources: sourceArray })
      .andWhere('logLevel in (:...levels)', { levels: levelArray })
      .leftJoinAndSelect('logMaster.logDetails', 'logDetails');

    this.debug(LogSource.Main, logMastersQryBuilder.getQueryAndParameters());
    const logs = await logMastersQryBuilder.getMany();

    const dtoLogs = Promise.all(logs.map(async log => {
      const dtoLog: DtoLogMaster = {
        created: log.created,
        logLevel: log.logLevel,
        source: log.source,
        value: log.value,
        details: undefined
      };
      dtoLog.details = await log.logDetails.then(d => d.map(v => v.value));
      return dtoLog;
    }));

    result = {
      status: DataStatus.Ok,
      data: await dtoLogs
    }
    return result;
  }

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

  public injectWindow(logWindow: BrowserWindow): void {
    this.logWindow = logWindow;
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

  public async log(logSource: LogSource, logLevel: LogLevel, object: any, ...args: Array<any>): Promise<DtoDataResponse<any>> {
    if (!this.configuration) {
      return;
    }

    if ((logSource === LogSource.Main && logLevel <= this.configuration.current.mainLogLevel) ||
      (logSource === LogSource.Queue && logLevel <= this.configuration.current.queueLogLevel) ||
      (logSource === LogSource.Renderer && logLevel <= this.configuration.current.rendererLogLevel) ) {
      this.sendLogMessage(logSource, logLevel, object, args);
      return this.storeLog(logSource, logLevel, object, args);
    }
  }
  // </editor-fold>

  private sendLogMessage(logSource: LogSource, logLevel: LogLevel, object: any, ...args: Array<any>): void {
    if (this.logWindow) {
      const logMaster: DtoLogMaster = {
        created: new Date(),
        source: LogSource[logSource],
        logLevel: LogLevel[logLevel],
        value: JSON.stringify(object),
        details: args.map(arg => JSON.stringify(arg))
      }
      this.logWindow.webContents.send('log', JSON.stringify(logMaster));
    }
  }

  private async storeLog(logSource: LogSource, logLevel: LogLevel, object: any, ...args: Array<any>): Promise<DtoDataResponse<any>> {
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
      await detailRepository.save(logDetails)
    }
    const result: DtoDataResponse<any> = {
      status: DataStatus.Ok,
      data: undefined
    }
    return result;
  }
}
