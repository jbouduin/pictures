import { DataVerb, DtoDataRequest } from '@ipc';

// TODO (#750) this should become a generic again.
export class IpcDataRequest implements DtoDataRequest<any> {
  public verb: DataVerb;
  public path: string;
  public data: any;
}
