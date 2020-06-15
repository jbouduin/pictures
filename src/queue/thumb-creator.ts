import { DtoTaskCreateThumb, DtoTaskReadMetaData } from '@ipc';
import im from  'imagemagick';
import { promisify } from 'util';

export class ThumbCreator {

  private resize = promisify(im.resize);
  private read = promisify(im.readMetadata);
  public async readMetaData(params: DtoTaskReadMetaData): Promise<boolean> {
    await this.read(params.source).then(
      result => console.error('metadata', params.source, result)
    )
    return Promise.resolve(true);
  }

  public async createThumbIm(params: DtoTaskCreateThumb): Promise<boolean> {
    await this.resize({
      srcPath: params.source,
      dstPath: params.target,
      quality: 0.8,
      format: 'jpg',
      progressive: true,
      width: 240,
      height: 240
    }).catch(
      error => {
        console.error(`Error loading ${params.source}:`);
        console.error(`${error.name}: ${error.message}`, error);
      }
    );
    return Promise.resolve(true);
  }
}
