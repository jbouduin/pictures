import { DtoBase } from '../dto-base';
import { DtoCollection, DtoListCollection } from './dto-collection';
import { DtoExif } from './dto-exif';

export interface DtoPicture extends DtoBase {
  fileName: string;
  path: string;
  collection: DtoCollection;
}

export interface DtoListPicture {
  id: number;
  fileName: string;
  path: string;
  collection: DtoListCollection
}
