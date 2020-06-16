import { Injectable } from '@angular/core';
import { DtoTreeBase } from '@ipc';
import { BaseTreeItemFactory } from '@shared';
import { PictureTreeItem } from '../items/picture-tree-item';

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
  public createTreeDataSet(dto: Array<DtoTreeBase>): Array<PictureTreeItem> {
    // XXX:
    throw new Error("Method not implemented.");
  }
  // </editor-fold>
}
