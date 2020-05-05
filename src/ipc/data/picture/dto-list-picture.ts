import { DtoListBase } from '../response/dto-list-base';
import { DtoListPictureCollection } from './dto-list-picture-collection';

export interface DtoListPicture extends DtoListBase {
  path: string;
  collection: DtoListPictureCollection
}
