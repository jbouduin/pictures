import { DtoTaskCreateThumb } from '@ipc';
import Jimp from 'jimp/es';

export class ThumbCreator {

  public static createThumb(params: DtoTaskCreateThumb): void {
    Jimp.read(params.source)
      .then( image => {
        image.scaleToFit(240, 240) // resize
          .quality(80) // set JPEG quality
          .write(params.target);
      })
      .catch(err => {
        console.error(`Error creating thumbnail for ${params.source}:`);
        console.error(`${err.name}: ${err.message}`);
      });
  }

}
