import { LogLevel } from '../../system/log-level';
import { DtoDatabase } from '../database/dto-database';

export interface DtoEnvironment {
  mainLogLevel: LogLevel;
  rendererLogLevel: LogLevel;
  queueLogLevel: LogLevel;
  database: DtoDatabase;
}
