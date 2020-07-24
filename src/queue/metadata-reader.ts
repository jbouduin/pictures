import im from  'imagemagick';
import { promisify } from 'util';
import { DtoRequestReadMetaData, DtoTaskResponse, TaskType, DtoResponseReadMetadata } from '@ipc';

export class MetadataReader {
  private read = promisify(im.readMetadata);

  public async readMetaData(params: DtoRequestReadMetaData): Promise<DtoTaskResponse<DtoResponseReadMetadata>> {

    return await this
      .read(params.source)
      .then(metaData => {
        const responseData: DtoResponseReadMetadata = {
          id: params.id,
          metadata: metaData
        }
        const response: DtoTaskResponse<DtoResponseReadMetadata> = {
          taskType: TaskType.ReadMetaData,
          success: true,
          error: undefined,
          data: responseData
        };
        return response;
      })
      .catch( error => {
        const errorResponse: DtoTaskResponse<DtoResponseReadMetadata> = {
          taskType: TaskType.CreateThumb,
          success: false,
          error: [ `Error reading metadata ${params.source}`, error ],
          data: undefined
        }
        return errorResponse;
      });
  }
}
