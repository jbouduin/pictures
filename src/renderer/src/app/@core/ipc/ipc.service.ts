import { Injectable } from '@angular/core';
import { DataStatus, DtoDataResponse, DtoQueueStatus, LogSource, LogLevel } from '@ipc';

import { LogService } from '../log.service';
import { IpcDataRequest } from './ipc-data-request';

@Injectable({
  providedIn: 'root'
})
export class IpcService {

  // <editor-fold desc='Constructor & C°'>
  public constructor(private logService: LogService) {
    this.initializeQueue();
  }
  // </editor-fold>

  // <editor-fold desc='Public methods'>
  public openDevTools() {
    window.api.electronIpcSend('dev-tools');
  }

  public dataRequestSync<U>(request: IpcDataRequest): DtoDataResponse<U> {
    const json = JSON.stringify(request);
    const result = window.api.electronIpcSendSync('data-sync', json);
    this.logService.debug(result);
    let response: DtoDataResponse<U>;
    try {
      response = JSON.parse(result);
    } catch (error) {
      this.logService.error(error);
      response = {
        status: DataStatus.RendererError,
        message: `${error.name}: ${error.message}`
      }
    }
    return response;
  }

  public dataRequest<U>(request: IpcDataRequest): Promise<DtoDataResponse<U>> {
    return new Promise((resolve, reject) => {
      window.api.electronIpcOnce(`data-${request.id}`, (_event, arg) => {
        try {
          const result: DtoDataResponse<U> = JSON.parse(arg);
          if (result.status < DataStatus.BadRequest) {
            this.logService.debug(result);
            resolve(result);
          } else {
            this.logService.error(result);
            reject(result);
          }
        } catch (error) {
          const errorResult: DtoDataResponse<U> = {
            status: DataStatus.RendererError,
            message: `${error.name}: ${error.message}`
          }
          this.logService.error(error);
          reject(errorResult);
        }
      });
      window.api.electronIpcSend('data', JSON.stringify(request));
    });
  }
  // </editor-fold>

  // <editor-fold desc='Private methods'>
  private initializeQueue(): void {
    window.api.electronIpcRemoveAllListeners('queue-status');
    window.api.electronIpcOn('queue-status', (_event, arg) => {
      try {
        const message: DtoQueueStatus = JSON.parse(arg);
        this.logService.verbose(message);
      } catch (error) {
        this.logService.error(
          LogSource.Renderer,
          LogLevel.Error,
          'Error processing message received:',
          arg);
      }
    });
  }
  // </editor-fold>
}
