import { inject, injectable } from 'inversify';

import { DtoTaskRequest, DtoTaskCreateThumb, TaskType } from '@ipc';
import { IConfigurationService } from '../data/configuration';
import { Collection, Picture } from '../database';

import { IFileService } from './file.service';
import { ILogService } from './log.service';
import { IQueueService } from './queue.service';

import SERVICETYPES from '../di/service.types';

export interface IImageService {
  checkThumbnail(collection: Collection, picture: Picture): Promise<Picture>;
}

@injectable()
export class ImageService implements IImageService {

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
      this.logService.verbose(`thumb alread exists for ${picturePath}`);
    } else {
      const request: DtoTaskRequest<DtoTaskCreateThumb> = {
        taskType: TaskType.CreateThumb,
        data: {
          source: picturePath,
          target: thumbnailPath
        }
      };
      this.queueService.push(request);
    }
    return Promise.resolve(picture);
  }
  // </editor-fold>
}
