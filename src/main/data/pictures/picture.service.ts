import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { DtoTaskRequest, TaskType, DtoRequestCreateThumb, DtoRequestReadMetaData, DtoResponseReadMetadata } from '@ipc';
import { LogSource } from '@ipc';

import { Collection, Picture, MetadataPictureMap } from '../../database';
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
  private exifKeysToSkip = [ 'makerNote', 'userComment' ];
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
    const metaDataKeyRepository = this.databaseService.getMetaDataKeyRepository();
    const metaDataPictureMapRepository = this.databaseService.getMetaDataPictureMapRepository();
    if (data.metadata.exif) {
      const toSave = new Array<MetadataPictureMap>();
      const picture = await this.databaseService.getPictureRepository().findOneOrFail(routedRequest.params.id);
      this.logService.verbose(LogSource.Main, `storing metadata for ${routedRequest.params.id}`);
      for (let key of Object.keys(data.metadata.exif)) {
        if (this.exifKeysToSkip.indexOf(key) < 0) {
          let metadataPictureMap: MetadataPictureMap;
          const metaDataKey = await metaDataKeyRepository
            .findOneOrFail({ where: { name: key } })
            .then(
              async found => {
                this.logService.debug(LogSource.Main, `found existing metadata key: ${found.name}`);
                metadataPictureMap = await metaDataPictureMapRepository.findOne( { where: { picture: picture, metadataKey: found } });
                return found;
              },
              () => {
                this.logService.debug(LogSource.Main, `creating new metadata key: ${key}`);
                return metaDataKeyRepository.create({ name: key });
              }
            );

          if (metadataPictureMap) {
            this.logService.debug(LogSource.Main, `updating existing value: ${data.metadata.exif[key]}`);
            metadataPictureMap.value = data.metadata.exif[key];
          } else {
            this.logService.debug(LogSource.Main, `creating new value: ${data.metadata.exif[key]}`);
            metadataPictureMap = metaDataPictureMapRepository.create({
              picture: picture,
              metadataKey: metaDataKey,
              value: data.metadata.exif[key]
            });
          }
          toSave.push(metadataPictureMap);
        }
      }
      await metaDataPictureMapRepository.save(toSave);
    }
  }
  // </editor-fold>

}
