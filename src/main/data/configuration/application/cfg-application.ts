import { DtoApplication } from '../../../../ipc';

export class CfgApplication implements DtoApplication {
  public dateFormat: string;
  public secret: string;
}
