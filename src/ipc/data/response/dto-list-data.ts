import { DtoListBase } from './dto-list-base';

export interface DtoListData<T extends DtoListBase> {
  listData: Array<T>;
  count: number;
}
