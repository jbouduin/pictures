import {DtoBase } from '../dto-base';

export interface DtoExif extends DtoBase {
  key: string;
  value: string;
}
