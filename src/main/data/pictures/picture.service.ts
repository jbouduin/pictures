import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { LogSource, DtoResponseCreateThumb, DtoDataResponse, DtoImage, DataStatus, DtoTaskRequest, TaskType, DtoRequestCreateThumb } from '@ipc';

import { Collection, Picture } from '../../database';
import { IDatabaseService } from '../../database';
import { ILogService, IQueueService } from '../../system';

import { IConfigurationService } from '../configuration';
import { IDataRouterService } from '../data-router.service';
import { IDataService, DataService } from '../data-service';
import { RoutedRequest } from '../routed-request';

import SERVICETYPES from '../../di/service.types';

export interface IPictureService extends IDataService {
  upsertPicture(collection: Collection, relativePath: string): Promise<Picture>;
}

@injectable()
export class PictureService extends DataService implements IPictureService {

  // <editor-fold desc='Private properties'>
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    @inject(SERVICETYPES.LogService) logService: ILogService,
    @inject(SERVICETYPES.ConfigurationService) configurationService: IConfigurationService,
    @inject(SERVICETYPES.DatabaseService) databaseService: IDatabaseService,
    @inject(SERVICETYPES.QueueService) private queueService: IQueueService) {
    super(logService, configurationService, databaseService);
  }
  // </editor-fold>

  // <editor-fold desc='IDataService interface methods'>
  public setRoutes(router: IDataRouterService): void {
    router.get('/thumbnail/:id', this.getThumbnail.bind(this));
    router.put('/thumbnail/:id', this.storeThumbnail.bind(this));
  }
  // </editor-fold>

  // <editor-fold desc='IPictureService interface methods'>
  public upsertPicture(collection: Collection, relativePath: string): Promise<Picture> {
    const splitted = relativePath.split('/');
    const name = splitted.pop();
    const path = splitted.join('/');
    const repository = this.databaseService.getPictureRepository();
    return repository
      .findOneOrFail({
          where: {
            path: path,
            name: name,
            collection: collection
          }
      })
      .then(
        picture => {
          this.logService.debug(LogSource.Main, `picture '${path}/${name}' already in '${collection.name}'`);
          return picture;
        },
        () => {
          const newPicture = repository.create({
            name: name,
            path: path,
            collection: collection
          });
          this.logService.error(LogSource.Main, `adding '${path}/${name}' to '${collection.name}'`);
          return repository.save(newPicture);
        }
      ).then( picture => {
        if (!picture.thumb) {
          const picturePath = `${collection.path}/${picture.path}/${picture.name}`;
          const request: DtoTaskRequest<DtoRequestCreateThumb> = {
            taskType: TaskType.CreateThumb,
            data: {
              id: picture.id,
              source: picturePath
            }
          };
          this.queueService.push(request);
        }
        return picture }
      );
  }
  // </editor-fold>

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

  private async storeThumbnail(routedRequest: RoutedRequest): Promise<void> {
    const data = routedRequest.data as DtoResponseCreateThumb;
    const repository = this.databaseService.getPictureRepository();
    await repository.update(routedRequest.params.id, { thumb: data.thumb });
    return;
  }
}
