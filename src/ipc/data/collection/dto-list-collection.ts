import { DtoListBase } from '../dto-list-base';

export interface DtoListCollection extends DtoListBase {
  path: string;
  pictures: number;
  thumb: string;
}
