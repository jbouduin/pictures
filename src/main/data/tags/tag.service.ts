import { injectable, inject } from "inversify";
import { IDataService } from "../data-service";
import { IDataRouterService } from "../data-router.service";

import { IDatabaseService, Tag } from "../../database";
import { ILogService } from "../../system";

import SERVICETYPES from "di/service.types";
import { DtoUntypedDataResponse, DtoDataResponse, DtoListDataResponse, DtoTreeBase, DataStatus } from "@ipc";
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
    router.get('/tag/tree', this.getTree.bind(this));
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
  private async getTag(request: RoutedRequest): Promise<DtoDataResponse<DtoGetTag>> {
    throw new Error('Not implemented');
  }

  private async getTags(request: RoutedRequest): Promise<DtoListDataResponse<DtoListTag>> {
    console.log('get tags');
    const result_1: DtoListDataResponse<DtoListTag> = {
      status: DataStatus.Ok,
      data: {
        listData: new Array<DtoListTag>(),
        count: 0
      }
    };
    return result_1;
  }

  private async getTree(request: RoutedRequest): Promise<DtoDataResponse<Array<DtoTreeBase>>> {
    const tags = await this.databaseService
      .getTagTreeRepository()
      .findTrees();

    const result = new Array<DtoTreeBase>();
    const root: DtoTreeBase = {
      label: 'all',
      queryString: undefined,
      children: tags.map( (tag: Tag) => this.convertTagToTreeBase(tag))
    };
    result.push(root);
    console.log(JSON.stringify(result, null, 2));
    const result_1: DtoDataResponse<Array<DtoTreeBase>> = {
      status: DataStatus.Ok,
      data: result
    };
    return result_1;
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

  // <editor-fold desc='Helper methods'>
  private convertTagToTreeBase(tag: Tag): DtoTreeBase {
    const result: DtoTreeBase = {
      queryString: `tag=${tag.id}`,
      label: tag.name,
      children: tag.children.map( (child: Tag) => this.convertTagToTreeBase(child))
    };
    return result;
  }
  // </editor-fold>
}
