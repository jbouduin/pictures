import { DtoGetBase } from '../response/dto-get-base';

export interface DtoGetCollection extends DtoGetBase {
  path: string;
  secret: boolean;
}
