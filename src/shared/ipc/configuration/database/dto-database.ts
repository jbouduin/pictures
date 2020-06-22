import { DtoConnection } from './dto-connection';
import { DtoTarget } from './dto-target';

export interface DtoDatabase {
  connections: Array<DtoConnection>;
  targets: Array<DtoTarget>;
}
