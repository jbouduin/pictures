import { ConnectionType, DtoConnection } from '../../../ipc';

export class CfgConnection implements DtoConnection {
  public connectionName: string;
  public databaseName: string;
  public connectionType: string;
  public hostName: string;
  public port: number;
  public user: string;
  public password: string;
}
