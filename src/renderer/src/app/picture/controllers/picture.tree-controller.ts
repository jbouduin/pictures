import { Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';

import { DtoTreeBase } from '@ipc';

import { IpcService, DataRequestFactory } from '@core';
import { BaseTreeController } from '@shared';
import { PictureTreeItem } from '../items/picture-tree-item';
import { PictureTreeItemFactory } from '../factories/picture.tree-item.factory';

@Injectable()
export class PictureTreeController extends BaseTreeController<PictureTreeItem, DtoTreeBase> {

  // <editor-fold desc='Private properties'>
  private currentRoot: string;
  // </editor-fold>

  // <editor-fold desc='Implementation of protected abstract getters'>
  protected get root(): string {
    return this.currentRoot;
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  constructor(
    ipcService: IpcService,
    dataRequestFactory: DataRequestFactory,
    itemFactory: PictureTreeItemFactory) {
    super(ipcService, dataRequestFactory, itemFactory);
  }
  // </editor-fold>

  // <editor-fold desc='Implementation of abstract Public methods'>
  public processParamMap(paramMap: ParamMap): void {
    switch(paramMap.get('parent')) {
      case 'collection': {
        this.currentRoot = `/collection/${paramMap.get('id')}/tree`;
        break;
      }
      default: {
        this.currentRoot = undefined;
      }
    }
  }
  // </editor-fold>
}
