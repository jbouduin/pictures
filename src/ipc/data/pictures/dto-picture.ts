import { DtoBase } from '../dto-base';
import { DtoCollection, DtoListCollection } from './dto-collection';
import { DtoExif } from './dto-exif';

export interface DtoGetPicture extends DtoBase {
  name: string;
  path: string;
  collection: DtoCollection;
}

export interface DtoListPicture {
  id: number;
  name: string;
  path: string;
  collection: DtoListCollection
}
