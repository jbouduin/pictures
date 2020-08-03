import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

export type LockStatus = 'lock' | 'lock_open';

@Injectable({
  providedIn: 'root'
})
export class SecretService {

  // <editor-fold desc='Private properties'>
  private lockStatus: BehaviorSubject<LockStatus>;
  // </editor-fold>

  // <editor-fold desc='Public get/set'>
  public set currentStatus(value: LockStatus) {
    this.lockStatus.next(value)
  }

  public get currentStatus(): LockStatus {
    return this.lockStatus.value;
  }
  // </editor-fold>
  //
  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    this.lockStatus = new BehaviorSubject<LockStatus>('lock');
  }
  // </editor-fold>

  // <editor-fold desc='Public methods'>
  public subscribe(next: (value: LockStatus) => void): Subscription {
    return this.lockStatus.subscribe(next);
  }

  public toggleLock(): void {
    if (this.lockStatus.value === 'lock') {
      this.lockStatus.next('lock_open');
    } else {
      this.lockStatus.next('lock');
    }
  }

  // </editor-fold>
}
