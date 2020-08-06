import im from  'imagemagick';
import { promisify } from 'util';
import { DtoRequestReadMetaData, DtoTaskResponse, TaskType, DtoResponseReadMetadata } from '@ipc';

export class MetadataReader {
  private read = promisify(im.readMetadata);

  public async readMetaData(applicationSecret: string, params: DtoRequestReadMetaData): Promise<DtoTaskResponse<DtoResponseReadMetadata>> {
    const source = `${params.collectionPath}/${params.picturePath}/${params.fileName}`;
    return await this
      .read(source)
      .then(metaData => {
        const responseData: DtoResponseReadMetadata = {
          id: params.id,
          metadata: metaData
        }
        const response: DtoTaskResponse<DtoResponseReadMetadata> = {
          taskType: TaskType.ReadMetaData,
          success: true,
          error: undefined,
          applicationSecret,
          data: responseData
        };
        return response;
      })
      .catch( error => {
        const errorResponse: DtoTaskResponse<DtoResponseReadMetadata> = {
          taskType: TaskType.CreateThumb,
          success: false,
          applicationSecret,
          error: [ `Error reading metadata ${source}`, error ],
          data: undefined
        }
        return errorResponse;
      });
  }
}
