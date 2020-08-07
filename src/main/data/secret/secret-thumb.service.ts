import { injectable, inject } from "inversify";
import { IDatabaseService } from "../../database/database.service";
import { IConfigurationService } from "../configuration/configuration.service";
import { IDataRouterService } from "../data-router.service";
import { IDataService, DataService } from "../data-service";
import { ILogService } from "../system/log.service";
import { RoutedRequest } from "../routed-request";

import SERVICETYPES from "di/service.types";
import { DtoImage, DtoDataResponse, DataStatus, DtoResponseCreateThumb, LogSource } from "@ipc";

export interface ISecretThumbService extends IDataService { }

@injectable()
export class SecretThumbService extends DataService implements ISecretThumbService {

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
    router.get('/secret/thumb/:id', this.getSecretThumb.bind(this));
    router.post('/secret/thumb', this.createSecretThumb.bind(this));
  }
  // </editor-fold>

  // <editor-fold desc='Get methods'>
  private async getSecretThumb(request: RoutedRequest<undefined>): Promise<DtoDataResponse<DtoImage>> {
    let response: DtoDataResponse<DtoImage>;
    try {
      const thumb = await this.databaseService
        .getSecretThumbRepository()
        .findOneOrFail({ where: { pictureId: request.params.id} });
      const picture = await this.databaseService
        .getPictureRepository()
        .findOneOrFail(request.params.id, { relations: [ 'collection' ]});

      picture.collection.decryptedKey = this.decryptData(picture.collection.encryptedKey, request.applicationSecret);

      const result: DtoImage = { image: this.decryptData(thumb.data, picture.collection.decryptedKey) };
      response = {
        status: DataStatus.Ok,
        data: result
      };
    } catch (error) {
      this.logService.error(LogSource.Main, error);
      response = {
        status: DataStatus.Error,
        message: error.message
      };
    }
    return response;
  }
  // </editor-fold>

  // <editor-fold desc='Post methods'>
  private async createSecretThumb(request: RoutedRequest<DtoResponseCreateThumb>): Promise<void> {
    const thumbRepository = this.databaseService.getSecretThumbRepository();

    try {
      const picture = await this.databaseService
        .getPictureRepository()
        .findOneOrFail(request.data.id, { relations: [ 'collection' ]});
      picture.collection.decryptedKey = this.decryptData(picture.collection.encryptedKey, request.applicationSecret);

      let thumb = await thumbRepository.findOne({ where: { pictureId: request.data.id } });
      if (!thumb) {
        thumb = thumbRepository.create();
        thumb.pictureId = request.data.id;
      }
      thumb.data = this.encryptData(request.data.thumb, picture.collection.decryptedKey);
      await thumbRepository.save(thumb);
    } catch (error) {
      console.log(error);
      this.logService.error(LogSource.Main, error);
    }
    return;
  }
  // </editor-fold>
}
