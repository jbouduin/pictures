import { inject, injectable } from 'inversify';

import { DtoTaskRequest, DtoTaskCreateThumb, LogSource, TaskType, DtoTaskReadMetaData } from '@ipc';
import { IConfigurationService } from '../data/configuration';
import { Collection, Picture } from '../database';

import { IFileService } from './file.service';
import { ILogService } from './log.service';
import { IQueueService } from './queue.service';
import im from  'imagemagick';
import * as fs from 'fs';

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
      this.logService.verbose(LogSource.Main, `thumb alread exists for ${picturePath}`);
    } else {
      const request: DtoTaskRequest<DtoTaskCreateThumb> = {
        taskType: TaskType.CreateThumb,
        data: {
          source: picturePath,
          target: thumbnailPath
        }
      };
      // this.createThumbIm(request.data);
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

  private num = 0;
  // </editor-fold>
  public createThumbIm(params: DtoTaskCreateThumb): void {
    try {
      console.error(++this.num, params.source);
      const data = fs.readFileSync(params.source, 'binary');
      console.error(this.num, 'passed read');
      im.resize(
        {
           srcData: data,
           width: 240,
           height: 240
        },
        (error: Error, result: any) => {
           console.log(this.num, 'resized');
          if (error) {
            console.error(`Error resizing ${params.source}:`);
            console.error(`${error.name}: ${error.message}`, error);
          } else {
            // console.log(result);
            fs.writeFileSync(params.target, result, 'binary');
          }
        }
      );
    }  catch (err) {
        console.error(`Error creating thumbnail for ${params.source}:`);
        console.error(`${err.name}: ${err.message}`);
    }
    // im.resize(
    //   {
    //     srcPath: '""' + params.source.replace(/\//g, '\\') + '""',
    //     dstPath: '""' + params.target.replace(/\//g, '\\') + '""', width: 240 },

  }
}
