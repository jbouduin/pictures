import { DataVerb, DtoDataRequest } from '@ipc';

// TODO (#750) this should become a generic again.
export class IpcDataRequest implements DtoDataRequest<any> {
  public id: number;
  public verb: DataVerb;
  public path: string;
  public secretKey: string | undefined;
  public data: any;

  public constructor(id: number, verb: DataVerb, path: string, key: string | undefined, data: any) {
    this.id = id;
    this.verb = verb;
    this.path = path;
    this.secretKey = key;
    this.data = data;
  }
}
