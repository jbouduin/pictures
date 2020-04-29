import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { DataStatus, DtoCollection, DtoListCollection, DtoDataResponse } from '@ipc';

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
    router.get('/collection', this.getCollections.bind(this));
    router.get('/collection/:collection', this.getCollection.bind(this));
    router.get('/collection/:collection/pictures', this.notImplemented);
    // POST
    router.post('/collection', this.createCollection.bind(this));
    // PUT
    router.put('/collection/:collection', this.updateCollection.bind(this));
  }
  // </editor-fold>

  // <editor-fold desc='GET route callbacks'>
  private getCollections(request: RoutedRequest): Promise<DtoDataResponse<Array<DtoListCollection>>> {
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
          data: dtoListCollections,
        };
        return result;
      });
  }

  private getCollection(request: RoutedRequest): Promise<DtoDataResponse<DtoCollection>> {
    return this.databaseService
      .getCollectionRepository()
      .findOneOrFail(request.params.collection)
      .then(
        collection => {
          const dtoCollection: DtoCollection = {
            id: collection.id,
            created: collection.created,
            modified: collection.modified,
            version: collection.version,
            name: collection.name,
            path: collection.path
          }
          const result: DtoDataResponse<DtoCollection> = {
            status: DataStatus.Ok,
            data: dtoCollection
          };
          return result;
        },
        () => {
          const result: DtoDataResponse<DtoCollection> = {
            status: DataStatus.Conflict,
            data: undefined
          };
          return result;
        }
      );
  }

  private notImplemented(request: RoutedRequest): Promise<DtoDataResponse<any>> {
    const result: DtoDataResponse<string> = {
      status: DataStatus.Error,
      data: undefined
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


  // <editor-fold desc='PUT route callback'>
  public updateCollection(request: RoutedRequest): Promise<DtoDataResponse<DtoListCollection>> {
    const repository = this.databaseService.getCollectionRepository();
    return repository
      .findOneOrFail(request.params.collection)
      .then(
        collection => {
          collection.name = request.data.name;
          return repository.save(collection).then(
            savedCollection => {
              const dtoListCollection: DtoListCollection = {
                id: savedCollection.id,
                name: savedCollection.name,
                path: savedCollection.path,
                pictures: 0
              };
              const result: DtoDataResponse<DtoListCollection> = {
                status: DataStatus.Ok,
                data: dtoListCollection,
              };
              return result;
            },
            () => {
              const result: DtoDataResponse<DtoListCollection> = {
                status: DataStatus.Conflict,
                data: undefined
              };
              return result;
            }
          );
        },
        () => {
          const result: DtoDataResponse<DtoListCollection> = {
            status: DataStatus.Conflict,
            data: undefined
          };
          return result;
        }
      );
  }
  // </editor-fold>
}
