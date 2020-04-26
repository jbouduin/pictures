import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { DataStatus, DtoCollection, DtoDataResponse } from '../../../ipc';

import { IDatabaseService } from '../../database';
import { IDataRouterService } from '../data-router.service';

import { IDataService } from '../data-service';
import { RoutedRequest } from '../routed-request';

import SERVICETYPES from '../../di/service.types';

export interface ICollectionService extends IDataService<boolean> {

}

@injectable()
export class CollectionService implements ICollectionService {

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    @inject(SERVICETYPES.DatabaseService) private databaseService: IDatabaseService) { }
  // </editor-fold>

  // <editor-fold desc='IService interface methods'>
  public initialize(): Promise<boolean> {
    console.log('in initialize CollectionService');
    return Promise.resolve(true);
  }
  // </editor-fold>

  // <editor-fold desc='IDataService interface methods'>
  public setRoutes(router: IDataRouterService): void {
    router.get('/collection', this.notImplemented);
    router.get('/collection/:collection', this.notImplemented);
    router.get('/collection/:collection/pictures', this.notImplemented);
  }

  // </editor-fold>

  // <editor-fold desc='Private methods'>
  private notImplemented(request: RoutedRequest): Promise<DtoDataResponse<any>> {
    console.log(request);
    const result: DtoDataResponse<string> = {
      status: DataStatus.Error,
      data: 'Not implemented'
    };
    return Promise.resolve(result);
  }
  // </editor-fold>
}
