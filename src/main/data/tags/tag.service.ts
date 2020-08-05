import { injectable, inject } from "inversify";
import '../../../shared/extensions/array';
import { IDataService, DataService } from "../data-service";
import { IDataRouterService } from "../data-router.service";

import { IDatabaseService, Tag } from "../../database";
import { ILogService } from "../../system";

import SERVICETYPES from "di/service.types";
import { DtoUntypedDataResponse, DtoDataResponse, DtoListDataResponse, DtoTreeBase, DataStatus, LogSource, DtoTreeItemData, DtoSetTag, DtoNewTag } from "@ipc";
import { DtoGetTag, DtoListTag } from "@ipc";
import { IConfigurationService } from "../configuration/configuration.service";
import { RoutedRequest } from "../routed-request";

export interface ITagService extends IDataService { }

@injectable()
export class TagService extends DataService implements ITagService {

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    @inject(SERVICETYPES.LogService) logService: ILogService,
    @inject(SERVICETYPES.ConfigurationService) configurationService: IConfigurationService,
    @inject(SERVICETYPES.DatabaseService) databaseService: IDatabaseService) {
    super(logService, configurationService, databaseService);
  }
  // </editor-fold>

  // <editor-fold desc='IDataService interface methods'>
  public setRoutes(router: IDataRouterService): void {
    // DELETE
    router.delete('/tag/:tag', this.deleteTag.bind(this));
    // GET
    router.get('/tag', this.getTagListItems.bind(this));
    router.get('/tag/list', this.getTagListItems.bind(this));
    router.get('/tag/list/:tag', this.getTagListItem.bind(this));
    router.get('/tag/tree', this.getTagTreeItems.bind(this));
    router.get('/tag/tree/:tag', this.getTagTreeItem.bind(this));
    router.get('/tag/:tag', this.getTag.bind(this));
    // router.get('/tag/:tag/pictures', this.getPictures.bind(this));
    // POST
    router.post('/tag', this.createTag.bind(this));
    // PUT
    router.put('/tag/:tag', this.updateTag.bind(this));
  }
  // </editor-fold>

  // <editor-fold desc='DELETE route callback'>
  private async deleteTag(request: RoutedRequest<undefined>): Promise<DtoUntypedDataResponse> {
    const repository = this.databaseService.getTagRepository();

    try {
      await repository.findOneOrFail(request.params.tag);
      try {
        const deleteQueryBuilder = this.databaseService.getDeleteQueryBuilder();
        await deleteQueryBuilder
          .from('tag_closure')
          .where('tag_closure.id_ancestor = :id', { id: Number.parseInt(request.params.tag) })
          .orWhere('tag_closure.id_descendant = :id', { id: Number.parseInt(request.params.tag) })
          .execute();
        await deleteQueryBuilder.from(Tag).where("tag.id = :id", { id: Number.parseInt(request.params.tag) }).execute();
        const response: DtoUntypedDataResponse = {
          status: DataStatus.Ok
        };
        return response;
      }
      catch (error) {
        this.logService.error(LogSource.Main, error);
        const errorResponse: DtoUntypedDataResponse = {
          status: DataStatus.Error,
          message: `${error.name}: ${error.message}`
        };
        return errorResponse;
      }
    }
    catch (error) {
      this.logService.error(LogSource.Main, error);
      const errorResponse: DtoUntypedDataResponse = {
        status: DataStatus.NotFound,
        message: `${error.name}: ${error.message}`
      };
      return errorResponse;
    }
  }
  // </editor-fold>

  // <editor-fold desc='GET routes callbacks'>
  private async getTag(request: RoutedRequest<undefined>): Promise<DtoDataResponse<DtoGetTag>> {
    try {
      const tag = await this.databaseService
        .getTagRepository()
        .findOneOrFail(request.params.tag);
      const result: DtoGetTag = {
        id: tag.id,
        created: tag.created,
        modified: tag.modified,
        version: tag.version,
        name: tag.name,
        canAssign: tag.canAssign
      };
      const response: DtoDataResponse<DtoGetTag> = {
        status: DataStatus.Ok,
        data: result
      };
      return response;
    }
    catch (error) {
      const errorResponse: DtoDataResponse<DtoGetTag> = {
        status: DataStatus.Conflict,
        message: `${error.name}: ${error.message}`
      };
      return errorResponse;
    }
  }

  private async getTagListItem(request: RoutedRequest<undefined>): Promise<DtoDataResponse<DtoListTag>> {
    try {
      const tag = await this.databaseService.getTagRepository()
        .findOneOrFail(request.params.tag);
      const dtoListTag: DtoListTag = {
          id: tag.id,
          name: tag.name,
          canAssign: tag.canAssign,
          pictures: 0,
          thumbId: undefined
        };

      const response: DtoDataResponse<DtoListTag> = {
        status: DataStatus.Ok,
        data: dtoListTag
      };
      return response;
    }
    catch (error) {
      this.logService.error(LogSource.Main, error);
      const errorResponse: DtoDataResponse<DtoListTag> = {
        status: DataStatus.NotFound
      };
      return errorResponse;
    }
  }

  private async getTagListItems(request: RoutedRequest<undefined>): Promise<DtoListDataResponse<DtoListTag>> {
    const paginationTake = request.queryParams.pageSize || 20;
    let paginationSkip = ((request.queryParams.page || 1) - 1) * paginationTake;
    const parent = request.queryParams.tag;
    try {

      const repository = this.databaseService.getTagRepository();
      let qryResult: [Array<Tag>, number];

      if (parent)
      {
        const tag = await repository.findOneOrFail(parent);
        const numberOfDescendants = await repository.countDescendants(tag);
        const descendants = await repository.findDescendants(tag);
        paginationSkip++; // because the first entry is the parent tag itself
        qryResult = [
          descendants.slice(paginationSkip, paginationSkip + paginationTake),
          numberOfDescendants
        ];
      } else {
        qryResult = await this.databaseService.getTagRepository()
          .findAndCount({
            skip: paginationSkip,
            take: paginationTake
          });
      }

      const result = qryResult[0].map(tag => {
        const dtoListTag: DtoListTag = {
          id: tag.id,
          name: tag.name,
          canAssign: tag.canAssign,
          pictures: 0,
          thumbId: undefined
        };
        return dtoListTag;
      });
      const response: DtoListDataResponse<DtoListTag> = {
        status: DataStatus.Ok,
        data: {
          listData: result,
          count: qryResult[1]
        }
      };
      return response;
    }
    catch (error) {
      this.logService.error(LogSource.Main, error);
      const errorResponse: DtoListDataResponse<DtoListTag> = {
        status: DataStatus.NotFound
      };
      return errorResponse;
    }
  }

  private async getTagTreeItems(_request: RoutedRequest<undefined>): Promise<DtoDataResponse<Array<DtoTreeBase>>> {
    const tags = await this.databaseService
      .getTagRepository()
      .findTrees();

    const resultArray = new Array<DtoTreeBase>();
    const root: DtoTreeBase = {
      name: 'all',
      id: 0,
      queryString: undefined,
      children: tags.map( (tag: Tag) => this.convertTagToTreeBase(tag)).sortBy(tag => tag.name, false)
    };
    resultArray.push(root);
    const response: DtoDataResponse<Array<DtoTreeBase>> = {
      status: DataStatus.Ok,
      data: resultArray
    };
    return response;
  }

  private async getTagTreeItem(request: RoutedRequest<undefined>): Promise<DtoDataResponse<DtoTreeItemData<DtoTreeBase>>> {
    try {

      const tag = await this.databaseService
         .getTagRepository()
         .findOneOrFail(request.params.tag);

      const treeRepository = this.databaseService.getTagRepository();
      const tagWithChildren = await treeRepository
        .createDescendantsQueryBuilder("tag", "tagClosure", tag)
        .getOne();
      const parents = await treeRepository.findAncestors(tag);
      // console.log('parents', parents);
      const result: DtoTreeItemData<DtoTreeBase> = {
        treeItem: this.convertTagToTreeBase(tagWithChildren),
        parent: parents.length > 1 ? parents[1].id : 0
      };
      // const parents2 = await treeRepository.findAncestorsTree(tag);
      // console.log('parents2', parents);
      // console.log(JSON.stringify(result, null, 2));
      const response: DtoDataResponse<DtoTreeItemData<DtoTreeBase>> = {
        status: DataStatus.Ok,
        data: result
      };

      return response;
    }
    catch (error) {
      const errorResponse: DtoDataResponse<DtoTreeItemData<DtoTreeBase>> = {
        status: DataStatus.Conflict,
        message: `${error.name}: ${error.message}`
      };
      return errorResponse;
    }
  }
  // </editor-fold>

  // <editor-fold desc='POST routes callbacks'>
  private async createTag(request: RoutedRequest<DtoNewTag>): Promise<DtoDataResponse<DtoListTag>> {
    const repository = this.databaseService
      .getTagRepository();

    const parent = await repository.findOne(request.data.parent);
    const newTag = repository.create({
      name: request.data.name,
      canAssign: request.data.canAssign,
      parent: parent
    });

    try {
      const tag = await repository.save(newTag);
      const listItem: DtoListTag = {
        id: tag.id,
        name: tag.name,
        canAssign: tag.canAssign,
        pictures: 0,
        thumbId: undefined
      };
      const response: DtoDataResponse<DtoListTag> = {
        status: DataStatus.Ok,
        data: listItem
      };
      return response;
    }
    catch (error) {
      const errorResponse: DtoDataResponse<DtoListTag> = {
        status: DataStatus.Conflict,
        message: `${error.name}: ${error.message}`
      };
      return errorResponse;
    }
  }
  // </editor-fold>

  // <editor-fold desc='PUT routes callbacks'>
  private async updateTag(request: RoutedRequest<DtoSetTag>): Promise<DtoDataResponse<DtoListTag>> {
    const repository = this.databaseService.getTagRepository();
    try {
      const tag = await repository.findOneOrFail(request.params.tag);
      tag.name = request.data.name;
      tag.canAssign = request.data.canAssign;
      try {
        const savedTag = await repository.save(tag);
        const dtoListCollection: DtoListTag = {
          id: savedTag.id,
          name: savedTag.name,
          canAssign: savedTag.canAssign,
          pictures: 0,
          thumbId: undefined
        };
        const response: DtoDataResponse<DtoListTag> = {
          status: DataStatus.Ok,
          data: dtoListCollection,
        };
        return response;
      }
      catch (error) {
        const errorResponse: DtoDataResponse<DtoListTag> = {
          status: DataStatus.Conflict,
          data: undefined
        };
        return errorResponse;
      }
    }
    catch (error) {
      const errorResponse: DtoDataResponse<DtoListTag> = {
        status: DataStatus.Conflict,
        data: undefined
      };
      return errorResponse;
    }
  }
  // </editor-fold>

  // <editor-fold desc='Helper methods'>
  private convertTagToTreeBase(tag: Tag): DtoTreeBase {
    const result: DtoTreeBase = {
      queryString: `tag=${tag.id}`,
      name: tag.name,
      id: tag.id,
      children: tag.children ?
        tag.children.map( (child: Tag) => this.convertTagToTreeBase(child)).sortBy(tag => tag.name, false) :
        new Array<DtoTreeBase>()
    };
    return result;
  }
  // </editor-fold>
}
