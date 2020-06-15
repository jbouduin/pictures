import { DataVerb, DtoDataRequest } from '@ipc';

// TODO (#750) this should become a generic again.
export class IpcDataRequest implements DtoDataRequest<any> {
  public id: number;
  public verb: DataVerb;
  public path: string;
  public data: any;

  public constructor(id: number, verb: DataVerb, path: string, data: any) {
    this.id = id;
    this.verb = verb;
    this.path = path;
    this.data = data;
  }
}
