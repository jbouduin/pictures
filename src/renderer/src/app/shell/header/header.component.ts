import { Component, OnInit } from '@angular/core';

import { IpcService, SecretService, LockStatus } from '@core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { KeyDialogComponent } from '../key-dialog/key-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  // <editor-fold desc='Private properties'>
  private dialog: MatDialog;
  private dialogRef: MatDialogRef<any>;
  private ipcService: IpcService
  private secretService: SecretService;
  // </editor-fold>

  // <editor-fold desc='Public getters'>
  public get currentLockStatus(): LockStatus {
    return this.secretService.currentStatus;
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(dialog: MatDialog, ipcService: IpcService, secretService: SecretService) {
    this.dialog = dialog;
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
    if (this.secretService.currentStatus === 'lock_open') {
      this.secretService.toggleLock(undefined);
    } else {
      this.dialogRef = this.dialog.open(KeyDialogComponent, { width: '600px', maxHeight: '100%' });
      this.dialogRef.afterClosed().subscribe( (result: string) => {
        if (result) {
          this.secretService.toggleLock(result);
        }
        this.dialogRef = undefined;
      });
    }
  }
  // </editor-fold>

}
