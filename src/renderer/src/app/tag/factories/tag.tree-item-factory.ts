import { Injectable } from '@angular/core';
import { DtoTreeBase } from '@ipc';

import { BaseTreeItemFactory } from '@shared';
import { BaseTreeItem } from '@shared';
import { TagTreeItem } from '../items/tag.tree-item';

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
  public createTreeDataSet(treeBases: Array<DtoTreeBase>): Array<BaseTreeItem> {
    return treeBases.map(treeBase => this.processTreeBase(treeBase));
  }
  // </editor-fold>

  // <editor-fold desc='Private methods'>
  private processTreeBase(treeBase: DtoTreeBase): TagTreeItem {
    const result = new TagTreeItem(treeBase);
    result.children = treeBase.children.map(child => this.processTreeBase(child));
    return result;
  }
  // </editor-fold>
}
