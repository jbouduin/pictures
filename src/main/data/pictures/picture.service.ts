import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { DtoTaskRequest, TaskType, DtoRequestCreateThumb, DtoRequestReadMetaData, DtoResponseReadMetadata } from '@ipc';
import { LogSource } from '@ipc';

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
    router.put('/picture/:id/metadata', this.storeMetaData.bind(this));
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
        const picturePath = `${collection.path}/${picture.path}/${picture.name}`;
        if (!picture.thumb) {
          const thumbRequest: DtoTaskRequest<DtoRequestCreateThumb> = {
            taskType: TaskType.CreateThumb,
            data: {
              id: picture.id,
              source: picturePath
            }
          };
          this.queueService.push(thumbRequest);
        }
        const metaDataRequest : DtoTaskRequest<DtoRequestReadMetaData> =  {
          taskType: TaskType.ReadMetaData,
          data: {
            id: picture.id,
            source: picturePath
          }
        };
        this.queueService.push(metaDataRequest);
        return picture
      });
  }
  // </editor-fold>

  // <editor-fold desc='PUT methods'>
  private async storeMetaData (routedRequest: RoutedRequest): Promise<void> {
    const data = routedRequest.data as DtoResponseReadMetadata;
    if (data.metadata.exif) {
      for (let key of Object.keys(data.metadata.exif)) {
        let value = data.metadata.exif[key];
        console.log(`${key}: ${value}`);
      }
    }
  }
  // </editor-fold>

}
