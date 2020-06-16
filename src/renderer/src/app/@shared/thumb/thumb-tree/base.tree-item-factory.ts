import { DtoTreeBase } from '@ipc';
import { BaseTreeItem } from './base.tree-item';

export abstract class BaseTreeItemFactory<T extends BaseTreeItem, Dto extends DtoTreeBase>  {
  public abstract createTreeDataSet(dto: Array<Dto>): Array<T>;
}
