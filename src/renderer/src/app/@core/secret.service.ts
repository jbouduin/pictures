import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { KeyDialogComponent } from './components/key-dialog/key-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { IpcService, DataRequestFactory } from './ipc';
import { DataVerb, DtoSetting, DataStatus } from '@ipc';
import { IKeyDialogParams } from './components/key-dialog/key-dialog.params';

export type LockStatus = 'lock' | 'lock_open';

@Injectable({
  providedIn: 'root'
})
export class SecretService {

  // <editor-fold desc='Private properties'>
  private lockStatus: BehaviorSubject<LockStatus>;
  private dialog: MatDialog;
  private dialogRef: MatDialogRef<KeyDialogComponent>;
  private _key: string | undefined;
  private ipcService: IpcService;
  private dataRequestFactory: DataRequestFactory;
  // </editor-fold>

  // <editor-fold desc='Public get/set'>
  public set currentStatus(value: LockStatus) {
    this.lockStatus.next(value)
  }

  public get currentStatus(): LockStatus {
    return this.lockStatus.value;
  }

  public get key(): string | undefined {
    return this._key;
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
      dialog: MatDialog,
      ipcService: IpcService,
      dataRequestFactory: DataRequestFactory) {
    this.dialog = dialog;
    this.ipcService = ipcService;
    this.dataRequestFactory = dataRequestFactory;
    this.lockStatus = new BehaviorSubject<LockStatus>('lock');
    this._key = undefined;
  }
  // </editor-fold>

  // <editor-fold desc='Public methods'>
  public async initialize(): Promise<void> {
    const request = this.dataRequestFactory.createUntypedDataRequest(DataVerb.GET, '/setting/secret/exist');
    const response = await this.ipcService.dataRequest<boolean>(request);
    if (!response.data) {
      const params: IKeyDialogParams = {
        isInitial: true,
        cancelDialog: undefined,
        commitDialog: this.commitInitialDialog.bind(this)
      }
      this.dialogRef = this.dialog.open(KeyDialogComponent, { width: '600px', maxHeight: '100%', data: params, disableClose: true });
      this.dialogRef.afterClosed().subscribe( () => this.dialogRef = undefined);
    }
  }

  public subscribe(next: (value: LockStatus) => void): Subscription {
    return this.lockStatus.subscribe(next);
  }

  public toggleLock(): void {
    if (this.lockStatus.value === 'lock_open') {
      this.lockStatus.next('lock');
      this._key = undefined;
    } else {
      const params: IKeyDialogParams = {
        isInitial: false,
        cancelDialog: this.cancelDialog.bind(this),
        commitDialog: this.commitCheckDialog.bind(this)
      }
      this.dialogRef = this.dialog.open(KeyDialogComponent, { width: '600px', maxHeight: '100%', data: params });
      this.dialogRef.afterClosed().subscribe( () => this.dialogRef = undefined);
    }

  }
  // </editor-fold>

  // <editor-fold desc='Private methods'>
  private cancelDialog(): void {
    this.dialogRef.close();
  }

  private async commitInitialDialog(key: string): Promise<string> {
    const data: DtoSetting = {
      name: 'secret',
      value: key
    };
    const request = this.dataRequestFactory.createDataRequest<DtoSetting>(DataVerb.POST, '/setting/secret/hash', data);
    const response = await this.ipcService.dataRequest<boolean>(request);
    if (response.status === DataStatus.Ok) {
      this.lockStatus.next('lock_open');
      this._key = key;
      this.dialogRef.close();
      return undefined;
    } else {
      return response.message;
    }
  }

  private async commitCheckDialog(key: string): Promise<string> {
    const data: DtoSetting = {
      name: 'secret',
      value: key
    };
    const request = this.dataRequestFactory.createDataRequest<DtoSetting>(DataVerb.POST, '/setting/secret/validate', data);
    const response = await this.ipcService.dataRequest<boolean>(request);
    if (response.data) {
      this.lockStatus.next('lock_open');
      this._key = key;
      this.dialogRef.close();
    } else {
      return 'wrong key';
    }
  }
  // </editor-fold>
}
