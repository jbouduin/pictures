import { DtoDataResponse } from './dto-data-response';
import { DtoListBase } from './dto-list-base';
import { DtoListData } from './dto-list-data';

export interface DtoListDataResponse<T extends DtoListBase> extends DtoDataResponse<DtoListData<T>>{ }
