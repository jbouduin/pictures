import { Injectable } from '@angular/core';
import { DtoTreeBase } from '@ipc';
import { BaseTreeItemFactory } from '@shared';
import { PictureTreeItem } from '../items/picture.tree-item';

@Injectable({
  providedIn: 'root'
})
export class PictureTreeItemFactory extends BaseTreeItemFactory<PictureTreeItem, DtoTreeBase> {

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    super();
  }
  // </editor-fold>

  // <editor-fold desc='Abstract method implementations'>
  public createTreeDataSet(treeBases: Array<DtoTreeBase>): Array<PictureTreeItem> {
    return treeBases.map(treeBase => this.processTreeBase(treeBase));
  }
  // </editor-fold>

  // <editor-fold desc='Private methods'>
  private processTreeBase(treeBase: DtoTreeBase): PictureTreeItem {
    const result = new PictureTreeItem(treeBase);
    result.children = treeBase.children.map(child => this.processTreeBase(child));
    return result;
  }
  // </editor-fold>
}
