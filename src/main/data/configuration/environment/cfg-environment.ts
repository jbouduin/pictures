import { TargetType, DtoEnvironment } from '@ipc';

import { CfgDatabase } from '../database/cfg-database';

export class CfgEnvironment implements DtoEnvironment {

  // <editor-fold desc='Interface members'>
  public database: CfgDatabase;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    this.database = new CfgDatabase()
  }
  // </editor-fold>
}
