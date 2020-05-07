import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { DataStatus, DtoDataResponse } from '@ipc';

import { Collection, Picture } from '../../database';
import { IDatabaseService } from '../../database';
import { IImageService, ILogService } from '../../system';

import { IConfigurationService } from '../configuration';
import { IDataRouterService } from '../data-router.service';
import { IDataService } from '../data-service';
import { RoutedRequest } from '../routed-request';

import SERVICETYPES from '../../di/service.types';

export interface IPictureService extends IDataService {
  upsertPicture(collection: Collection, relativePath: string): Promise<Picture>;
}

@injectable()
export class PictureService implements IPictureService {

  // <editor-fold desc='Private properties'>
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    @inject(SERVICETYPES.LogService) private logService: ILogService,
    @inject(SERVICETYPES.ConfigurationService) private configurationService: IConfigurationService,
    @inject(SERVICETYPES.DatabaseService) private databaseService: IDatabaseService,
    @inject(SERVICETYPES.ImageService) private imageService: IImageService) { }
  // </editor-fold>

  // <editor-fold desc='IDataService interface methods'>
  public setRoutes(router: IDataRouterService): void { }
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
          this.logService.verbose(`picture '${path}/${name}' already in '${collection.name}'`);
          return picture;
        },
        () => {
          const newPicture = repository.create({
            name: name,
            path: path,
            collection: collection
          });
          this.logService.error(`adding '${path}/${name}' to '${collection.name}'`);
          return repository.save(newPicture);
        }
      ).then( picture => { return this.imageService.checkThumbnail(collection, picture); });
  }
  // </editor-fold>

  // <editor-fold desc='Private methods'>

  // </editor-fold>
}
