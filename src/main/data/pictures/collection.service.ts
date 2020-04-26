import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { DtoCollection, DtoPicture } from '../../../ipc';

import { IDatabaseService } from '../../database';
import { IService } from '../../di/service';

import SERVICETYPES from '../../di/service.types';

export interface ICollectionService extends IService<boolean> {

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

}
