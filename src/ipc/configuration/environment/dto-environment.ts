import { DtoDatabase } from '../database/dto-database';

export interface DtoEnvironment {
  thumbBaseDirectory: string;
  database: DtoDatabase;
}
