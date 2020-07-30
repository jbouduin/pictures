import { DtoListBase } from '../response/dto-list-base';

export interface DtoListCollection extends DtoListBase {
  path: string;
  secret: boolean;
  pictures: number;
}
