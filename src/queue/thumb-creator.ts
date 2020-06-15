import { DtoTaskCreateThumb } from '@ipc';
import im from  'imagemagick';
import { promisify } from 'util';

export class ThumbCreator {

  private resize = promisify(im.resize);

  public async createThumbIm(params: DtoTaskCreateThumb): Promise<boolean> {
    await this.resize({
      srcPath: params.source,
      dstPath: params.target,
      quality: 0.8,
      format: 'jpg',
      progressive: true,
      width: 240,
      height: 240
    }).then(
      result => console.log(result),
      error => {
        console.error(`Error loading ${params.source}:`);
        console.error(`${error.name}: ${error.message}`, error);
      }
    );
    return Promise.resolve(true);
    // try {
    //
    //   // const data = fs.readFileSync(params.source, 'binary');
    //   // console.error('passed read',data);
    //   im.resize(
    //     {
    //       srcPath: params.source,
    //       dstPath: params.target,
    //       quality: 0.8,
    //       format: 'jpg',
    //       progressive: true,
    //       width: 240
    //     },
    //     (error: Error, _result: any) => {
    //       if (error) {
    //         console.error(`Error loading ${params.source}:`);
    //         console.error(`${error.name}: ${error.message}`, error);
    //       }
    //     }
    //   );
    // }  catch (err) {
    //     console.error(`Error creating thumbnail for ${params.source}:`);
    //     console.error(`${err.name}: ${err.message}`);
    // }
  }
}
