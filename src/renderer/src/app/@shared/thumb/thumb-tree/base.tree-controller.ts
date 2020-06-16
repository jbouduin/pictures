import { ParamMap } from '@angular/router';

import { IpcService, IpcDataRequest, DataRequestFactory } from '@core';
import { DataVerb, DtoTreeBase } from '@ipc';

import { BaseTreeItem } from './base.tree-item';
import { BaseTreeItemFactory } from './base.tree-item-factory';

export abstract class BaseTreeController<T extends BaseTreeItem, Dto extends DtoTreeBase> {

  // <editor-fold desc='Private properties'>
  private treeItems: Array<T> | undefined;
  private currentTreeItem: T | undefined;
  // </editor-fold>

  // <editor-fold desc='Protected properties'>
  protected ipcService: IpcService;
  protected dataRequestFactory: DataRequestFactory;
  protected itemFactory: BaseTreeItemFactory<T, Dto>;
  // </editor-fold>

  // <editor-fold desc='Public get/set methods'>
  public get treeNodes(): Array<T> | undefined {
    return this.treeItems;
  }

  public get currentQueryString(): string {
    return this.currentTreeItem?.queryString || '';
  }
  // </editor-fold>

  // <editor-fold desc='Abstract protected getters'>
  protected abstract get root(): string;
  // </editor-fold>

  // <editor-fold desc='Abstract public getters'>
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  constructor(ipcService: IpcService, dataRequestFactory: DataRequestFactory, itemFactory: BaseTreeItemFactory<T, Dto>) {
    this.ipcService = ipcService;
    this.dataRequestFactory = dataRequestFactory;
    this.itemFactory = itemFactory;
    this.treeItems = undefined;
  }
  // </editor-fold>

  // <editor-fold desc='Abstract public methods'>
  public abstract processParamMap(paramMap: ParamMap): void;
  // </editor-fold>

  // <editor-fold desc='Other methods'>

  public async loadTree(): Promise<Array<T>> {
    if (this.root) {
      const request: IpcDataRequest = this.dataRequestFactory.createUntypedDataRequest(
        DataVerb.GET,
        this.root);

      const response = await this.ipcService.dataRequest<Array<Dto>>(request);
      this.treeItems = this.itemFactory.createTreeDataSet(response.data);
      return this.treeItems;
    } else {
      return undefined;
    }
  }

  public toggleTreeItem(treeItem: T) {
    this.currentTreeItem = treeItem;
  }
  // </editor-fold>
}
