import { Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';

import { DtoTreeBase } from '@ipc';
import { IpcService, DataRequestFactory } from '@ipc';
import { BaseTreeController, BaseTreeItem } from '@shared';
import { TagTreeItemFactory } from '../factories/tag.tree-item-factory';

@Injectable()
export class TagTreeController extends BaseTreeController<BaseTreeItem, DtoTreeBase> {

  // <editor-fold desc='Implementation of protected abstract getters'>
  protected get root(): string { return '/tag/tree'; }
  protected get subscribeToAfterCreate(): boolean { return true; }
  protected get subscribeToAfterUpdate(): boolean { return true; }
  protected get subscribeToAfterDelete(): boolean { return true; }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  constructor(
    ipcService: IpcService,
    dataRequestFactory: DataRequestFactory,
    itemFactory: TagTreeItemFactory) {
    super(ipcService, dataRequestFactory, itemFactory);
  }
  // </editor-fold>

  // <editor-fold desc='Implementation of abstract Public methods'>
  public processParamMap(_paramMap: ParamMap): void { }
  // </editor-fold>

}
