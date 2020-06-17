import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { DataStatus, DtoDataResponse, DtoListDataResponse, DtoUntypedDataResponse, DtoTreeBase } from '@ipc';
import { DtoGetCollection, DtoListCollection } from '@ipc';
import { DtoListPicture, DtoListPictureCollection } from '@ipc';
import { LogSource } from '@ipc';

import { Collection, Picture } from '../../database';
import { IDatabaseService } from '../../database';
import { IFileService, ILogService } from '../../system';

import { IConfigurationService } from '../configuration';
import { IDataRouterService } from '../data-router.service';
import { IDataService } from '../data-service';
import { RoutedRequest } from '../routed-request';

import { IPictureService } from './picture.service';

import SERVICETYPES from '../../di/service.types';
import { Like } from 'typeorm';

export interface ICollectionService extends IDataService { }

@injectable()
export class CollectionService implements ICollectionService {

  // TODO this should come from configuration
  private readonly fileTypes = [ 'jpg', 'jpeg', 'bmp', 'tiff', 'png', 'svg' ];

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    @inject(SERVICETYPES.LogService) private logService: ILogService,
    @inject(SERVICETYPES.ConfigurationService) private configurationService: IConfigurationService,
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
    router.get('/collection/:collection/tree', this.getTree.bind(this));
    // POST
    router.post('/collection', this.createCollection.bind(this));
    router.post('/collection/:collection/scan', this.scanCollection.bind(this));
    // PUT
    router.put('/collection/:collection', this.updateCollection.bind(this));
  }
  // </editor-fold>

  // <editor-fold desc='DELETE route callback'>
  private async deleteCollection(request: RoutedRequest): Promise<DtoUntypedDataResponse> {
    const repository = this.databaseService.getCollectionRepository();

    try {
      const collection = await repository.findOneOrFail(request.params.collection);
      try {
        await repository.delete(request.params.collection);
        this.fileService.emptyAndDeleteDir(`${this.configurationService.environment.thumbBaseDirectory}/${collection.id}`);
        const result: DtoUntypedDataResponse = {
          status: DataStatus.Ok
        };
        return result;
      }
      catch (error) {
        this.logService.error(LogSource.Main, error);
        const result_1: DtoUntypedDataResponse = {
          status: DataStatus.Error,
          message: `${error.name}: ${error.message}`
        };
        return result_1;
      }
    }
    catch (error_1) {
      this.logService.error(LogSource.Main, error_1);
      const result_2: DtoUntypedDataResponse = {
        status: DataStatus.NotFound,
        message: `${error_1.name}: ${error_1.message}`
      };
      return result_2;
    }
  }
  // </editor-fold>

  // <editor-fold desc='GET routes callbacks'>
  private async getCollections(request: RoutedRequest): Promise<DtoListDataResponse<DtoListCollection>> {
    const paginationTake = request.queryParams.pageSize || 20;
    const paginationSkip = ((request.queryParams.page || 1) - 1) * paginationTake;

    const collectionQry = this.databaseService
      .getCollectionRepository()
      .createQueryBuilder('collection')
      .select('id')
      .addSelect('name')
      .addSelect('path')
      .leftJoin( (cntQry) => {
        return cntQry
          .select('collectionId')
          .addSelect("id as thumbId")
          .addSelect("path as thumbPath")
          .addSelect("name as thumbName")
          .addSelect("COUNT(*) AS count")
          .from('picture', null)
          .orderBy("path", "DESC")
          .addOrderBy("thumbName", "DESC")
          .groupBy("picture.collectionId")
        },
        'cnt',
        'cnt.collectionId = collection.Id',
      )
      .addSelect('cnt.count')
      .addSelect('cnt.thumbId')
      .addSelect('cnt.thumbPath')
      .addSelect('cnt.thumbName')
      .offset(paginationSkip)
      .limit(paginationTake)
      .orderBy('collection.name');
    this.logService.debug(LogSource.Main, collectionQry.getQuery());

    const count = await this.databaseService
      .getCollectionRepository()
      .count();
    try {
      const collections = await collectionQry.getRawMany();
      const dtoCollections: Array<DtoListCollection> = collections.map(collection => {
        let thumbnailPath: string = undefined;
        if (collection.thumbName) {
          const collectionThumbnailPath = `${this.configurationService.environment.thumbBaseDirectory}/${collection.id}`;
          const thumbnailExtension = collection.thumbName.split('.').pop();
          thumbnailPath = `${collectionThumbnailPath}/${collection.thumbId}.${thumbnailExtension}`;
          if (!this.fileService.fileOrDirectoryExistsSync(thumbnailPath)) {
            thumbnailPath = `${collection.path}/${collection.thumbPath}/${collection.thumbName}`;
          }
        }
        const result: DtoListCollection = {
          id: collection.id,
          name: collection.name,
          path: collection.path,
          pictures: collection.count || 0,
          thumbPath: thumbnailPath
        };
        return result;
      });
      const result_1: DtoListDataResponse<DtoListCollection> = {
        status: DataStatus.Ok,
        data: {
          listData: dtoCollections,
          count: count
        }
      };
      return result_1;
    }
    catch (error) {
      this.logService.error(LogSource.Main, error);
      const result_2: DtoListDataResponse<DtoListCollection> = {
        status: DataStatus.Error,
        message: `${error.name}: ${error.message}`
      };
      return result_2;
    }
  }

  private async getCollection(request: RoutedRequest): Promise<DtoDataResponse<DtoGetCollection>> {
    try {
      const collection = await this.databaseService
        .getCollectionRepository()
        .findOneOrFail(request.params.collection);
      const dtoCollection: DtoGetCollection = {
        id: collection.id,
        created: collection.created,
        modified: collection.modified,
        version: collection.version,
        name: collection.name,
        path: collection.path
      };
      const result: DtoDataResponse<DtoGetCollection> = {
        status: DataStatus.Ok,
        data: dtoCollection
      };
      return result;
    }
    catch (error) {
      const result_1: DtoDataResponse<DtoGetCollection> = {
        status: DataStatus.Conflict,
        message: `${error.name}: ${error.message}`
      };
      return result_1;
    }
  }

  private async getPictures(request: RoutedRequest): Promise<DtoListDataResponse<DtoListPicture>> {
    const paginationTake = request.queryParams.pageSize || 20;
    const paginationSkip = ((request.queryParams.page || 1) - 1) * paginationTake;
    const picturePath = request.queryParams.path;
    try {
      const collection = await this.databaseService
        .getCollectionRepository()
        .findOneOrFail(request.params.collection);
      const dtoListPictureCollection: DtoListPictureCollection = {
        id: collection.id,
        name: collection.name,
        path: collection.path
      };
      const where: any = { collection: collection };
      if (picturePath ) {
        where.path = Like(`${picturePath}%`)
      }
      const qryResult = await this.databaseService.getPictureRepository()
        .findAndCount({
          where,
          skip: paginationSkip,
          take: paginationTake
        });
      const collectionThumbnailPath = `${this.configurationService.environment.thumbBaseDirectory}/${collection.id}`;
      const dtoListPictures = qryResult[0].map(picture => {
        const thumbnailExtension = picture.name.split('.').pop();
        let thumbnailPath = `${collectionThumbnailPath}/${picture.id}.${thumbnailExtension}`;
        if (!this.fileService.fileOrDirectoryExistsSync(thumbnailPath)) {
          thumbnailPath = `${collection.path}/${picture.path}/${picture.name}`;
        }
        const dtoListPicture: DtoListPicture = {
          id: picture.id,
          name: picture.name,
          path: picture.path,
          thumbPath: thumbnailPath,
          collection: dtoListPictureCollection
        };
        return dtoListPicture;
      });
      const result: DtoListDataResponse<DtoListPicture> = {
        status: DataStatus.Ok,
        data: {
          listData: dtoListPictures,
          count: qryResult[1]
        }
      };
      return result;
    }
    catch (error) {
      this.logService.error(LogSource.Main, 'found no collection');
      const result_1: DtoListDataResponse<DtoListPicture> = {
        status: DataStatus.NotFound
      };
      return result_1;
    }
  }

  private async getTree(request: RoutedRequest): Promise<DtoDataResponse<Array<DtoTreeBase>>> {
    const collection = await this.databaseService
      .getCollectionRepository()
      .findOneOrFail(request.params.collection);

    const qryBuilder = this.databaseService
      .getPictureRepository()
      .createQueryBuilder('picture')
      .select('DISTINCT picture.path', 'path')
      .where("picture.collectionId = :id", { id: Number.parseInt(request.params.collection) });
    this.logService.debug(LogSource.Main, qryBuilder.getQueryAndParameters());
    const segmentedPaths = await qryBuilder
      .getRawMany()
      .then(results => results
        .map(path => path.path)
        .sort((path1: string, path2: string) => {
          const lc1 = path1.toLowerCase();
          const lc2 = path2.toLowerCase();
          if (lc1 < lc2) {
            return -1;
          } else if ( lc1 > lc2 ) {
            return 1;
          } else {
            return 0;
          }
        })
        .map(path => path.split('/'))
      );

    const tree = new Array<DtoTreeBase>();
    const root: DtoTreeBase = {
      label: collection.path,
      queryString: undefined,
      children: new Array<DtoTreeBase>()
    };
    tree.push(root);
    this.appendChildren(1, root, segmentedPaths);
    const result: DtoDataResponse<Array<DtoTreeBase>> =
    {
      data: tree,
      status: DataStatus.Ok
    };
    return result;
  }
  // </editor-fold>

  // <editor-fold desc='POST route callbacks'>
  private async createCollection(request: RoutedRequest): Promise<DtoDataResponse<DtoListCollection>> {
    const repository = this.databaseService
      .getCollectionRepository();

    if (!this.fileService.fileOrDirectoryExistsSync(request.data.path)) {
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

    try {
      const collection = await repository.save(newCollection);
      this.scanDirectory(collection);
      const listItem: DtoListCollection = {
        id: collection.id,
        name: collection.name,
        path: collection.path,
        pictures: 0,
        thumbPath: undefined,
      };
      const result_1: DtoDataResponse<DtoListCollection> = {
        status: DataStatus.Ok,
        data: listItem
      };
      return result_1;
    }
    catch (error) {
      const result_2: DtoDataResponse<DtoListCollection> = {
        status: DataStatus.Conflict,
        message: `${error.name}: ${error.message}`
      };
      return result_2;
    }
  }

  private async scanCollection(request: RoutedRequest): Promise<DtoUntypedDataResponse> {
    try {
      const collection = await this.databaseService.getCollectionRepository()
        .findOneOrFail(request.params.collection);
      this.scanDirectory(collection);
      const result: DtoUntypedDataResponse = {
        status: DataStatus.Accepted
      };
      return result;
    }
    catch (error) {
      const result_1: DtoUntypedDataResponse = {
        status: DataStatus.Error,
        message: `${error.name}: ${error.message}`
      };
      return result_1;
    }
  }
  // </editor-fold>

  // <editor-fold desc='PUT route callback'>
  private async updateCollection(request: RoutedRequest): Promise<DtoDataResponse<DtoListCollection>> {
    const repository = this.databaseService.getCollectionRepository();
    try {
      const collection = await repository.findOneOrFail(request.params.collection);
      collection.name = request.data.name;
      try {
        const savedCollection = await repository.save(collection);
        const dtoListCollection: DtoListCollection = {
          id: savedCollection.id,
          name: savedCollection.name,
          path: savedCollection.path,
          pictures: 0,
          thumbPath: undefined
        };
        const result: DtoDataResponse<DtoListCollection> = {
          status: DataStatus.Ok,
          data: dtoListCollection,
        };
        return result;
      }
      catch (e) {
        const result_1: DtoDataResponse<DtoListCollection> = {
          status: DataStatus.Conflict,
          data: undefined
        };
        return result_1;
      }
    }
    catch (e) {
      const result_2: DtoDataResponse<DtoListCollection> = {
        status: DataStatus.Conflict,
        data: undefined
      };
      return result_2;
    }
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
          this.logService.info(LogSource.Main, `found ${total} files`);
          // TODO send a status to the renderer with the number of files found
          let promises = new Array<Promise<Picture>>();
          files.forEach( (file, index) => {
            // save each file in a separate transaction
            promises.push(this.pictureService.upsertPicture(collection, file));
            if (((index + 1) % 10 === 0) || (index === total - 1)) {
              Promise
                .all(promises)
                .then( pictures => {
                  done += pictures.length;
                  // TODO send current status to renderer
                  this.logService.info(LogSource.Main, `processed ${done}/${total}pictures`);
                  // TODO if (done === total) send finished to renderer
                });
              promises = new Array<Promise<Picture>>();
            }
          });
        },
        error => {
          this.logService.error(LogSource.Main, error);
        }
      );
  }

  private appendChildren(level: number, parent: DtoTreeBase, paths: Array<Array<string>>): void {
    const directChildren = paths.filter(path => path.length === level);
    directChildren.forEach(child => {
      const childItem: DtoTreeBase = {
        label: child[level - 1],
        queryString: `path=${child.join('/')}`,
        children: new Array<DtoTreeBase>()
      };
      parent.children.push(childItem);
      const grandChildren = paths.filter(path => path[level - 1] === child[level - 1] && path.length > level);
      if (grandChildren.length > 0){
        this.appendChildren(level + 1, childItem, grandChildren);
      }
    });
  }
  // </editor-fold>
}
