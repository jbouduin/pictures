import { Injectable } from '@angular/core';

import { DataVerb, DtoConfiguration, DtoImage } from '@ipc';
import { IpcService } from './ipc/ipc.service';
import { DataRequestFactory } from './ipc/data-request-factory';
import { LogService } from './log.service';
import { IpcDataRequest } from './ipc/ipc-data-request';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private _configuration: DtoConfiguration;
  private _genericThumbUrl: string;

  public get configuration(): DtoConfiguration {
    return this._configuration ? this._configuration : this.getConfiguration();
  }

  public get genericThumbUrl(): string {
    return this._genericThumbUrl ? this._genericThumbUrl : this.getGenericThumbUrl();
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

  private getGenericThumbUrl(): string {
    const request = this.dataRequestFactory.createUntypedDataRequest(DataVerb.GET, `/thumbnail/generic`);
    this._genericThumbUrl = 'data:image/png;base64,' + this.ipcService.dataRequestSync<DtoImage>(request).data.image;
    return this._genericThumbUrl;
  }
}
