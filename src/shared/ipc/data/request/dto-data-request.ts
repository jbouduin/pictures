import { DataVerb } from './data-verb';

export interface DtoDataRequest<T> {
  id: number;
  verb: DataVerb,
  path: string,
  secretKey: string | undefined
  data?: T
}
