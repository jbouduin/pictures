import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { DataStatus, DtoDataRequest, DtoDataResponse } from '../../ipc';

import { IDatabaseService } from '../database';
import { IService } from '../di/service';

import SERVICETYPES from '../di/service.types';

export interface IDataRouterService extends IService<boolean> {
  route(request: DtoDataRequest<any>): Promise<DtoDataResponse<any>>;
}

@injectable()
export class DataRouterService implements IDataRouterService {

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    @inject(SERVICETYPES.DatabaseService) private databaseService: IDatabaseService) { }
  // </editor-fold>

  // <editor-fold desc='IService interface methods'>
  public initialize(): Promise<boolean> {
    console.log('in initialize DataRouterService');
    return Promise.resolve(true);
  }
  // </editor-fold>

  // <editor-fold desc='IDataRouterService interface methods'>
  route(request: DtoDataRequest<any>): Promise<DtoDataResponse<any>> {
    const result: DtoDataResponse<string> = {
      status: DataStatus.Ok,
      data: 'pong'
    }
    return Promise.resolve(result);
  }
  // </editor-fold>
}
