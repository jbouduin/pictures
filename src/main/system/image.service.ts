import { inject, injectable } from 'inversify';
import Jimp from 'jimp/es';

import { IConfigurationService } from '../data/configuration';
import { Collection, Picture } from '../database';

import { IFileService } from './file.service';

import SERVICETYPES from '../di/service.types';

export interface IImageService {
  checkThumbnail(collection: Collection, picture: Picture): Promise<Picture>;
}

@injectable()
export class ImageService implements IImageService {

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    @inject(SERVICETYPES.ConfigurationService) private configurationService: IConfigurationService,
    @inject(SERVICETYPES.FileService) private fileService: IFileService) {
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
      console.log(`thumb alread exists for ${picturePath}`);
    } else {
      console.log(`creating thumb for ${picturePath}`);
      Jimp.read(picturePath)
        .then( image => {

          if (!this.fileService.fileOrDirectoryExistsSync(thumbnailPath)) {
          image.scaleToFit(240, 240) // resize
            .quality(80) // set JPEG quality
            .greyscale() // set greyscale
            .write(thumbnailPath);
          }
        })
        .catch(err => {
          console.error(`Error creating thumbnail for ${picturePath}:`);
          console.error(`${err.name}: ${err.message}`);
        });
    }
    return Promise.resolve(picture);
  }
  // </editor-fold>
}
