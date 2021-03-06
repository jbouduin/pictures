import { inject, injectable } from 'inversify';
import _ from 'lodash';
import { match } from 'path-to-regexp';
import * as Collections from 'typescript-collections';
import 'reflect-metadata';

import { DataStatus, DataVerb, DtoDataRequest, DtoDataResponse, DtoUntypedDataResponse, LogSource } from '@ipc';

import { IConfigurationService } from './configuration/configuration.service';
import { ICollectionService } from './pictures/collection.service';
import { IPictureService } from './pictures/picture.service';
import { IThumbnailService } from './pictures/thumbnail.service';
import { ILogService } from './system/log.service';
import { ISettingsService } from './system/settings.service';
import { ISystemService } from './system/system.service';
import { ITagService } from './tags/tag.service';
import { RoutedRequest } from './routed-request';

import SERVICETYPES from '../di/service.types';
import { ISecretImageService } from './secret/secret-image.service';
import { ISecretThumbService } from './secret/secret-thumb.service';

export interface IDataRouterService {
  delete(path: string, callback: (request: RoutedRequest<any>) => Promise<DtoDataResponse<any>>): void;
  get(path: string, callback: (request: RoutedRequest<any>) => Promise<DtoDataResponse<any>>): void;
  // PATCH is not used
  post(path: string, callback: (request: RoutedRequest<any>) => Promise<DtoDataResponse<any>>): void;
  put(path: string, callback: (request: RoutedRequest<any>) => Promise<DtoDataResponse<any>>): void;
  initialize(): void;
  routeRequest(request: DtoDataRequest<any>): Promise<DtoDataResponse<any>>;
}

type RouteCallback = (request: RoutedRequest<any>) => Promise<DtoDataResponse<any>>;

@injectable()
export class DataRouterService implements IDataRouterService {

  // <editor-fold desc='Private properties'>
  private deleteRoutes: Collections.Dictionary<string, RouteCallback>;
  private getRoutes: Collections.Dictionary<string, RouteCallback>;
  private postRoutes: Collections.Dictionary<string, RouteCallback>;
  private putRoutes: Collections.Dictionary<string, RouteCallback>;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    @inject(SERVICETYPES.LogService) private logService: ILogService,
    @inject(SERVICETYPES.ConfigurationService) private configurationService: IConfigurationService,
    @inject(SERVICETYPES.CollectionService) private collectionService: ICollectionService,
    @inject(SERVICETYPES.PictureService) private pictureService: IPictureService,
    @inject(SERVICETYPES.SecretImageService) private secretImageService: ISecretImageService,
    @inject(SERVICETYPES.SecretThumbService) private secretThumbService: ISecretThumbService,
    @inject(SERVICETYPES.SettingsService) private settingsService: ISettingsService,
    @inject(SERVICETYPES.SystemService) private systemService: ISystemService,
    @inject(SERVICETYPES.TagService) private tagService: ITagService,
    @inject(SERVICETYPES.ThumbnailService) private thumbnailService: IThumbnailService) {
    this.deleteRoutes = new Collections.Dictionary<string, RouteCallback>();
    this.getRoutes = new Collections.Dictionary<string, RouteCallback>();
    this.postRoutes = new Collections.Dictionary<string, RouteCallback>();
    this.putRoutes = new Collections.Dictionary<string, RouteCallback>();
  }
  // </editor-fold>

  // <editor-fold desc='IService interface methods'>
  public initialize(): void {
    this.logService.verbose(LogSource.Main, 'in initialize DataRouterService');
    this.configurationService.setRoutes(this);
    this.collectionService.setRoutes(this);
    this.pictureService.setRoutes(this);
    this.secretImageService.setRoutes(this);
    this.secretThumbService.setRoutes(this);
    this.settingsService.setRoutes(this);
    this.systemService.setRoutes(this);
    this.tagService.setRoutes(this);
    this.thumbnailService.setRoutes(this);
    this.logService.setRoutes(this);
    this.deleteRoutes.keys().forEach(route => this.logService.verbose(LogSource.Main, `registered route DELETE ${route}`));
    this.getRoutes.keys().forEach(route => this.logService.verbose(LogSource.Main, `registered route GET ${route}`));
    this.postRoutes.keys().forEach(route => this.logService.verbose(LogSource.Main, `registered route POST ${route}`));
    this.putRoutes.keys().forEach(route => this.logService.verbose(LogSource.Main, `registered route PUT ${route}`));
  }
  // </editor-fold>

  // <editor-fold desc='IDataRouterService interface methods'>
  public delete(path: string, callback: RouteCallback): void {
    this.deleteRoutes.setValue(path, callback);
  }

  public get(path: string, callback: RouteCallback): void {
    this.getRoutes.setValue(path, callback);
  }

  public post(path: string, callback: RouteCallback): void {
    this.postRoutes.setValue(path, callback);
  }

  public put(path: string, callback: RouteCallback): void {
    this.putRoutes.setValue(path, callback);
  }

  public routeRequest(request: DtoDataRequest<any>): Promise<DtoDataResponse<any>> {
    let result: Promise<DtoDataResponse<any>>;
    this.logService.verbose(LogSource.Main, `routing ${DataVerb[request.verb]} ${request.path}`);
    let routeDictionary: Collections.Dictionary<string, RouteCallback>;
    switch(request.verb) {
      case (DataVerb.DELETE): {
        routeDictionary = this.deleteRoutes;
        break;
      }
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
      this.logService.verbose(LogSource.Main, 'not allowed');
      const response: DtoUntypedDataResponse = {
        status: DataStatus.NotAllowed
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

    const splittedPath = request.path.split('?');

    const matchedKey = routeDictionary.keys().find(key => {
      const matcher = match(key);
      const matchResult = matcher(splittedPath[0]);
      return matchResult !== false;
    });
    if (matchedKey)
    {
      const matcher2 = match(matchedKey);
      const matchResult2: any = matcher2(splittedPath[0]);

      if (_.isObject(matchResult2)) {
        this.logService.verbose(LogSource.Main, `Route found: ${matchedKey}`);
        const routedRequest = new RoutedRequest();
        routedRequest.route = matchedKey
        routedRequest.path = (matchResult2 as any).path;
        routedRequest.params = (matchResult2 as any).params;
        routedRequest.data = request.data;
        routedRequest.applicationSecret = request.applicationSecret;
        routedRequest.queryParams = { };
        if (splittedPath.length > 1) {
          const queryParts = splittedPath[1].split('&');
          queryParts.forEach(part => {
            const kvp = part.split('=');
            if (kvp.length > 1) {
              routedRequest.queryParams[kvp[0]] = kvp[1];
            }
          });
        }
        const route = routeDictionary.getValue(matchedKey);
        if (route) {
          this.logService.debug(LogSource.Main, routedRequest);
          result = route(routedRequest);
        }
      } else {
        this.logService.error(LogSource.Main, 'strange error!');
        const response: DtoDataResponse<string> = {
          status: DataStatus.Error,
          data: 'Error in router'
        };
        result = Promise.resolve(response);
      }
    } else {
      this.logService.error(LogSource.Main, 'Route not found', splittedPath);
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
