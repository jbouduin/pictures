import { inject, injectable } from 'inversify';
import * as path from 'path';
import 'reflect-metadata';

import { DtoConfiguration } from '../../ipc';

import { IService } from '../di/service';
import { Configuration } from './configuration';

export interface IConfigurationService extends IService<Configuration> {
  configuration: DtoConfiguration
}

@injectable()
export class ConfigurationService implements IConfigurationService {

  // <editor-fold desc='Private properties'>
  private _configuration: Configuration;
  // </editor-fold>

  // <editor-fold desc='IConfigurationService Interface properties'>
  public get configuration(): DtoConfiguration {
    return this._configuration;
  }
  // </editor-fold>

  // <editor-fold desc='IConfigurationService Interface methods'>
  public initialize(): Promise<Configuration> {
    console.log('in initialize ConfigurationService');
    return Configuration.loadConfiguration().then( configuration => this._configuration = configuration);
  }
  // </editor-fold>
}
