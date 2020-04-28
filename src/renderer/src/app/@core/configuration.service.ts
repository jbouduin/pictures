import { Injectable } from '@angular/core';

import { DataVerb, DtoDataRequest, DtoConfiguration } from '@ipc';
import { IpcService } from './ipc/ipc.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private _configuration: DtoConfiguration;

  public get configuration(): DtoConfiguration {
    return this._configuration || this.getConfiguration();
  }

  // <editor-fold desc='Constructor & C°'>
  constructor(private ipcService: IpcService) { }
  // </editor-fold>

  private getConfiguration(): DtoConfiguration {
    const request: DtoDataRequest<string> = {
      verb: DataVerb.GET,
      path: '/configuration',
      data: ''
    };
    this._configuration = this.ipcService
      .dataRequestSync<string, DtoConfiguration>(request).data;
    return this._configuration;
  }
}
