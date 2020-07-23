import * as fs from 'fs';

import { IDataRouterService } from './data-router.service';
import { IDatabaseService } from '../database/database.service';
import { ILogService } from '../system/log.service';
import { IConfigurationService } from './configuration/configuration.service';
import { injectable } from 'inversify';

export interface IDataService {
  setRoutes(router: IDataRouterService): void;
}

@injectable()
export abstract class DataService implements IDataService {

  // <editor-fold desc='Protected properties'>
  protected logService: ILogService;
  protected configurationService: IConfigurationService;
  protected databaseService: IDatabaseService
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    logService: ILogService,
    configurationService: IConfigurationService,
    databaseService: IDatabaseService) {
    this.logService = logService;
    this.configurationService = configurationService;
    this.databaseService = databaseService;
  }
  // </editor-fold>

  // <editor-fold desc='IDataService interface methods'>
  public abstract setRoutes(router: IDataRouterService): void;
  // </editor-fold>

  // <editor-fold desc='Protected helper methods'>
  protected readFileToBase64(path: string): string {
    if (path) {
      const img = fs.readFileSync(path);
      return img.toString('base64');
    }
    else {
      return undefined;
    }
  }
  // </editor-fold>
}
