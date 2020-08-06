import * as fs from 'fs';
import { AES, enc } from 'crypto-ts';

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
  protected async readFileToBase64(path: string): Promise<string> {
    if (path) {
      const img = await fs.promises.readFile(path);
      return img.toString('base64');
    }
    else {
      return undefined;
    }
  }

  public decryptData(value: string, applicationSecret: string): string {
    const decrypted = AES.decrypt(value, applicationSecret);
    return decrypted.toString(enc.Utf8);
  }

  public encryptData(value: string, applicationSecret: string): string {
    return AES.encrypt(value, applicationSecret).toString();
  }
  // </editor-fold>
}
