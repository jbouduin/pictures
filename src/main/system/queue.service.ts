import { ChildProcess, fork, spawn } from 'child_process';
import { inject, injectable } from 'inversify';

import { DtoTaskRequest, LogSource } from '@ipc';
import { IConfigurationService } from '../data/configuration';

import { IFileService } from './file.service';
import { ILogService } from './log.service';

import SERVICETYPES from '../di/service.types';

export interface IQueueService {
  initialize(queuePath: string): void;
  push(task: DtoTaskRequest<any>);
}

@injectable()
export class QueueService implements IQueueService {

  // <editor-fold desc='Private properties'>
  private childProcess: ChildProcess;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    @inject(SERVICETYPES.LogService) private logService: ILogService) {
    this.childProcess = undefined;
  }
  // </editor-fold>

  // <editor-fold desc='Public methods'>
  public initialize(queuePath: string): void {

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
      message => { this.logService.info(LogSource.Queue, message);
      });

  }

  public push(task: DtoTaskRequest<any>): void {
    this.childProcess.send(JSON.stringify(task));
  }
  // </editor-fold>
}
