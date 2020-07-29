import { DtoGetBase } from '../response/dto-get-base';
import { DtoGetPictureCollection } from './dto-get-picture-collection';
import { DtoGetMetadata } from './dto-get-metadata';

export interface DtoGetPicture extends DtoGetBase {
  path: string;
  collection: DtoGetPictureCollection;
  metadata: Array<DtoGetMetadata>;
}
