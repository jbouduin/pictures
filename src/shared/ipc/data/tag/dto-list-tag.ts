import { DtoListBase } from '../response/dto-list-base';

export interface DtoListTag extends DtoListBase {
  canAssign: boolean;
  pictures: number;
}
