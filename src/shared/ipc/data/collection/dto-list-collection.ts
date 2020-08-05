import { DtoListBase } from '../response/dto-list-base';

export interface DtoListCollection extends DtoListBase {
  path: string;
  isSecret: boolean;
  pictures: number;
}
