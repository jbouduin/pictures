import { Injectable } from '@angular/core';
import { DataVerb } from '@ipc';

import { IpcDataRequest } from './ipc-data-request';

@Injectable({
  providedIn: 'root'
})
export class DataRequestFactory {

  // <editor-fold desc='Private properties'>
  private requestId: number;
  // </editor-fold>

  // <editor-fold desc='Public properties'>
  public applicationSecret: string;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    this.requestId = 0;
    this.applicationSecret = undefined;
  }
  // </editor-fold>

  // <editor-fold desc='Pubic methods'>
  public createUntypedDataRequest(verb: DataVerb, path: string): IpcDataRequest {
    return new IpcDataRequest(++this.requestId, verb, path, this.applicationSecret, undefined);
  }

  public createDataRequest<T>(verb: DataVerb, path: string, data: T): IpcDataRequest {
    return new IpcDataRequest(++this.requestId, verb, path, this.applicationSecret, data);
  }
  // </editor-fold>
}
