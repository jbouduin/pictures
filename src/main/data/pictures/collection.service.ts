import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { DataStatus, DtoDataResponse, DtoUntypedDataResponse } from '@ipc';
import { DtoGetCollection, DtoListCollection, DtoNewCollection, DtoSetCollection } from '@ipc';
import { DtoListPicture, DtoListPictureCollection } from '@ipc';

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
    router.get('/collection/:collection/pictures', this.getPictures.bind(this));
    // POST
    router.post('/collection', this.createCollection.bind(this));
    router.post('/collection/:collection/scan', this.scanCollection.bind(this));
    // PUT
    router.put('/collection/:collection', this.updateCollection.bind(this));
  }
  // </editor-fold>

  // <editor-fold desc='DELETE route callback'>
  private deleteCollection(request: RoutedRequest): Promise<DtoUntypedDataResponse> {
    return this.databaseService
      .getCollectionRepository()
      .delete(request.params.collection)
      .then(
        () => {
          const result: DtoUntypedDataResponse = {
            status: DataStatus.Ok
          };
          return result;
        },
        (error) => {
          console.log(error);
          const result: DtoUntypedDataResponse = {
            status: DataStatus.Error,
            message: `${error.name}: ${error.message}`
          };
          return result;
        }
      )
  }
  // </editor-fold>

  // <editor-fold desc='GET routes callbacks'>
  private getCollections(request: RoutedRequest): Promise<DtoDataResponse<Array<DtoListCollection>>> {
    const collectionQry = this.databaseService
      .getCollectionRepository()
      .createQueryBuilder('collection')
      .select('id')
      .addSelect('name')
      .addSelect('path')
      .leftJoin( (cntQry) => {
        return cntQry
          .select('collectionId')
          .addSelect("path as thumbPath")
          .addSelect("name as fileName")
          .addSelect("COUNT(*) AS count")
          .from('picture', null)
          .orderBy("path", "DESC")
          .addOrderBy("fileName", "DESC")
          .groupBy("picture.collectionId")
        },
        'cnt',
        'cnt.collectionId = collection.Id',
      )
      .addSelect('cnt.count')
      .addSelect('cnt.thumbPath')
      .addSelect('cnt.fileName')
      .orderBy('collection.name');
    console.log(collectionQry.getQuery());

    return collectionQry.getRawMany().then(
      collections => {
        const dtoCollections: Array<DtoListCollection> = collections.map(collection => {
          const result: DtoListCollection = {
            id: collection.id,
            name: collection.name,
            path: collection.path,
            pictures: collection.count || 0,
            thumb: collection.thumbPath ?
              `${collection.thumbPath}/${collection.fileName}` :
              undefined
          };
          return result;
        });
        const result: DtoDataResponse<Array<DtoListCollection>> = {
          status: DataStatus.Ok,
          data: dtoCollections,
        };
        return result;
      },
      error => {
        console.log(error);
        const result: DtoDataResponse<Array<DtoListCollection>> = {
          status: DataStatus.Error,
          message: `${error.name}: ${error.message}`
        };
        return result;
      }
    );
  }

  private getCollection(request: RoutedRequest): Promise<DtoDataResponse<DtoGetCollection>> {
    return this.databaseService
      .getCollectionRepository()
      .findOneOrFail(request.params.collection)
      .then(
        collection => {
          const dtoCollection: DtoGetCollection = {
            id: collection.id,
            created: collection.created,
            modified: collection.modified,
            version: collection.version,
            name: collection.name,
            path: collection.path
          }
          const result: DtoDataResponse<DtoGetCollection> = {
            status: DataStatus.Ok,
            data: dtoCollection
          };
          return result;
        },
        error => {
          const result: DtoDataResponse<DtoGetCollection> = {
            status: DataStatus.Conflict,
            message: `${error.name}: ${error.message}`
          };
          return result;
        }
      );
  }

  private getPictures(request: RoutedRequest): Promise<DtoDataResponse<Array<DtoListPicture>>> {
    const pictureQry = this.databaseService
      .getCollectionRepository()
      .createQueryBuilder('collection')
      .innerJoinAndSelect('collection.pictures', 'picture')
      .where("collection.id = :collectionId", { collectionId: request.params.collection })
    console.log(pictureQry.getQuery());

    return pictureQry.getOne().then(
      collection => {
        if (!collection) {
          const result: DtoDataResponse<Array<DtoListPicture>> = {
            status: DataStatus.NotFound
          };
          return result;
        }
        else {
          const dtoListPictureCollection: DtoListPictureCollection = {
            id: collection.id,
            name: collection.name,
            path: collection.path
          };

          return collection.pictures.then(pictures => {
            const dtoListPictures = pictures.map(picture => {
              const dtoListPicture: DtoListPicture = {
                id: picture.id,
                name: picture.name,
                path: picture.path,
                collection: dtoListPictureCollection
              };
              return dtoListPicture;
            });

            const result: DtoDataResponse<Array<DtoListPicture>> = {
              status: DataStatus.Ok,
              data: dtoListPictures
            };
            return result;
          });
        }
      },
      error => {
        console.log(error);
        const result: DtoDataResponse<Array<DtoListPicture>> = {
          status: DataStatus.Error,
          message: `${error.name}: ${error.message}`
        };
        return result;
      }
    );
  }

  private notImplemented(request: RoutedRequest): Promise<DtoUntypedDataResponse> {
    const result: DtoUntypedDataResponse = {
      status: DataStatus.Error,
      data: `Route ${request.route} is not implemented`
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
        message: `The directory '${request.data.path}' could not be found`
      };
      return Promise.resolve(result);
    }

    const newCollection = repository.create({
      name: request.data.name,
      path: request.data.path
    });

    return repository.save(newCollection).then(
      collection => {
        const scanStatus = this.scanDirectory(collection);
        const listItem: DtoListCollection = {
          id: collection.id,
          name: collection.name,
          path: collection.path,
          pictures: 0,
          thumb: undefined,
        };
        const result: DtoDataResponse<DtoListCollection> = {
          status: DataStatus.Ok,
          data: listItem
        };
        return result;
      },
      error => {
        const result: DtoDataResponse<DtoListCollection> = {
          status: DataStatus.Conflict,
          message: `${error.name}: ${error.message}`
        };
        return result;
      }
    );
  }

  private scanCollection(request: RoutedRequest): Promise<DtoUntypedDataResponse> {
    return this.databaseService.getCollectionRepository()
    .findOneOrFail(request.params.collection)
    .then(
      collection => {
        this.scanDirectory(collection);
        const result: DtoUntypedDataResponse = {
          status: DataStatus.Accepted
        };
        return result;
      },
      error => {
        const result: DtoUntypedDataResponse = {
          status: DataStatus.Error,
          message: `${error.name}: ${error.message}`
        };
        return result;
      }
    );
  }
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
                thumb: undefined
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
  private scanDirectory(collection: Collection): void {
    this.fileService
      .scanDirectory(collection.path, this.fileTypes)
      .then(
        files => {
          const total = files.length;
          let done = 0;
          console.log(`found ${total} files`);
          // TODO send a status to the renderer with the number of files found
          let promises = new Array<Promise<Picture>>();
          files.forEach( (file, index) => {
            // save each file in a separate transaction
            promises.push(this.pictureService.addPicture(collection, file));
            if (((index + 1) % 10 === 0) || (index === total - 1)) {
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
        },
        error => {
          console.log(error);
        }
      );
  }
  // </editor-fold>
}
