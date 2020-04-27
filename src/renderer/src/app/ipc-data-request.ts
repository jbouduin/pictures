import { DataVerb, DtoDataRequest } from '@ipc';

export class IpcDataRequest implements DtoDataRequest<T> {
  public verb: DataVerb;
  public path: string;
  public data: T;
}
