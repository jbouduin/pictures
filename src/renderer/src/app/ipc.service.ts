import { Injectable } from '@angular/core';
import { DtoConfiguration, DtoSystemInfo } from '../../../ipc';
import { DtoDataRequest, DtoDataResponse } from '../../../ipc';

@Injectable({
  providedIn: 'root'
})
export class IpcService {

  // <editor-fold desc='Constructor & C°'>
  public constructor() { }
  // </editor-fold>

  // <editor-fold desc='Public methods'>
  public openDevTools() {
    window.api.electronIpcSend('dev-tools');
  }

  public getSystemInfoAsync(): Promise<DtoSystemInfo> {
    return new Promise((resolve, reject) => {
      window.api.electronIpcOnce('systeminfo', (event, arg) => {
        const systemInfo: DtoSystemInfo = JSON.parse(arg); //DtoSystemInfo.deserialize(arg);
        resolve(systemInfo);
      });
      window.api.electronIpcSend('request-systeminfo');
    });
  }

  public getConfigurationAsync(): Promise<DtoConfiguration> {
    return new Promise((resolve, reject) => {
      window.api.electronIpcOnce('configuration', (event, arg) => {
        const result: DtoConfiguration = JSON.parse(arg);
        resolve(result);
      });
      window.api.electronIpcSend('request-configuration');
    });
  }

  public dataRequestSync<T,U>(request: DtoDataRequest<T>): DtoDataResponse<U> {
    const json = JSON.stringify(request);
    const result = window.api.electronIpcSendSync('data-sync', json);
    const response: DtoDataResponse<U> = JSON.parse(result);
    return response;
  }

  public dataRequest<T,U>(request: DtoDataRequest<T>): Promise<DtoDataResponse<U>> {
    return new Promise((resolve, reject) => {
      window.api.electronIpcOnce('data', (event, arg) => {
        const result: DtoDataResponse<U> = JSON.parse(arg);
        resolve(result);
      });
      window.api.electronIpcSend('data', JSON.stringify(request));
    });
  }
  // </editor-fold>
}
