import { DtoRequestCreateThumb, DtoResponseCreateThumb } from '@ipc';
import { DtoTaskResponse, TaskType } from '@ipc';
import im from  'imagemagick';
import { promisify } from 'util';

export class ThumbCreator {

  private resize = promisify(im.resize);

  public async createThumbIm(taskType: TaskType, applicationSecret: string, params: DtoRequestCreateThumb): Promise<DtoTaskResponse<DtoResponseCreateThumb>> {
    return await this.resize({
      srcPath: params.source,
      quality: 0.8,
      format: 'jpg',
      progressive: true,
      width: 240,
      height: 240,
      customArgs: params.secret && taskType === TaskType.CreateThumb ? [ '-blur', '0x8'] : []
    })
    .then( resized => {
      const responseData: DtoResponseCreateThumb = {
        id: params.id,
        thumb: Buffer.from(resized, 'binary').toString('base64')
      }
      const response: DtoTaskResponse<DtoResponseCreateThumb> = {
        taskType: taskType,
        success: true,
        error: undefined,
        applicationSecret,
        data: responseData
      }
      return response;
    })
    .catch( error => {
      const errorResponse: DtoTaskResponse<DtoResponseCreateThumb> = {
        taskType: TaskType.CreateThumb,
        success: false,
        error: [ `Error resizing ${params.source}`, error ],
        applicationSecret,
        data: undefined
      }
      return errorResponse;
    });

  }
}
