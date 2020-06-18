import { BaseTreeItem } from '@shared';
import { DtoTreeBase } from '@ipc';

export class TagTreeItem extends BaseTreeItem {
  constructor(dto: DtoTreeBase) {
    super();
    this.label = dto.label;
    this.queryString = dto.queryString;
  }
}