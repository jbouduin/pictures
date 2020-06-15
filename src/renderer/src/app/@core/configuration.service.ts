import { Injectable } from '@angular/core';

import { DataVerb, DtoConfiguration } from '@ipc';
import { IpcService } from './ipc/ipc.service';
import { DataRequestFactory } from './ipc/data-request-factory';
import { LogService } from './log.service';
import { IpcDataRequest } from './ipc/ipc-data-request';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private _configuration: DtoConfiguration;

  public get configuration(): DtoConfiguration {
    return this._configuration || this.getConfiguration();
  }

  // <editor-fold desc='Constructor & C°'>
  constructor(
    private logService: LogService,
    private dataRequestFactory: DataRequestFactory,
    private ipcService: IpcService) { }
  // </editor-fold>

  private getConfiguration(): DtoConfiguration {
    const request: IpcDataRequest = this.dataRequestFactory.createUntypedDataRequest(DataVerb.GET,'/configuration');

    this._configuration = this.ipcService
      .dataRequestSync<DtoConfiguration>(request).data;
    this.logService.injectConfiguraton(this._configuration);
    return this._configuration;
  }
}
