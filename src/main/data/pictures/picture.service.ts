import { AES, enc } from 'crypto-ts';
import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import * as path from 'path';

import { DtoTaskRequest, TaskType, DtoRequestCreateThumb, DtoRequestReadMetaData, DtoResponseReadMetadata, DtoDataResponse, DtoImage, DataStatus, DtoGetPicture, DtoGetPictureCollection, DtoRequestEncryptFile } from '@ipc';
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
  upsertPicture(collection: Collection, relativePath: string, key: string): Promise<Picture>;
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
    router.get('/picture/:id/raw', this.getRawImage.bind(this));
    router.get('/picture/:id', this.getPicture.bind(this));
    router.put('/picture/:id/metadata', this.storeMetaData.bind(this));
  }
  // </editor-fold>

  // <editor-fold desc='IPictureService interface methods'>
  public async upsertPicture(collection: Collection, relativePath: string, applicationSecret: string): Promise<Picture> {
    const splitted = relativePath.split('/');
    const name = splitted.pop();
    const path = splitted.join('/');
    const pictureRepository = this.databaseService.getPictureRepository();
    let picture = await pictureRepository.findOne({
      where: {
        path: path,
        name: name,
        collection: collection
      }
    });

    if (picture) {
      this.logService.debug(LogSource.Main, `picture '${path}/${name}' already in '${collection.name}'`);
    } else {
      this.logService.debug(LogSource.Main, `adding '${path}/${name}' to '${collection.name}'`);
      const newPicture = pictureRepository.create({
        name: name,
        path: path,
        collection: collection
      });

      picture = await pictureRepository.save(newPicture);
    }

    const picturePath = `${collection.path}/${picture.path}/${picture.name}`;
    if (!picture.thumb) {
      const createThumbRequestData: DtoRequestCreateThumb = {
        id: picture.id,
        source: picturePath,
        secret: collection.isSecret
      };
     const thumbRequest: DtoTaskRequest<DtoRequestCreateThumb> = {
        taskType: TaskType.CreateThumb,
        applicationSecret,
        data: createThumbRequestData
      };
      this.queueService.push(thumbRequest);
    }
    const readMetaDataRequestData: DtoRequestReadMetaData = {
      id: picture.id,
      source: picturePath,
      secret: undefined
    };
    const metaDataRequest : DtoTaskRequest<DtoRequestReadMetaData> =  {
      taskType: TaskType.ReadMetaData,
      applicationSecret,
      data: readMetaDataRequestData
    };
    this.queueService.push(metaDataRequest);

    if (collection.isSecret) {
      const secretThumb = await this.databaseService
        .getSecretThumbRepository()
        .findOne({ where: { pictureId: picture.id} });

      if (!secretThumb) {
        const createSecretThumbRequestData: DtoRequestCreateThumb = {
          id: picture.id,
          source: picturePath,
          secret: undefined
        }
        const secretThumbDataRequest : DtoTaskRequest<DtoRequestCreateThumb> = {
          taskType: TaskType.CreateSecretThumb,
          applicationSecret,
          data: createSecretThumbRequestData
        };
        this.queueService.push(secretThumbDataRequest);
      }
      const encryptFileRequestData: DtoRequestEncryptFile = {
        id: picture.id,
        source: picturePath,
        secret: collection.decryptedKey || this.decryptData(collection.encryptedKey, applicationSecret)
      };
      const encryptFileRequest: DtoTaskRequest<DtoRequestEncryptFile> = {
        taskType: TaskType.EncryptFile,
        applicationSecret,
        data: encryptFileRequestData
      };
      this.queueService.push(encryptFileRequest);
    }
    return picture;
  }
  // </editor-fold>

  // <editor-fold desc='GET methods'>
  private async getPicture(request: RoutedRequest<undefined>): Promise<DtoDataResponse<DtoGetPicture>> {
    try {
      const picture = await this.databaseService
        .getPictureRepository()
        .findOneOrFail(request.params.id, { relations: [ 'collection' ] });
      const dtoCollection: DtoGetPictureCollection = {
        id: picture.collection.id,
        name: picture.collection.name,
        path: picture.collection.path
      };
      const metadata = await this.databaseService
        .getMetaDataPictureMapRepository()
        .find({
          where: { picture: picture},
          relations: [ 'metadataKey']
        });

      const dtoPicture: DtoGetPicture = {
        id: picture.id,
        created: picture.created,
        modified: picture.modified,
        version: picture.version,
        name: picture.name,
        path: picture.path,
        collection: dtoCollection,
        metadata: metadata.map(md => { return { key: md.metadataKey.name, value: md.value}; })
      };
      const result: DtoDataResponse<DtoGetPicture> = {
        status: DataStatus.Ok,
        data: dtoPicture
      };
      return result;
    }
    catch (error) {
      const errorResult: DtoDataResponse<DtoGetPicture> = {
        status: DataStatus.Conflict,
        message: `${error.name}: ${error.message}`
      };
      return errorResult;
    }
  }

  private async getRawImage(request: RoutedRequest<undefined>): Promise<DtoDataResponse<DtoImage>> {

    const picture = await this.databaseService
      .getPictureRepository()
      .findOne(request.params.id, { relations: [ 'collection' ]});

    const filePath = path.join(picture.collection.path, picture.path, picture.name);
    const encryptedFile = `${filePath}.enc`;
    let image: string;
    if (fs.existsSync(encryptedFile)) {
      const fileContents = await fs.promises.readFile(encryptedFile, 'utf8'); // this.readFileToBase64(encryptedFile);
      const secret = this.decryptData(picture.collection.encryptedKey, request.applicationSecret);
      const encrypted = AES.decrypt(fileContents, secret);
      image = encrypted.toString(enc.Utf8);
    } else {
      image = await this.readFileToBase64(filePath);
    }
    const response: DtoDataResponse<DtoImage> = {
      status: DataStatus.Ok,
      data: { image: image }
    };

    return response;
  }
  // </editor-fold>

  // <editor-fold desc='PUT methods'>
  private async storeMetaData (routedRequest: RoutedRequest<DtoResponseReadMetadata>): Promise<void> {
    const metaDataKeyRepository = this.databaseService.getMetaDataKeyRepository();
    const metaDataPictureMapRepository = this.databaseService.getMetaDataPictureMapRepository();
    if (routedRequest.data.metadata.exif) {
      const toSave = new Array<MetadataPictureMap>();
      const picture = await this.databaseService.getPictureRepository().findOneOrFail(routedRequest.params.id);
      this.logService.verbose(LogSource.Main, `storing metadata for ${routedRequest.params.id}`);
      for (let key of Object.keys(routedRequest.data.metadata.exif)) {
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
            this.logService.debug(LogSource.Main, `updating existing value: ${routedRequest.data.metadata.exif[key]}`);
            metadataPictureMap.value = routedRequest.data.metadata.exif[key];
          } else {
            this.logService.debug(LogSource.Main, `creating new value: ${routedRequest.data.metadata.exif[key]}`);
            metadataPictureMap = metaDataPictureMapRepository.create({
              picture: picture,
              metadataKey: metaDataKey,
              value: routedRequest.data.metadata.exif[key]
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
