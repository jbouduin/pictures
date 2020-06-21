import { DtoTreeBase } from './dto-tree-base';

export interface DtoTreeItemData<T extends DtoTreeBase> {
  treeItem: T;
  parent: number;
}
