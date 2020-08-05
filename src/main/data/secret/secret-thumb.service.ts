import { injectable, inject } from "inversify";
import { ILogService } from "system";
import { IDatabaseService } from "../../database/database.service";
import { IConfigurationService } from "../configuration/configuration.service";
import { IDataRouterService } from "../data-router.service";
import { IDataService, DataService } from "../data-service";
import { RoutedRequest } from "../routed-request";

import SERVICETYPES from "di/service.types";
import { DtoImage, DtoDataResponse, DataStatus, DtoResponseCreateThumb } from "@ipc";

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
      const result: DtoImage = { image: thumb.data };
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
  private async createSecretThumb(request: RoutedRequest<DtoResponseCreateThumb>): Promise<void> {
    const repository = this.databaseService.getSecretThumbRepository();
    let thumb = await repository.findOne({ where: { pictureId: request.params.id} });
    if (!thumb) {
      thumb = repository.create();
      thumb.pictureId = request.params.id;
    }
    thumb.data = request.data.thumb;
    await repository.save(thumb);
    return;
  }
  // </editor-fold>
}
