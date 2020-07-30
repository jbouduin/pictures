import { Injectable } from '@angular/core';
import { DtoTreeBase } from '@ipc';

import { BaseTreeItemFactory } from '@shared';
import { BaseTreeItem } from '@shared';

@Injectable({
  providedIn: 'root'
})
export class CollectionTreeItemFactory extends BaseTreeItemFactory<BaseTreeItem, DtoTreeBase> {

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    super();
  }
  // </editor-fold>

  // <editor-fold desc='Abstract method implementations'>
  public createTreeDataSet(_dto: Array<DtoTreeBase>): Array<BaseTreeItem> {
    return undefined;
  }

  public createTreeItem(_dto: DtoTreeBase): BaseTreeItem {
    return undefined;
  }
  // </editor-fold>
}
