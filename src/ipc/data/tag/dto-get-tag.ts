import { DtoGetBase } from '../response/dto-get-base';

export interface DtoGetTag extends DtoGetBase {
  canAssign: boolean;
}
