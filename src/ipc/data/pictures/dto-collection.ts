import {DtoBase } from '../dto-base';
import { DtoPicture } from './dto-picture';

export interface DtoCollection extends DtoBase {
  name: string;
  //description: string;
  path: string;
  pictures: number;
}
