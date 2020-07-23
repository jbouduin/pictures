import { inject, injectable } from 'inversify';

import { DtoTaskRequest, DtoRequestCreateThumb, LogSource, TaskType, DtoRequestReadMetaData } from '@ipc';
import { IConfigurationService } from '../data/configuration';
import { Collection, Picture } from '../database';

import { IFileService } from './file.service';
import { ILogService } from './log.service';
import { IQueueService } from './queue.service';

import SERVICETYPES from '../di/service.types';

export interface IXImageService {
  checkThumbnail(collection: Collection, picture: Picture): Promise<Picture>;
}

@injectable()
export class XImageService implements IXImageService {

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    @inject(SERVICETYPES.LogService) private logService: ILogService,
    @inject(SERVICETYPES.ConfigurationService) private configurationService: IConfigurationService,
    @inject(SERVICETYPES.FileService) private fileService: IFileService,
    @inject(SERVICETYPES.QueueService) private queueService: IQueueService) {
    fileService.ensureExistsSync(configurationService.environment.thumbBaseDirectory);
  }
  // </editor-fold>

  // <editor-fold desc='IImageService interface methods'>
  public checkThumbnail(collection: Collection, picture: Picture): Promise<Picture> {
    const collectionThumbnailPath = `${this.configurationService.environment.thumbBaseDirectory}/${collection.id}`;
    this.fileService.ensureExistsSync(collectionThumbnailPath);
    const picturePath = `${collection.path}/${picture.path}/${picture.name}`;
    const pictureExtension = picturePath.split('/').pop().split('.').pop();
    const thumbnailPath = `${collectionThumbnailPath}/${picture.id}.${pictureExtension}`;
    if (this.fileService.fileOrDirectoryExistsSync(thumbnailPath)) {
      this.logService.verbose(LogSource.Main, `thumb alread exists for ${picturePath}`);
    } else {
      const request: DtoTaskRequest<DtoRequestCreateThumb> = {
        taskType: TaskType.CreateThumb,
        data: {
          id: picture.id,
          source: picturePath
        }
      };
      this.queueService.push(request);
    }
    // const metaDataRequest: DtoTaskRequest<DtoTaskReadMetaData> = {
    //   taskType: TaskType.ReadMetaData,
    //   data: {
    //     source: picturePath,
    //     pictureId: picture.id
    //   }
    // };
    // this.queueService.push(metaDataRequest);

    return Promise.resolve(picture);
  }

  // </editor-fold>
}
