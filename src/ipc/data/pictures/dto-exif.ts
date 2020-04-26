import {DtoBase } from '../dto-base';
import { DtoPicture } from './dto-picture';

export interface DtoExif extends DtoBase {
  picture: DtoPicture;
  key: string;
  value: string;
}
