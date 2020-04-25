import { CfgConnection } from './cfg-connection';
import { CfgTarget } from './cfg-target';

export class CfgDatabase {
  public connections: Array<CfgConnection>;
  public targets: Array<CfgTarget>;
}
