import { DtoBase } from '../dto-base';
import { DtoCollection } from './dto-collection';
import { DtoExif } from './dto-exif';

export interface DtoPicture extends DtoBase {
  fileName: string;
  path: string;
  collection: DtoCollection;
  exifs: Array<DtoExif>;
}
