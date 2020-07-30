import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecretService {

  // <editor-fold desc='Public properties'>
  public lockStatus: BehaviorSubject<'lock' | 'lock_open'>;
  public currentLockStatus: 'lock' | 'lock_open';
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    this.currentLockStatus = 'lock';
    this.lockStatus = new BehaviorSubject<'lock' | 'lock_open'>('lock');
  }
  // </editor-fold>

  // <editor-fold desc='Public methods'>
  public toggleLock(): void {
    if (this.currentLockStatus === 'lock') {
      this.currentLockStatus = 'lock_open';
    } else {
      this.currentLockStatus = 'lock';
    }
    this.lockStatus.next(this.currentLockStatus);
  }
  // </editor-fold>
}
