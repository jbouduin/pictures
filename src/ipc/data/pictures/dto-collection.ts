import { ScanStatus } from '../../system';
import { DtoBase } from '../dto-base';

// TODO rename to DtoGetCollection
export interface DtoCollection extends DtoBase {
  name: string;
  path: string;
}

export interface DtoListCollection {
  id: number;
  name: string;
  path: string;
  pictures: number;
  scanStatus: ScanStatus;
  thumb: string;
}

// TODO add DtoSetCollection with only name
export interface DtoNewCollection {
  name: string;
  path: string;
}
