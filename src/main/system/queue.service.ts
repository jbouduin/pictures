import { ChildProcess, fork } from 'child_process';
import { inject, injectable } from 'inversify';

import { DtoTaskRequest, LogSource, DtoTaskResponse, TaskType, DtoDataRequest, DataVerb } from '@ipc';
import { ILogService } from './log.service';

import SERVICETYPES from '../di/service.types';
import { IDataRouterService } from 'data';

export interface IQueueService {
  initialize(queuePath: string, dataRouterService: IDataRouterService): void;
  push(task: DtoTaskRequest<any>): void;
}

@injectable()
export class QueueService implements IQueueService {

  // <editor-fold desc='Private properties'>
  private childProcess: ChildProcess;
  private dataRouterService: IDataRouterService;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    @inject(SERVICETYPES.LogService) private logService: ILogService) {
    this.childProcess = undefined;
  }
  // </editor-fold>

  // <editor-fold desc='Public methods'>
  public initialize(queuePath: string, dataRouterService: IDataRouterService): void {
    this.dataRouterService = dataRouterService;
    this.childProcess = fork(
      queuePath,
      ['hello'],
      { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] }
    );

    this.childProcess.stdout.on(
      'data',
      data => { this.logService.info(LogSource.Queue, data.toString()); }
    );

    this.childProcess.stderr.on(
      'data',
      data => { this.logService.error(LogSource.Queue, data.toString()); }
    );

    this.childProcess.on(
      'message',
      message => { this.processResponse(message); }
    );

  }

  public push(task: DtoTaskRequest<any>): void {
    this.childProcess.send(JSON.stringify(task));
  }
  // </editor-fold>

  private processResponse(response: DtoTaskResponse<any>): void {
    this.logService.debug(LogSource.Main, 'received response from queue: ' + JSON.stringify(response, null, 2));
    let dataRequest: DtoDataRequest<any>;
    if (response.success) {
      switch(response.taskType) {
        case TaskType.CreateThumb: {
          dataRequest = {
            id: 0,
            verb: DataVerb.PUT,
            path: `/thumbnail/${response.data.id}`,
            data: response.data
          };
          break;
        }
        case TaskType.ReadMetaData: {
          dataRequest = {
            id: 0,
            verb: DataVerb.PUT,
            path: `/picture/${response.data.id}/metadata`,
            data: response.data
          };
          break;
        }
      }
      if (dataRequest) {
        this.dataRouterService.routeRequest(dataRequest);
      }
    } else {
      this.logService.error(LogSource.Queue, response.error);
    }

  }
}
