import { IService } from '../di';
import { IDataRouterService } from './data-router.service';

export interface IDataService<T> extends IService<T> {
  setRoutes(router: IDataRouterService): void;
}
