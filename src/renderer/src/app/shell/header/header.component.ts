import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { IpcService, SecretService, LockStatus } from '@core';
import { DtoQueueStatus } from '@ipc';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  // <editor-fold desc='Private properties'>
  private ipcService: IpcService
  private secretService: SecretService;
  private ngZone: NgZone;
  // </editor-fold>

  public queueLength: number;

  // <editor-fold desc='Public getters'>
  public get currentLockStatus(): LockStatus {
    return this.secretService.currentStatus;
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(ipcService: IpcService, secretService: SecretService, ngZone: NgZone) {
    this.ipcService = ipcService;
    this.secretService = secretService;
    this.ngZone = ngZone;
  }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    this.ipcService.queueStatus.subscribe((status: DtoQueueStatus) => this.ngZone.run(() => this.queueLength = status.count));
  }

  public ngAfterViewInit(): void {
    this.secretService.initialize();
  }
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
