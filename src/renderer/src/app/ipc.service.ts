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
        const systemInfo: DtoSystemInfo = JSON.parse(arg);
        resolve(systemInfo);
      });
      window.api.electronIpcSend('request-systeminfo');
    });
  }

  // TODO find a solution for handling errors coming back
  public dataRequestSync<T,U>(request: DtoDataRequest<T>): DtoDataResponse<U> {
    const json = JSON.stringify(request);
    const result = window.api.electronIpcSendSync('data-sync', json);
    console.log(result);
    const response: DtoDataResponse<U> = JSON.parse(result);
    return response;
  }

  // TODO reject if an error comes back
  public dataRequest<T,U>(request: DtoDataRequest<T>): Promise<DtoDataResponse<U>> {
    return new Promise((resolve, reject) => {
      window.api.electronIpcOnce('data', (event, arg) => {
        console.log(arg);
        const result: DtoDataResponse<U> = JSON.parse(arg);
        resolve(result);
      });
      window.api.electronIpcSend('data', JSON.stringify(request));
    });
  }
  // </editor-fold>
}
