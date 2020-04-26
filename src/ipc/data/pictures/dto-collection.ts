import {DtoBase } from '../dto-base';
import { DtoPicture } from './dto-picture';

export interface DtoCollection extends DtoBase {
  name: string;
  path: string;
  pictures: Array<DtoPicture>;
}
