import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { DtoResponseCreateThumb, DtoDataResponse, DtoImage, DataStatus } from '@ipc';

import { IDatabaseService } from '../../database';
import { ILogService } from '../../system';

import { IConfigurationService } from '../configuration';
import { IDataRouterService } from '../data-router.service';
import { IDataService, DataService } from '../data-service';
import { RoutedRequest } from '../routed-request';

import SERVICETYPES from '../../di/service.types';

export interface IThumbnailService extends IDataService { }

@injectable()
export class ThumbnailService extends DataService implements IThumbnailService {

  // <editor-fold desc='Private properties'>
  // </editor-fold>

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
    router.get('/thumbnail/:id', this.getThumbnail.bind(this));
    router.put('/thumbnail/:id', this.storeThumbnail.bind(this));
  }
  // </editor-fold>

  // <editor-fold desc='GET methods'>
  private async getThumbnail(routedRequest: RoutedRequest): Promise<DtoDataResponse<DtoImage>> {
    let image: string;

    if (routedRequest.params.id === 'generic') {
      image = this.readFileToBase64(`${this.configurationService.configuration.appPath}/dist/renderer/assets/thumb.png`)
    } else {
      const picture = await this.databaseService
        .getPictureRepository()
        .findOne(routedRequest.params.id);
      image = picture.thumb ? picture.thumb : undefined;
    }

    const response: DtoDataResponse<DtoImage> = {
      status: DataStatus.Ok,
      data: { image: image }
    };

    return response;
  }
  // </editor-fold>

  // <editor-fold desc='PUT methods'>
  private async storeThumbnail(routedRequest: RoutedRequest): Promise<void> {
    const data = routedRequest.data as DtoResponseCreateThumb;
    const repository = this.databaseService.getPictureRepository();
    await repository.update(routedRequest.params.id, { thumb: data.thumb });
    return;
  }
  // </editor-fold>
}
