import { ParamMap } from '@angular/router';

import { IpcService, IpcDataRequest, DataRequestFactory } from '@core';
import { DataVerb, DtoTreeBase, DtoTreeItemData } from '@ipc';

import { BaseTreeItem } from './base.tree-item';
import { BaseTreeItemFactory } from './base.tree-item-factory';
import { Subscription } from 'rxjs';
import { EventEmitter } from '@angular/core';

export abstract class BaseTreeController<T extends BaseTreeItem, Dto extends DtoTreeBase> {

  // <editor-fold desc='Private properties'>
  private treeItems: Array<T> | undefined;
  private currentTreeItem: T | undefined;
  private afterDeleteSubscription: Subscription;
  private afterUpdateSubscription: Subscription;
  private afterCreateSubscription: Subscription;
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
  protected abstract get subscribeToAfterCreate(): boolean;
  protected abstract get subscribeToAfterUpdate(): boolean;
  protected abstract get subscribeToAfterDelete(): boolean;
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

  // <editor-fold desc='Private subscribe methods'>
  private afterDelete(id: number): void {
    if (id) {
      const rootIndex = this.treeItems.findIndex( item => item.id === id);
      if (rootIndex >= 0) {
        this.treeItems.splice(rootIndex, 1);
      } else {
        let index = 0;
        let result = false;
        while(index < this.treeItems.length && !result) {
          result = this.removeChildById(this.treeItems[index], id);
          index++;
        }
      }
    }
  }

  private async afterUpdate(id: number): Promise<void> {
    if (id) {
      const treeItemData = await this.getTreeItemData(id);
      const treeItem = this.itemFactory.createTreeItem(treeItemData.treeItem);
      const rootIndex = this.treeItems.findIndex( item => item.id === id);
      if (rootIndex >= 0) {
        this.treeItems[rootIndex] = treeItem;
      } else {
        let index = 0;
        let result = false;
        while(index < this.treeItems.length && !result) {
          result = this.updateTreeItem(this.treeItems[index], treeItem);
          index++;
        }
      }
    }
  }

  private async afterCreate(id: number): Promise<void> {
    if (id) {
      const treeItemData = await this.getTreeItemData(id);
      const treeItem = this.itemFactory.createTreeItem(treeItemData.treeItem);
      if (this.currentTreeItem) { // XXX && this.currentTreeItem.id === treeItemData.parent
        this.currentTreeItem.children = [...this.currentTreeItem.children!, treeItem];
        return;
      }
      const rootIndex = this.treeItems.findIndex( item => item.id === treeItemData.parent);
      if (rootIndex >= 0) {
        this.treeItems[rootIndex].children.push(treeItem);
      } else {
        let index = 0;
        let result = false;
        while(index < this.treeItems.length && !result) {
          result = this.appendTreeItem(this.treeItems[index], treeItem, treeItemData.parent);
          index++;
        }
      }
    }
  }
  // </editor-fold>

  // <editor-fold desc='Private helper methods'>
  private removeChildById(treeItem: BaseTreeItem, id: number): boolean {
    if (treeItem.children.length === 0) {
      return false;
    }

    const rootIndex = treeItem.children.findIndex( item => item.id === id);
    if (rootIndex >= 0) {
      treeItem.children.splice(rootIndex, 1);
      return true;
    } else {
      let index = 0;
      let result = false;
      while(index < treeItem.children.length && !result) {
        result = this.removeChildById(treeItem.children[index], id);
        index++;
      }
      return result;
    }
  }

  private updateTreeItem(parent: BaseTreeItem, treeItem: BaseTreeItem): boolean {
    if (parent.children.length === 0) {
      return false;
    }

    const rootIndex = parent.children.findIndex( item => item.id === treeItem.id);
    if (rootIndex >= 0) {
      parent.children[rootIndex] = treeItem;
      return true;
    } else {
      let index = 0;
      let result = false;
      while(index < parent.children.length && !result) {
        result = this.updateTreeItem(parent.children[index], treeItem);
        index++;
      }
      return result;
    }
  }

  private appendTreeItem(parent: BaseTreeItem, treeItem: BaseTreeItem, parentId: number): boolean {
    if (parent.children.length === 0) {
      return false;
    }

    const rootIndex = parent.children.findIndex( item => item.id === parentId);
    if (rootIndex >= 0) {
      parent.children.push(treeItem);
      return true;
    } else {
      let index = 0;
      let result = false;
      while(index < parent.children.length && !result) {
        result = this.appendTreeItem(parent.children[index], treeItem, parentId);
        index++;
      }
      return result;
    }
  }

  private async getTreeItemData(id: number): Promise<DtoTreeItemData<Dto>> {
    if (this.root) {
      const request: IpcDataRequest = this.dataRequestFactory.createUntypedDataRequest(
        DataVerb.GET,
        `${this.root}/${id}`);

      const response = await this.ipcService.dataRequest<DtoTreeItemData<Dto>>(request);
      return response.data;
    } else {
      return undefined;
    }
  }
  // </editor-fold>

  // <editor-fold desc='Abstract public methods'>
  public abstract processParamMap(paramMap: ParamMap): void;
  // </editor-fold>

  // <editor-fold desc='Other methods'>
  public subscribeAfterCreate(emitter: EventEmitter<number>): void {
    if (this.subscribeToAfterCreate && !this.afterCreateSubscription) {
      this.afterCreateSubscription = emitter.subscribe(this.afterCreate.bind(this));
    }
  }

  public subscribeAfterDelete(emitter: EventEmitter<number>): void {
    if (this.subscribeToAfterDelete && !this.afterDeleteSubscription) {
      this.afterDeleteSubscription = emitter.subscribe(this.afterDelete.bind(this));
    }
  }

  public subscribeAfterUpdate(emitter: EventEmitter<number>) {
    if (this.subscribeToAfterUpdate && !this.afterUpdateSubscription) {
      this.afterUpdateSubscription = emitter.subscribe(this.afterUpdate.bind(this));
    }
  }

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
