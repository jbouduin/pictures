import { Injectable } from '@angular/core';
import { DtoConfiguration, DtoSystemInfo } from '../../../ipc';

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
  // </editor-fold>
}
