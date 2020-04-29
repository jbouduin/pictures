import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { DataStatus, DtoCollection, DtoListCollection, DtoDataResponse, DtoScan, ScanStatus } from '@ipc';

import { Collection, Picture } from '../../database';
import { IDatabaseService } from '../../database';
import { IFileService } from '../../system';

import { IDataRouterService } from '../data-router.service';
import { IDataService } from '../data-service';
import { RoutedRequest } from '../routed-request';

import { IPictureService } from './picture.service';

import SERVICETYPES from '../../di/service.types';

export interface ICollectionService extends IDataService { }

@injectable()
export class CollectionService implements ICollectionService {

  // TODO this should come from configuration
  private readonly fileTypes = [ 'jpg', 'jpeg', 'bmp', 'tiff', 'png', 'svg' ];

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    @inject(SERVICETYPES.DatabaseService) private databaseService: IDatabaseService,
    @inject(SERVICETYPES.PictureService) private pictureService: IPictureService,
    @inject(SERVICETYPES.FileService) private fileService: IFileService) { }
  // </editor-fold>

  // <editor-fold desc='IDataService interface methods'>
  public setRoutes(router: IDataRouterService): void {
    // DELETE
    router.delete('/collection/:collection', this.deleteCollection.bind(this));
    // GET
    router.get('/collection', this.getCollections.bind(this));
    router.get('/collection/:collection', this.getCollection.bind(this));
    router.get('/collection/:collection/pictures', this.notImplemented);
    // POST
    router.post('/collection', this.createCollection.bind(this));
    // router.post('/collection/:collection/scan', this.scanCollection.bind(this));
    // PUT
    router.put('/collection/:collection', this.updateCollection.bind(this));
    this.fileService.scanDirectory('c:/temp/scans', this.fileTypes);
  }
  // </editor-fold>

  // <editor-fold desc='DELETE route callback'>
  private deleteCollection(request: RoutedRequest): Promise<DtoDataResponse<string>> {
    return this.databaseService
      .getCollectionRepository()
      .delete(request.params.collection)
      .then(
        () => {
          const result: DtoDataResponse<string> = {
            status: DataStatus.Ok,
            data: undefined
          };
          return result;
        },
        (error) => {
          console.log(error);
          const result: DtoDataResponse<string> = {
            status: DataStatus.Error,
            data: undefined
          };
          return result;
        }
      )
  }
  // </editor-fold>

  // <editor-fold desc='GET routes callbacks'>
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
            pictures: 0,
            scanStatus: ScanStatus.NoScan
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
  private createCollection(request: RoutedRequest): Promise<DtoDataResponse<DtoListCollection>> {
    const repository = this.databaseService
      .getCollectionRepository();

    if (!this.fileService.directoryExists(request.data.path)) {
      const result: DtoDataResponse<DtoListCollection> = {
        status: DataStatus.Error,
        data: undefined
      };
      return Promise.resolve(result);
    }

    const newCollection = repository.create({
      name: request.data.name,
      path: request.data.path
    });

    return repository.save(newCollection)
      .then(collection => {
        const scanStatus = this.scanDirectory(collection);
        const listItem: DtoListCollection = {
          id: collection.id,
          name: collection.name,
          path: collection.path,
          pictures: 0,
          scanStatus: scanStatus.status
        };
        const result: DtoDataResponse<DtoListCollection> = {
          status: DataStatus.Ok,
          data: listItem
        };
        return result;
      });
  }

  // private scanCollection(request: RoutedRequest): Promise<DtoDataResponse<string> {
  //
  // }
  // </editor-fold>

  // <editor-fold desc='PUT route callback'>
  private updateCollection(request: RoutedRequest): Promise<DtoDataResponse<DtoListCollection>> {
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
                pictures: 0,
                scanStatus: ScanStatus.NoScan
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

  // <editor-fold desc='Private helper methods'>
  private scanDirectory(collection: Collection): DtoScan {
    const result: DtoScan = {
      status: ScanStatus.NoScan,
      files: 0
    };
    this.fileService
      .scanDirectory(collection.path, this.fileTypes)
      .then(files => {
        const total = files.length;
        let done = 0;
        console.log(`found ${total} files`);
        // TODO send a status to the renderer with the number of files found
        let promises = new Array<Promise<Picture>>();
        files.forEach( (file, index) => {
          // save each file in a separate transaction
          promises.push(this.pictureService.addPicture(collection, file));
          if (((index + 1) % 10 === 0) || (index === total - 1)) {
            console.log(index);
            Promise
              .all(promises)
              .then( pictures => {
                done += pictures.length;
                // TODO send current status to renderer
                console.log(`processed ${done}/${total}pictures`);
                // TODO if (done === total) send finished to renderer
              });
            promises = new Array<Promise<Picture>>();
          }
        });
      });
    return result;
  }
  // </editor-fold>
}
