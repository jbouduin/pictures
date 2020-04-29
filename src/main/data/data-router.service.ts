import * as events from 'events';
import { inject, injectable } from 'inversify';
import * as _ from 'lodash';
import { match, MatchResult } from 'path-to-regexp';
import * as Collections from 'typescript-collections';
import * as util from 'util';
import 'reflect-metadata';

import { DataStatus, DataVerb, DtoDataRequest, DtoDataResponse } from '@ipc';

import { IService } from '../di/service';

import { IConfigurationService } from './configuration';
import { ICollectionService } from './pictures/collection.service';
import { RoutedRequest } from './routed-request';

import SERVICETYPES from '../di/service.types';

export interface IDataRouterService extends IService<boolean> {
  // delete(path: string, callback: (RoutedRequest, Promise<DtoDataResponse<any>>) => void);
  get(path: string, callback: (request: RoutedRequest) => Promise<DtoDataResponse<any>>);
  // patch(path: string, callback: (RoutedRequest, Promise<DtoDataResponse<any>>) => void);
  post(path: string, callback: (request: RoutedRequest) => Promise<DtoDataResponse<any>>);
  put(path: string, callback: (request: RoutedRequest) => Promise<DtoDataResponse<any>>);
  routeRequest(request: DtoDataRequest<any>): Promise<DtoDataResponse<any>>;
}

type RouteCallback = (request: RoutedRequest) => Promise<DtoDataResponse<any>>;

@injectable()
export class DataRouterService implements IDataRouterService {

  // <editor-fold desc='Private properties'>
  private getRoutes: Collections.Dictionary<string, RouteCallback>;
  private postRoutes: Collections.Dictionary<string, RouteCallback>;
  private putRoutes: Collections.Dictionary<string, RouteCallback>;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    @inject(SERVICETYPES.ConfigurationService) private configurationService: IConfigurationService,
    @inject(SERVICETYPES.CollectionService) private collectionService: ICollectionService) {
    this.getRoutes = new Collections.Dictionary<string, RouteCallback>();
    this.postRoutes = new Collections.Dictionary<string, RouteCallback>();
    this.putRoutes = new Collections.Dictionary<string, RouteCallback>();
  }
  // </editor-fold>

  // <editor-fold desc='IService interface methods'>
  public initialize(): Promise<boolean> {
    console.log('in initialize DataRouterService');
    this.configurationService.setRoutes(this);
    this.collectionService.setRoutes(this);
    console.log('registered GET routes:');
    this.getRoutes.keys().forEach(route => console.log(route));
    console.log('registered POST routes:');
    this.postRoutes.keys().forEach(route => console.log(route));
    console.log('registered PUT routes:');
    this.putRoutes.keys().forEach(route => console.log(route));
    return Promise.resolve(true);
  }
  // </editor-fold>

  // <editor-fold desc='IDataRouterService interface methods'>
  public get(path: string, callback: RouteCallback) {
    this.getRoutes.setValue(path, callback);
  }

  public post(path: string, callback: RouteCallback) {
    this.postRoutes.setValue(path, callback);
  }

  public put(path: string, callback: RouteCallback) {
    this.putRoutes.setValue(path, callback);
  }

  public routeRequest(request: DtoDataRequest<any>): Promise<DtoDataResponse<any>> {
    let result: Promise<DtoDataResponse<any>>;
    console.log(`routing ${DataVerb[request.verb]} ${request.path}`);
    let routeDictionary: Collections.Dictionary<string, RouteCallback>;
    switch(request.verb) {
      case (DataVerb.GET): {
        routeDictionary = this.getRoutes;
        break;
      }
      case (DataVerb.POST): {
        routeDictionary = this.postRoutes;
        break;
      }
      case (DataVerb.PUT): {
        routeDictionary = this.putRoutes;
        break;
      }
    }
    if (!routeDictionary) {
      console.log('not allowed');
      const response: DtoDataResponse<string> = {
        status: DataStatus.NotAllowed,
        data: undefined
      };
      result = Promise.resolve(response);
    }
    else {
      result = this.route(request, routeDictionary)
    }
    return result;
  }
  // </editor-fold>

  // <editor-fold desc='Private methods'>
  private route(
    request: DtoDataRequest<any>,
    routeDictionary: Collections.Dictionary<string, RouteCallback>): Promise<DtoDataResponse<any>> {
    let result: Promise<DtoDataResponse<any>>;

    const matchedKey = routeDictionary.keys().find(key => {
      const matcher = match(key);
      const matchResult = matcher(request.path);
      return matchResult !== false;
    });
    if (matchedKey)
    {
      const matcher2 = match(matchedKey);
      const matchResult2: any = matcher2(request.path);

      if (_.isObject(matchResult2)) {
        console.log(`Route found: ${matchedKey}`);
        const routedRequest = new RoutedRequest();
        routedRequest.route = matchedKey
        routedRequest.path = matchResult2.path;
        routedRequest.params = matchResult2.params;
        routedRequest.data = request.data;
        const route = routeDictionary.getValue(matchedKey);
        if (route) {
          console.log(routedRequest);
          result = route(routedRequest);
        }
      } else {
        console.log('strange error!');
        const response: DtoDataResponse<string> = {
          status: DataStatus.Error,
          data: 'Error in router'
        };
        result = Promise.resolve(response);
      }
    } else {
      console.log('Route not found');
      const response: DtoDataResponse<string> = {
        status: DataStatus.NotFound,
        data: ''
      };
      result = Promise.resolve(response);
    }
    return result;
  }

  // </editor-fold>
}
