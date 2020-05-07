import { Injectable } from '@angular/core';

import { DataVerb, DtoDataRequest, DtoConfiguration } from '@ipc';
import { IpcService } from './ipc/ipc.service';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private _configuration: DtoConfiguration;
  private
  public get configuration(): DtoConfiguration {
    return this._configuration || this.getConfiguration();
  }

  // <editor-fold desc='Constructor & C°'>
  constructor(
    private logService: LogService,
    private ipcService: IpcService) { }
  // </editor-fold>

  private getConfiguration(): DtoConfiguration {
    const request: DtoDataRequest<string> = {
      verb: DataVerb.GET,
      path: '/configuration'
    };
    this._configuration = this.ipcService
      .dataRequestSync<string, DtoConfiguration>(request).data;
    this.logService.injectConfiguraton(this._configuration);
    return this._configuration;
  }
}
