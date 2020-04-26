import { Component, OnInit } from '@angular/core';
import { IpcService } from 'src/app/ipc.service';

import { DataStatus, DataVerb, DtoDataRequest, DtoDataResponse } from '../../../../../ipc';

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
  // </editor-fold>
}
