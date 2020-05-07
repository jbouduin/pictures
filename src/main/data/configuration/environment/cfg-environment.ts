import { TargetType, DtoEnvironment } from '@ipc';

import { LogLevel } from '@ipc';
import { CfgDatabase } from '../database/cfg-database';

export class CfgEnvironment implements DtoEnvironment {

  // <editor-fold desc='Interface members'>
  public database: CfgDatabase;
  // TODO move this to real configuration files
  public thumbBaseDirectory: string;
  public logLevel: LogLevel;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    this.database = new CfgDatabase();
    this.thumbBaseDirectory = 'C:/temp/pictures/thumbs';
    this.logLevel = LogLevel.Info;
  }
  // </editor-fold>
}
