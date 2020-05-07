import { Injectable } from '@angular/core';
import { DtoConfiguration, DtoSystemInfo } from '@ipc';
import { DataStatus, DtoDataRequest, DtoDataResponse, DtoUntypedDataRequest } from '@ipc';

import { LogService } from '@core';

@Injectable({
  providedIn: 'root'
})
export class IpcService {

  // <editor-fold desc='Constructor & C°'>
  public constructor(private logService: LogService) { }
  // </editor-fold>

  // <editor-fold desc='Public methods'>
  public openDevTools() {
    window.api.electronIpcSend('dev-tools');
  }

  public getSystemInfoAsync(): Promise<DtoSystemInfo> {
    return new Promise((resolve, reject) => {
      window.api.electronIpcOnce('systeminfo', (event, arg) => {
        const systemInfo: DtoSystemInfo = JSON.parse(arg);
        resolve(systemInfo);
      });
      window.api.electronIpcSend('request-systeminfo');
    });
  }

  // be carefull when using sync, as errors coming from main are not handled
  public untypedDataRequestSync<T>(request: DtoUntypedDataRequest): DtoDataResponse<T> {
    return this.dataRequestSync<any, T>(request);
  }

  public dataRequestSync<T,U>(request: DtoDataRequest<T>): DtoDataResponse<U> {
    const json = JSON.stringify(request);
    const result = window.api.electronIpcSendSync('data-sync', json);
    this.logService.debug(result);
    let response: DtoDataResponse<U>;
    try {
      response = JSON.parse(result);
    } catch (error) {
      response = {
        status: DataStatus.RendererError,
        message: `${error.name}: ${error.message}`
      }
    }
    return response;
  }

  public untypedDataRequest<T>(request: DtoUntypedDataRequest): Promise<DtoDataResponse<T>> {
    return this.dataRequest<any, T>(request);
  }

  public dataRequest<T,U>(request: DtoDataRequest<T>): Promise<DtoDataResponse<U>> {
    return new Promise((resolve, reject) => {
      window.api.electronIpcOnce('data', (event, arg) => {
        this.logService.debug(arg);
        try {
          const result: DtoDataResponse<U> = JSON.parse(arg);
          if (result.status < DataStatus.BadRequest) {
            resolve(result);
          } else {
            reject(result);
          }
        } catch (error) {
          const errorResult: DtoDataResponse<U> = {
            status: DataStatus.RendererError,
            message: `${error.name}: ${error.message}`
          }
          reject(errorResult);
        }
      });
      window.api.electronIpcSend('data', JSON.stringify(request));
    });
  }
  // </editor-fold>
}
