import { injectable, inject } from "inversify";
import { ILogService } from "system";
import { IDatabaseService } from "../../database/database.service";
import { IConfigurationService } from "../configuration/configuration.service";
import { IDataRouterService } from "../data-router.service";
import { IDataService, DataService } from "../data-service";
import { RoutedRequest } from "../routed-request";

import SERVICETYPES from "di/service.types";
import { DtoImage, DtoDataResponse, DataStatus, DtoResponseCreateThumb } from "@ipc";

export interface ISecretImageService extends IDataService { }

@injectable()
export class SecretImageService extends DataService implements ISecretImageService {

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
    router.get('/secret/image/:id', this.getSecretImage.bind(this));
    router.post('/secret/image', this.createSecretImage.bind(this));
  }
  // </editor-fold>

  // <editor-fold desc='Get methods'>
  private async getSecretImage(request: RoutedRequest<undefined>): Promise<DtoDataResponse<DtoImage>> {
    let response: DtoDataResponse<DtoImage>;
    try {
      const image = await this.databaseService
        .getSecretImageRepository()
        .findOneOrFail({ where: { pictureId: request.params.id} });
      const result: DtoImage = { image: image.data };
      response = {
        status: DataStatus.Ok,
        data: result
      };
    } catch (error) {
      response = {
        status: DataStatus.Error,
        message: error.message
      };
    }
    return response;
  }
  // </editor-fold>

  // <editor-fold desc='Post methods'>
  private async createSecretImage(request: RoutedRequest<DtoResponseCreateThumb>): Promise<void> {
    const repository = this.databaseService.getSecretImageRepository();
    let image = await repository.findOne({ where: { pictureId: request.params.id} });
    if (!image) {
      image = repository.create();
      image.pictureId = request.params.id;
    }
    image.data = request.data.thumb;
    await repository.save(image);
    return;
  }
  // </editor-fold>
}
