import { ScanStatus } from '../../system';
import { DtoBase } from '../dto-base';

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
}

export interface DtoNewCollection {
  name: string;
  path: string;
}
