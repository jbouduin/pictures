import { Injectable } from '@angular/core';
import { DtoTreeBase } from '@ipc';

import { BaseTreeItemFactory } from '@shared';
import { BaseTreeItem } from '@shared';

@Injectable({
  providedIn: 'root'
})
export class TagTreeItemFactory extends BaseTreeItemFactory<BaseTreeItem, DtoTreeBase> {

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    super();
  }
  // </editor-fold>

  // <editor-fold desc='Abstract method implementations'>
  public createTreeDataSet(_dto: Array<DtoTreeBase>): Array<BaseTreeItem> {
    return undefined;
    // const result = new PictureTreeItem(treeBase);
    // result.children = treeBase.children.map(child => this.processTreeBase(child));
    // return result;
  }
  // </editor-fold>
}
