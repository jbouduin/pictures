import { inject, injectable } from 'inversify';
import * as path from 'path';
import 'reflect-metadata';

import { DataStatus, DtoConfiguration, DtoEnvironment, DtoDataResponse } from '@ipc';

import { IDataRouterService } from '../data-router.service';
import { IDataService } from '../data-service';
import { RoutedRequest } from '../routed-request';
import { Configuration } from './configuration';

export interface IConfigurationService extends IDataService {
  configuration: DtoConfiguration;
  environment: DtoEnvironment;
  initialize(appPath: string): Promise<Configuration>
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

  public get environment(): DtoEnvironment {
    return this._configuration.current;
  }

  public initialize(appPath: string): Promise<Configuration> {
    console.log('in initialize ConfigurationService');
    return Configuration.loadConfiguration(appPath).then( configuration => this._configuration = configuration);
  }
  // </editor-fold>



  // <editor-fold desc='IDataService Interface methods'>
  public setRoutes(router: IDataRouterService): void {
    // because we are using state of the service, we have to bind the callback
    router.get('/configuration', this.getConfiguration.bind(this));
  }
  // </editor-fold>

  // <editor-fold desc='Private methods'>
  private getConfiguration(request: RoutedRequest): Promise<DtoDataResponse<any>> {
    const result: DtoDataResponse<DtoConfiguration> = {
      status: DataStatus.Ok,
      data: this.configuration
    };
    return Promise.resolve(result);
  }
  // </editor-fold>
}
