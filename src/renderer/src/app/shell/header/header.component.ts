import { Component, OnInit } from '@angular/core';

import { IpcService, SecretService, LockStatus } from '@core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  // <editor-fold desc='Private properties'>
  private ipcService: IpcService
  private secretService: SecretService;
  // </editor-fold>

  // <editor-fold desc='Public getters'>
  public get currentLockStatus(): LockStatus {
    return this.secretService.lockStatus.value;
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(ipcService: IpcService, secretService: SecretService) {
    this.ipcService = ipcService;
    this.secretService = secretService;
  }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void { }
  // </editor-fold>

  // <editor-fold desc='UI Triggered methods'>
  public notifications(): void {
    this.ipcService.openDevTools();
  }

  public toggleLock(): void {
    this.secretService.toggleLock();
  }
  // </editor-fold>
}
