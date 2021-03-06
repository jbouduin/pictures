import { DtoNewBase } from '../request/dto-new-base';

export interface DtoNewCollection extends DtoNewBase {
  path: string;
  isSecret: boolean;
  deleteFiles: boolean;
  backupPath: string;
}
