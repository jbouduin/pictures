import { DtoGetBase } from '../response/dto-get-base';
import { DtoGetPictureCollection } from './dto-get-picture-collection';

export interface DtoGetPicture extends DtoGetBase {
  path: string;
  collection: DtoGetPictureCollection;
}
