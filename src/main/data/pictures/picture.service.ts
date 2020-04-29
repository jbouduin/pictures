import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { DataStatus, DtoDataResponse } from '@ipc';

import { Collection, Picture } from '../../database';
import { IDatabaseService } from '../../database';
import { IFileService } from '../../system';

import { IDataRouterService } from '../data-router.service';
import { IDataService } from '../data-service';
import { RoutedRequest } from '../routed-request';

import SERVICETYPES from '../../di/service.types';

export interface IPictureService extends IDataService {
  addPicture(collection: Collection, relativePath: string): Promise<Picture>;
}

@injectable()
export class PictureService implements IPictureService {

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    @inject(SERVICETYPES.DatabaseService) private databaseService: IDatabaseService) { }
  // </editor-fold>

  // <editor-fold desc='IDataService interface methods'>
  public setRoutes(router: IDataRouterService): void { }
  // </editor-fold>

  // <editor-fold desc='IPictureService interface methods'>
  public addPicture(collection: Collection, relativePath: string): Promise<Picture> {
    const splitted = relativePath.split('/');
    const fileName = splitted.pop();
    const path = splitted.join('/');
    const repository = this.databaseService.getPictureRepository();
    return repository
      .findOneOrFail({
          where: {
            path: path,
            fileName: fileName,
            collection: collection
          }
      })
      .then(
        picture => {
          console.log(`picture '${path}/${fileName}' already in collection`);
          return picture;
        },
        () => {
          const newPicture = repository.create({
            fileName: fileName,
            path: path,
            collection: collection
          });
          console.log(`adding '${path}/${fileName}' to collection`);
          return repository.save(newPicture);
        }
      );
  }
  // </editor-fold>
}
