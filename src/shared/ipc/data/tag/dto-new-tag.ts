import { DtoNewBase } from '../request/dto-new-base';

export interface DtoNewTag extends DtoNewBase {
  parent: number;
  canAssign: boolean;
}
