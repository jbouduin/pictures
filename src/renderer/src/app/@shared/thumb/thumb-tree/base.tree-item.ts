import { BaseItem } from '../base-item';
import { DtoTreeBase } from '@ipc';

export abstract class BaseTreeItem extends BaseItem {

  // <editor-fold desc='Public properties'>
  public children: Array<BaseTreeItem>;
  public queryString: string;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(dto: DtoTreeBase) {
    super(dto.id, dto.name);
    this.queryString = dto.queryString;
    this.children = new Array<BaseTreeItem>();
  }
  // </editor-fold>
}
