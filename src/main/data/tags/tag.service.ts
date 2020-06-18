import { injectable, inject } from "inversify";
import { IDataService } from "../data-service";
import { IDataRouterService } from "../data-router.service";

import { IDatabaseService } from "../../database";
import { ILogService } from "../../system";

import SERVICETYPES from "di/service.types";
import { DtoUntypedDataResponse, DtoDataResponse, DtoListDataResponse } from "@ipc";
import { DtoGetTag, DtoListTag } from "@ipc";
import { RoutedRequest } from "data/routed-request";
export interface ITagService extends IDataService {

}

@injectable()
export class TagService implements ITagService {

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    @inject(SERVICETYPES.LogService) private logService: ILogService,
    @inject(SERVICETYPES.DatabaseService) private databaseService: IDatabaseService) { }
  // </editor-fold>

  // <editor-fold desc='IDataService interface methods'>
  public setRoutes(router: IDataRouterService): void {
    // DELETE
    router.delete('/tag/:tag', this.deleteTag.bind(this));
    // GET
    router.get('/tag', this.getTags.bind(this));
    router.get('/tag/:tag', this.getTag.bind(this));
    // router.get('/tag/:tag/pictures', this.getPictures.bind(this));
    // POST
    router.post('/tag', this.createTag.bind(this));
    // PUT
    router.put('/tag/:tag', this.updateTag.bind(this));
  }
  // </editor-fold>

  // <editor-fold desc='DELETE route callback'>
  private async deleteTag(_request: RoutedRequest): Promise<DtoUntypedDataResponse> {
    throw new Error('Not implemented');
  }
  // </editor-fold>

  // <editor-fold desc='GET routes callbacks'>
  private async getTags(request: RoutedRequest): Promise<DtoListDataResponse<DtoListTag>> {
    throw new Error('Not implemented');
  }

  private async getTag(request: RoutedRequest): Promise<DtoDataResponse<DtoGetTag>> {
    throw new Error('Not implemented');
  }
  // </editor-fold>

  // <editor-fold desc='POST routes callbacks'>
  private async createTag(request: RoutedRequest): Promise<DtoDataResponse<DtoListTag>> {
    throw new Error('Not implemented');
  }
  // </editor-fold>

  // <editor-fold desc='PUT routes callbacks'>
  private async updateTag(request: RoutedRequest): Promise<DtoDataResponse<DtoListTag>> {
    throw new Error('Not implemented');
  }
  // </editor-fold>
}
