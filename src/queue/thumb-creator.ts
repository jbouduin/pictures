import { DtoRequestCreateThumb, DtoResponseCreateThumb, DtoRequestReadMetaData } from '@ipc';
import { DtoTaskResponse, TaskType } from '@ipc';
import im from  'imagemagick';
import { promisify } from 'util';

export class ThumbCreator {

  private resize = promisify(im.resize);
  private read = promisify(im.readMetadata);
  public async readMetaData(params: DtoRequestReadMetaData): Promise<boolean> {
    await this.read(params.source).then(
      result => console.error('metadata', params.source, result)
    )
    return Promise.resolve(true);
  }

  public async createThumbIm(params: DtoRequestCreateThumb): Promise<DtoTaskResponse<DtoResponseCreateThumb>> {

    const response = await this.resize({
      srcPath: params.source,
      quality: 0.8,
      format: 'jpg',
      progressive: true,
      width: 240,
      height: 240
    })
    .then( resized => {

      console.log(resized.constructor);
      const responseData: DtoResponseCreateThumb = {
        id: params.id,
        thumb: Buffer.from(resized, 'binary').toString('base64')
      }
      const response: DtoTaskResponse<DtoResponseCreateThumb> = {
        taskType: TaskType.CreateThumb,
        success: true,
        error: undefined,
        data: responseData
      }
      return response;
    })
    .catch( error => {
        const errorResponse: DtoTaskResponse<DtoResponseCreateThumb> = {
          taskType: TaskType.CreateThumb,
          success: false,
          error: [ `Error resizing ${params.source}`, error ],
          data: undefined
        }
        return errorResponse;
      }
    );
    return response;
  }
}
