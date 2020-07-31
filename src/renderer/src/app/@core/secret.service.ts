import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type LockStatus = 'lock' | 'lock_open';

@Injectable({
  providedIn: 'root'
})
export class SecretService {

  // <editor-fold desc='Public properties'>
  public lockStatus: BehaviorSubject<LockStatus>;
  // public currentLockStatus: LockStatus;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    // this.currentLockStatus = 'lock';
    this.lockStatus = new BehaviorSubject<LockStatus>('lock');
  }
  // </editor-fold>

  // <editor-fold desc='Public methods'>
  public toggleLock(): void {
    if (this.lockStatus.value === 'lock') {
      this.lockStatus.next('lock_open');
    } else {
      this.lockStatus.next('lock');
    }
  }
  // </editor-fold>
}
