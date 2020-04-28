import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { DataStatus, DtoListCollection, DtoDataResponse } from '@ipc';

import { IDatabaseService } from '../../database';
import { IDataRouterService } from '../data-router.service';

import { IDataService } from '../data-service';
import { RoutedRequest } from '../routed-request';

import SERVICETYPES from '../../di/service.types';

export interface ICollectionService extends IDataService<boolean> { }

@injectable()
export class CollectionService implements ICollectionService {

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    @inject(SERVICETYPES.DatabaseService) private databaseService: IDatabaseService) { }
  // </editor-fold>

  // <editor-fold desc='IService interface methods'>
  public initialize(): Promise<boolean> {
    console.log('in initialize CollectionService');
    return Promise.resolve(true);
  }
  // </editor-fold>

  // <editor-fold desc='IDataService interface methods'>
  public setRoutes(router: IDataRouterService): void {
    // GET
    router.get('/collection', this.getCollection.bind(this));
    router.get('/collection/:collection', this.notImplemented);
    router.get('/collection/:collection/pictures', this.notImplemented);
    // POST
    router.post('/collection', this.createCollection.bind(this));
  }
  // </editor-fold>

  // <editor-fold desc='GET route callbacks'>

  private getCollection(request: RoutedRequest): Promise<DtoDataResponse<Array<DtoListCollection>>> {
    return this.databaseService
      .getCollectionRepository()
      .createQueryBuilder('collection')
      .orderBy('collection.name')
      .getMany()
      .then( collections => {
        const dtoConnections: Array<DtoListCollection> = collections.map(collection => {
          const result: DtoListCollection = {
            id: collection.id,
            name: collection.name,
            path: collection.path,
            pictures: 0
          };
          return result;
        });
        return dtoConnections;
      })
      .then( dtoListCollections => {
        const result: DtoDataResponse<Array<DtoListCollection>> = {
          status: DataStatus.Ok,
          data: dtoListCollections
        };
        return result;
      });
  }

  private notImplemented(request: RoutedRequest): Promise<DtoDataResponse<any>> {
    const result: DtoDataResponse<string> = {
      status: DataStatus.Error,
      data: 'Not implemented'
    };
    return Promise.resolve(result);
  }
  // </editor-fold>

  // <editor-fold desc='POST route callbacks'>
  public createCollection(request: RoutedRequest): Promise<DtoDataResponse<DtoListCollection>> {
    const repository = this.databaseService
      .getCollectionRepository();

    const newCollection = repository.create({
      name: request.data.name,
      path: request.data.path
    });

    return repository.save(newCollection)
      .then(collection => {
        const listItem: DtoListCollection = {
          id: collection.id,
          name: collection.name,
          path: collection.path,
          pictures: 0
        };
        const result: DtoDataResponse<DtoListCollection> = {
          status: DataStatus.Ok,
          data: listItem
        };
        return result;
      });
  }
  // </editor-fold>
}
