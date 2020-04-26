import { Component, OnInit } from '@angular/core';
import { IpcService } from 'src/app/ipc.service';

import { DataStatus, DataVerb, DtoConfiguration, DtoDataRequest, DtoDataResponse } from '../../../../../ipc';

@Component({
  selector: 'app-component2',
  templateUrl: './component2.component.html',
  styleUrls: ['./component2.component.css']
})
export class Component2Component implements OnInit {

  // <editor-fold desc='Private properties'>
  private readonly ping: DtoDataRequest<string>;
  // </editor-fold>

  // <editor-fold desc='Public properties'>
  public configuration: string;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(private ipcService: IpcService) {
    this.ping = {
      verb: DataVerb.GET,
      path: 'anything',
      data: 'ping'
    };
  }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit() {
    this.ipcService.getConfigurationAsync()
      .then(configuration => this.configuration = JSON.stringify(configuration, null, 2));
  }
  // </editor-fold>

  // <editor-fold desc='UI Trigger methods'>
  public pingAsync(): void {
    this.ipcService
      .dataRequest<string, string>(this.ping)
      .then(result => alert(`Status: ${DataStatus[result.status]} \n Data: ${result.data}`));
  }

  public pingSync(): void {
    const result: DtoDataResponse<string> = this.ipcService.dataRequestSync<string, string>(this.ping);
    alert(`Status: ${DataStatus[result.status]} \n Data: ${result.data}`);
  }

  public getList(): void {
    const request: DtoDataRequest<string> = {
      verb: DataVerb.GET,
      path: '/collection',
      data: ''
    };
    this.ipcService
      .dataRequest<string, any>(request)
      .then(result => alert(`Status: ${DataStatus[result.status]} \n Data: ${result.data}`));
  }

  public getSingle(): void {
    const request: DtoDataRequest<string> = {
      verb: DataVerb.GET,
      path: '/collection/1',
      data: ''
    };
    this.ipcService
      .dataRequest<string, any>(request)
      .then(result => alert(`Status: ${DataStatus[result.status]} \n Data: ${result.data}`));
  }

  public getPictures(): void {
    const request: DtoDataRequest<string> = {
      verb: DataVerb.GET,
      path: '/collection/1/pictures',
      data: ''
    };
    this.ipcService
      .dataRequest<string, any>(request)
      .then(result => alert(`Status: ${DataStatus[result.status]} \n Data: ${result.data}`));
  }

  public refreshConfig(): void {
    const request: DtoDataRequest<string> = {
      verb: DataVerb.GET,
      path: '/configuration',
      data: ''
    };
    this.ipcService
      .dataRequest<string, DtoConfiguration>(request)
      .then(result => this.configuration = JSON.stringify(result.data, null, 2));
  }
  // </editor-fold>
}
