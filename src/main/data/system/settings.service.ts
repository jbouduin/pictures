import { injectable, inject } from 'inversify';
import { IDatabaseService } from "../../database/database.service";
import { IConfigurationService } from "../configuration/configuration.service";
import { IDataRouterService } from "../data-router.service";
import { IDataService, DataService } from "../data-service";
import { RoutedRequest } from "../routed-request";
import { ILogService } from './log.service';

import SERVICETYPES from "di/service.types";
import { DtoDataResponse, DataStatus, DtoSetting } from "@ipc";
import * as crypto from 'crypto';

export interface ISettingsService extends IDataService { }

@injectable()
export class SettingsService extends DataService implements ISettingsService {

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    @inject(SERVICETYPES.LogService) logService: ILogService,
    @inject(SERVICETYPES.ConfigurationService) configurationService: IConfigurationService,
    @inject(SERVICETYPES.DatabaseService) databaseService: IDatabaseService) {
    super(logService, configurationService, databaseService);
  }
  // </editor-fold>

  // <editor-fold desc='IDataService interface methods'>
  public setRoutes(router: IDataRouterService): void {
    router.get('/setting/:key/exist', this.checkKeyExists.bind(this));
    router.post('/setting/:key/hash', this.createHashedSetting.bind(this));
    router.post('/setting/:key', this.createClearTextSetting.bind(this));
    router.post('/setting/:key/validate', this.validateHashedSetting.bind(this));
  }
  // </editor-fold>

  // <editor-fold desc='Get methods'>
  private async checkKeyExists(request: RoutedRequest<undefined>): Promise<DtoDataResponse<boolean>> {
    let result: DtoDataResponse<boolean>;

    try {
      const setting = await this.databaseService.getSettingRepository().findOne({ where: { name: request.params.key } });
      result = {
        status: DataStatus.Ok,
        data: setting ? true : false
      }
    } catch (error) {
      result = {
        status: DataStatus.Error,
        message: error.message
      }
    }
    return result;
  }
  // </editor-fold>

  // <editor-fold desc='Post methods'>
  private async createHashedSetting(request: RoutedRequest<DtoSetting>): Promise<DtoDataResponse<boolean>> {
    const hash = crypto.createHash('sha256').update(request.data.value).digest('hex');
    const result = await this.createSetting(request.params.key, hash);
    const response: DtoDataResponse<boolean> = {
      status: result.status,
      data: true,
      message: result.message
    };
    return response;
  }

  private createClearTextSetting(request: RoutedRequest<DtoSetting>): Promise<DtoDataResponse<DtoSetting>> {
    return this.createSetting(request.params.key, request.data.value);
  }

  private async validateHashedSetting(request: RoutedRequest<DtoSetting>): Promise<DtoDataResponse<boolean>> {
    let response: DtoDataResponse<boolean>;

    try {
      const setting = await this.databaseService
        .getSettingRepository()
        .findOneOrFail({ where: { name: request.params.key } });
      const hash = crypto.createHash('sha256').update(request.data.value).digest('hex');
      response = {
        status: DataStatus.Ok,
        data: hash === setting.value
      };
    } catch (error) {
      response = {
        status: DataStatus.Error,
        message: error.message
      }
    }

    return response;
  }
  // </editor-fold>

  // <editor-fold desc='Helper methods'>
  private async createSetting(name: string, value: string): Promise<DtoDataResponse<DtoSetting>> {
    let response: DtoDataResponse<DtoSetting>;

    try {
      const repository = this.databaseService.getSettingRepository()
      const setting = await repository.findOne({ where: { name: name } });
      if (setting) {
        response = {
          status: DataStatus.Conflict,
          message: 'Setting already exists'
        };
      } else {
        const toSave = repository.create();
        toSave.name = name;
        toSave.value = value;
        const result = await repository.save(toSave);
        response = {
          status: DataStatus.Ok,
          data: result
        };
      }
    } catch (error) {
      response = {
        status: DataStatus.Error,
        message: error.message
      }
    }
    return response;
  }
  // </editor-fold>
}
