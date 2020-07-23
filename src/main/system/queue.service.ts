import { ChildProcess, fork } from 'child_process';
import { inject, injectable } from 'inversify';

import { DtoTaskRequest, LogSource, DtoTaskResponse, TaskType, DtoResponseCreateThumb, DtoDataRequest, DataVerb } from '@ipc';
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
    if (response.success) {
      switch(response.taskType) {
        case TaskType.CreateThumb: {
          const dataRequest: DtoDataRequest<DtoResponseCreateThumb> = {
            id: 0,
            verb: DataVerb.PUT,
            path: `/thumbnail/${response.data.id}`,
            data: response.data
          };
          this.dataRouterService.routeRequest(dataRequest);
          break;
        }
        case TaskType.ReadMetaData: {
          break;
        }
      }
    } else {
      this.logService.error(LogSource.Queue, response.error);
    }
  }
}
