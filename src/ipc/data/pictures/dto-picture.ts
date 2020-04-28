import { DtoBase } from '../dto-base';
import { DtoGetCollection, DtoListCollection } from './dto-collection';
import { DtoExif } from './dto-exif';

export interface DtoGetPicture extends DtoBase {
  fileName: string;
  path: string;
  collection: DtoGetCollection;
}

export interface DtoListPicture {
  id: number;
  fileName: string;
  path: string;
  collection: DtoListCollection
}
