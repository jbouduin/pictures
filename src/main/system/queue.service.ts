import { ChildProcess, fork, spawn } from 'child_process';
import { inject, injectable } from 'inversify';

import { DtoTaskRequest } from '@ipc';
import { IConfigurationService } from '../data/configuration';

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
  public constructor() {
    this.childProcess = undefined;
  }
  // </editor-fold>

  // <editor-fold desc='Public methods'>
  public initialize(queuePath: string): void {
    this.childProcess = fork(queuePath, ['hello'], {
        stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      });
    this.childProcess.stdout.on('data', (d) => {
        console.log('[Q-stdout] ' + d.toString());
      });
    this.childProcess.stderr.on('data', (d) => {
        console.log('[Q-stderr] ' + d.toString());
      });
    this.childProcess.on('message', (m) => {
        console.log('[Q-ipc] ' + m);
      });

  }

  public push(task: DtoTaskRequest<any>): void {
    this.childProcess.send(JSON.stringify(task));
  }
  // </editor-fold>
}
