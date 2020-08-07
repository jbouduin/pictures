import { AES, enc } from 'crypto-ts';
import * as fs from 'fs';
import { injectable } from 'inversify';

import { IDataRouterService } from './data-router.service';
import { IDatabaseService } from '../database/database.service';
import { IConfigurationService } from './configuration/configuration.service';
import { ILogService } from './system/log.service';

export interface IDataService {
  setRoutes(router: IDataRouterService): void;
}

@injectable()
export abstract class BaseDataService implements IDataService {

  // <editor-fold desc='Protected properties'>
  protected configurationService: IConfigurationService;
  protected databaseService: IDatabaseService
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    configurationService: IConfigurationService,
    databaseService: IDatabaseService) {
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

  protected dateToSqlParameter(date: Date): string {
    return date.getUTCFullYear() + '-' +
      (date.getUTCMonth() + 1) + '-' +
      date.getUTCDate() + ' ' +
      date.getUTCHours() + ':' +
      date.getUTCMinutes() + ':' +
      date.getUTCSeconds();
  }

  protected decryptData(value: string, applicationSecret: string): string {
    if (value) {
      const decrypted = AES.decrypt(value, applicationSecret);
      return decrypted.toString(enc.Utf8);
    } else {
      return undefined;
    }
  }

  protected encryptData(value: string, applicationSecret: string): string {
    return AES.encrypt(value, applicationSecret).toString();
  }
  // </editor-fold>
}

@injectable()
export abstract class DataService extends BaseDataService {
  // <editor-fold desc='Protected properties'>
  protected logService: ILogService;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    logService: ILogService,
    configurationService: IConfigurationService,
    databaseService: IDatabaseService) {
    super(configurationService, databaseService);

    this.logService = logService;
    this.configurationService = configurationService;
    this.databaseService = databaseService;
  }
  // </editor-fold>

}
